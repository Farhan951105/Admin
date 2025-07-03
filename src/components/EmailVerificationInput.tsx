import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface EmailVerificationInputProps {
  onComplete?: (code: string) => void;
  onResend?: () => void;
  email?: string;
  isLoading?: boolean;
}

const EmailVerificationInput = ({ 
  onComplete, 
  onResend, 
  email,
  isLoading = false 
}: EmailVerificationInputProps) => {
  const [value, setValue] = React.useState("");

  const handleComplete = (code: string) => {
    setValue(code);
    if (code.length === 6) {
      onComplete?.(code);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          {email ? (
            <>Enter the 6-digit code sent to <strong>{email}</strong></>
          ) : (
            "Enter the 6-digit verification code sent to your email"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={handleComplete}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button 
            variant="link" 
            onClick={onResend}
            disabled={isLoading}
            className="text-primary"
          >
            Resend Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationInput; 