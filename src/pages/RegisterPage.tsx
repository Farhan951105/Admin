import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { countries } from '../lib/countries';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    country: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [countrySearch, setCountrySearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      toast.success('Registration Successful!', {
        description: 'Please check your email for a verification code.',
      });
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error('Registration Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Admin Registration</CardTitle>
          <CardDescription>Create your admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required value={formData.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={value => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <div className="px-2 py-2 sticky top-0 bg-background z-10">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full px-2 py-1 border rounded text-sm"
                      autoFocus
                    />
                  </div>
                  {countries.filter(country =>
                    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                    country.code.toLowerCase().includes(countrySearch.toLowerCase())
                  ).length === 0 ? (
                    <div className="px-2 py-2 text-muted-foreground text-sm">No countries found</div>
                  ) : (
                    countries.filter(country =>
                      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                      country.code.toLowerCase().includes(countrySearch.toLowerCase())
                    ).map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        <span className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            alt={country.name}
                            width={20}
                            height={15}
                            style={{ borderRadius: 2, objectFit: 'cover' }}
                            loading="lazy"
                          />
                          <span>{country.name}</span>
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage; 