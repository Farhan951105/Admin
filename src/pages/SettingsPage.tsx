import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { countries } from "../lib/countries";

type Country = { code: string; name: string; flag: string };

const SettingsPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [country, setCountry] = useState("USA");

  // Mock function to simulate saving settings
  const saveSettings = async (settingType: string, shouldFail = false) => {
    setIsLoading(settingType);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    if (shouldFail) {
      toast.error(`Failed to save ${settingType}`, {
        description: 'An unexpected error occurred. Please try again.',
      });
    } else {
      toast.success(`${settingType} saved successfully!`);
    }
    
    setIsLoading(null);
  };

  const renderProfileTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information and email address.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="Admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <CountrySearchSelect />
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveSettings('Profile')} disabled={isLoading === 'Profile'}>
            {isLoading === 'Profile' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Update your password and security preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveSettings('Password')} disabled={isLoading === 'Password'}>
            {isLoading === 'Password' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="tournament-updates" className="font-medium">Tournament Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about tournament changes</p>
            </div>
            <Switch id="tournament-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="system-alerts" className="font-medium">System Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive system maintenance alerts</p>
            </div>
            <Switch id="system-alerts" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveSettings('Preferences')} disabled={isLoading === 'Preferences'}>
            {isLoading === 'Preferences' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderGeneralTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your general application preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">EST</SelectItem>
                <SelectItem value="pst">PST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveSettings('General', true)} disabled={isLoading === 'General'}>
            {isLoading === 'General' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform settings.</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">{renderProfileTab()}</TabsContent>
        <TabsContent value="security">{renderSecurityTab()}</TabsContent>
        <TabsContent value="notifications">{renderNotificationsTab()}</TabsContent>
        <TabsContent value="general">{renderGeneralTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

function CountrySearchSelect() {
  const [search, setSearch] = React.useState("");
  const filteredCountries = (countries as Country[]).filter((c: Country) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div className="px-2 py-1 sticky top-0 bg-popover z-10">
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
          autoFocus
        />
      </div>
      {filteredCountries.length === 0 ? (
        <div className="px-2 py-2 text-muted-foreground text-sm">No countries found</div>
      ) : (
        filteredCountries.map((country: Country) => (
          <SelectItem key={country.code} value={country.name}>
            <img
              src={country.flag}
              alt={country.code + ' flag'}
              style={{ width: 20, height: 14, marginRight: 8, display: 'inline-block', verticalAlign: 'middle' }}
            />
            {country.name}
          </SelectItem>
        ))
      )}
    </>
  );
}

export default SettingsPage; 