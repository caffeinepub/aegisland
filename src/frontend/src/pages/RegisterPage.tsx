import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterLandParcel } from '../hooks/useQueries';

export default function RegisterPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [parcelId, setParcelId] = useState('');
  const [geoCoordinates, setGeoCoordinates] = useState('');
  const [area, setArea] = useState('');
  const [landUse, setLandUse] = useState('');
  const [description, setDescription] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const registerMutation = useRegisterLandParcel();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleRegister = async () => {
    if (!parcelId || !geoCoordinates || !area || !landUse) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        parcelId,
        geoCoordinates,
        deedHash: 'sha256:demo-hash',
      });
      setRegistrationComplete(true);
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-2xl">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please login with Internet Identity to register new properties.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-2xl">
          <Card className="border-primary/20 bg-primary/5 shadow-lg">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-md">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Property Registered Successfully</CardTitle>
              <CardDescription className="text-base">
                Your property has been recorded on the blockchain with an immutable timestamp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parcel ID:</span>
                    <span className="font-medium">{parcelId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-medium">{geoCoordinates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Use:</span>
                    <span className="font-medium">{landUse}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  asChild 
                  className="flex-1 shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1 transition-all duration-200 hover:bg-muted active:scale-95"
                >
                  <Link to="/property/$parcelId" params={{ parcelId }}>
                    View Property
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mx-auto max-w-3xl">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="mb-8 transition-all duration-200 hover:bg-muted active:scale-95"
        >
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Register New Property</h1>
          <p className="text-lg text-muted-foreground">
            Add a new land parcel to the blockchain registry
          </p>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Property Information</CardTitle>
              <CardDescription>Enter the details of the land parcel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="parcelId" className="text-sm font-medium">
                  Parcel ID
                </Label>
                <Input
                  id="parcelId"
                  placeholder="e.g., LR-2026-001234"
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  disabled={registerMutation.isPending}
                  className="h-11 transition-all duration-200 focus:ring-2"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the land parcel
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="geoCoordinates" className="text-sm font-medium">
                    Geographic Coordinates
                  </Label>
                  <Input
                    id="geoCoordinates"
                    placeholder="e.g., -1.2921, 36.8219"
                    value={geoCoordinates}
                    onChange={(e) => setGeoCoordinates(e.target.value)}
                    disabled={registerMutation.isPending}
                    className="h-11 transition-all duration-200 focus:ring-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="area" className="text-sm font-medium">
                    Land Area
                  </Label>
                  <Input
                    id="area"
                    placeholder="e.g., 2.5 acres"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    disabled={registerMutation.isPending}
                    className="h-11 transition-all duration-200 focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="landUse" className="text-sm font-medium">
                  Land Use Type
                </Label>
                <Select value={landUse} onValueChange={setLandUse} disabled={registerMutation.isPending}>
                  <SelectTrigger id="landUse" className="h-11 transition-all duration-200 focus:ring-2">
                    <SelectValue placeholder="Select land use type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Agricultural">Agricultural</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Additional property details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={registerMutation.isPending}
                  rows={4}
                  className="resize-none transition-all duration-200 focus:ring-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate({ to: '/dashboard' })}
              disabled={registerMutation.isPending}
              className="transition-all duration-200 hover:bg-muted active:scale-95"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={!parcelId || !geoCoordinates || !area || !landUse || registerMutation.isPending}
              className="min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Property'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
