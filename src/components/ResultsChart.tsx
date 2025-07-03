
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, isValid } from 'date-fns';
import type{ HandHistory } from '../lib/types';
import { formatCurrency } from '../lib/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import type{ChartConfig} from './ui/chart';

interface ResultsChartProps {
  hands: HandHistory[];
}

const chartConfig = {
  cumulativeResult: {
    label: 'Cumulative Result',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const ResultsChart = ({ hands }: ResultsChartProps) => {
  const chartData = useMemo(() => {
    if (!hands || hands.length === 0) {
      return [];
    }

    // Filter out hands with invalid dates and sort by date ascending
    const validHands = hands.filter(hand => {
      const date = new Date(hand.date);
      return isValid(date);
    });

    if (validHands.length === 0) {
      return [];
    }

    const sortedHands = validHands.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulativeResult = 0;
    return sortedHands.map(hand => {
      cumulativeResult += hand.result;
      const dateObj = new Date(hand.date);
      return {
        date: dateObj.getTime(),
        result: hand.result,
        cumulativeResult: cumulativeResult,
      };
    });
  }, [hands]);

  if (chartData.length < 2) {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Results Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Not enough data to display a chart. Play at least two hands.
                </div>
            </CardContent>
        </Card>
    );
  }

  const safeLabelFormatter = (label: any) => {
    try {
      const date = new Date(label);
      if (isValid(date)) {
        return format(date, "dd MMM yyyy, p");
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error, 'Label:', label);
      return 'Invalid date';
    }
  };

  const safeTickFormatter = (tick: any) => {
    try {
      const date = new Date(tick);
      if (isValid(date)) {
        return format(date, 'MMM dd');
      }
      return '';
    } catch (error) {
      console.error('Error formatting tick:', error, 'Tick:', tick);
      return '';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Results Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={safeTickFormatter}
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
              />
              <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={safeLabelFormatter}
                    formatter={(value) => formatCurrency(value as number)}
                    indicator="line"
                  />
                }
              />
              <Line
                dataKey="cumulativeResult"
                type="monotone"
                stroke="var(--color-cumulativeResult)"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsChart;
