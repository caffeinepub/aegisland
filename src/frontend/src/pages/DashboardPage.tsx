import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from '@tanstack/react-router';
import { Home, FileText, ArrowRightLeft, Plus, Shield, AlertCircle, Loader2, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllLandRecords, useGetPendingTransfers, useGetUserProfile } from '../hooks/useQueries';
import { EmptyState } from '../components/EmptyState';

export default function DashboardPage() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: landRecords, isLoading: isLoadingRecords, isFetching: isFetchingRecords } = useGetAllLandRecords();
  const { data: pendingTransfers, isLoading: isLoadingTransfers, isFetching: isFetchingTransfers } = useGetPendingTransfers();
  const { data: userProfile, isLoading: isLoadingProfile, isFetching: isFetchingProfile } = useGetUserProfile();

  if (!isAuthenticated) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-2xl">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please login with Internet Identity to access your dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-8 text-center">
            <Button 
              onClick={login} 
              size="lg"
              className="h-12 px-8 shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Login with Internet Identity
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userProperties = landRecords || [];
  const transfers = pendingTransfers || [];

  const isLoading = isLoadingRecords || isLoadingTransfers || isLoadingProfile;
  const isSyncing = (isFetchingRecords || isFetchingTransfers || isFetchingProfile) && !isLoading;

  const StatCardSkeleton = () => (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-24 animate-shimmer" />
        <Skeleton className="mt-2 h-9 w-16 animate-shimmer" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-20 animate-shimmer" />
      </CardContent>
    </Card>
  );

  const PropertyCardSkeleton = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-40 animate-shimmer" />
        <Skeleton className="mt-2 h-4 w-32 animate-shimmer" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full animate-shimmer" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-12 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your properties and track transactions on the blockchain.
          </p>
        </div>
        {isSyncing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Syncing...</span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">Total Properties</CardDescription>
                <CardTitle className="text-4xl">{userProperties.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Home className="h-3.5 w-3.5" />
                  Active parcels
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">Pending Transfers</CardDescription>
                <CardTitle className="text-4xl">{transfers.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  In progress
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">Documents</CardDescription>
                <CardTitle className="text-4xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Verified on-chain
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">Security Status</CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="h-6 w-6 text-primary" />
                  Secure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">All records verified</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="properties" className="transition-all duration-200">
            My Properties
          </TabsTrigger>
          <TabsTrigger value="transfers" className="transition-all duration-200">
            Transfers
          </TabsTrigger>
          <TabsTrigger value="activity" className="transition-all duration-200">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Properties</h2>
            <Button 
              asChild
              className="transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <Link to="/register">
                <Plus className="mr-2 h-4 w-4" />
                Register New Property
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-6">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : userProperties.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No properties registered yet"
              description="Get started by registering your first property on the blockchain. Your land records will be securely stored and easily accessible."
              action={{
                label: 'Register Property',
                onClick: () => navigate({ to: '/register' }),
              }}
            />
          ) : (
            <div className="grid gap-6">
              {userProperties.map((property: any) => (
                <Card 
                  key={property.parcelId}
                  className="shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{property.parcelId}</CardTitle>
                        <CardDescription>{property.location}</CardDescription>
                      </div>
                      <Badge className="text-xs">{property.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium">{property.area}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Registered:</span>
                          <span className="font-medium">{property.registrationDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="transition-all duration-200 hover:bg-muted active:scale-95"
                        >
                          <Link to="/property/$parcelId" params={{ parcelId: property.parcelId }}>
                            View Details
                          </Link>
                        </Button>
                        <Button 
                          asChild 
                          size="sm"
                          className="transition-all duration-200 hover:shadow-md active:scale-95"
                        >
                          <Link to="/transfer/$parcelId" params={{ parcelId: property.parcelId }}>
                            Transfer
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <h2 className="text-xl font-semibold">Pending Transfers</h2>
          {isLoading ? (
            <PropertyCardSkeleton />
          ) : transfers.length === 0 ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No pending transfers"
              description="You don't have any property transfers in progress. When you initiate a transfer, it will appear here."
            />
          ) : (
            <div className="grid gap-6">
              {transfers.map((transfer: any) => (
                <Card 
                  key={transfer.parcelId}
                  className="shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{transfer.parcelId}</CardTitle>
                        <CardDescription>
                          {transfer.type} transfer to {transfer.buyer}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">{transfer.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Initiated:</span>{' '}
                        <span className="font-medium">{transfer.initiatedDate}</span>
                      </div>
                      <Button 
                        size="sm"
                        className="transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        View Transfer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardContent className="py-6">
                  <Skeleton className="h-16 w-full animate-shimmer" />
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="py-6">
                  <Skeleton className="h-16 w-full animate-shimmer" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Your property transactions and updates will appear here. Start by registering a property or initiating a transfer."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
