import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  User,
  Calendar,
  FileText,
  ArrowRightLeft,
  Shield,
  ChevronLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useGetLandRecord } from '../hooks/useQueries';
import { EmptyState } from '../components/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PropertyDetailsPage() {
  const { parcelId } = useParams({ from: '/property/$parcelId' });
  const { data: propertyData, isLoading, isFetching, error } = useGetLandRecord(parcelId);

  const isSyncing = isFetching && !isLoading;

  const DetailSkeleton = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 animate-shimmer" />
        <Skeleton className="h-5 w-48 animate-shimmer" />
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48 animate-shimmer" />
          <Skeleton className="mt-2 h-4 w-64 animate-shimmer" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full animate-shimmer" />
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-5xl">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="transition-all duration-200 hover:bg-muted active:scale-95"
            >
              <Link to="/search">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Link>
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Property Not Found</AlertTitle>
            <AlertDescription>
              The property with ID "{parcelId}" could not be found in the blockchain registry.
              Please verify the parcel ID and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const ownershipHistory = (propertyData as any).ownershipHistory || [];
  const documents = (propertyData as any).documents || [];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="transition-all duration-200 hover:bg-muted active:scale-95"
          >
            <Link to="/search">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
          {isSyncing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
            </div>
          )}
        </div>

        {/* Property Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {(propertyData as any).parcelId}
            </h1>
            <Badge className="text-sm">{(propertyData as any).status}</Badge>
          </div>
          <p className="flex items-center gap-2 text-lg text-muted-foreground">
            <MapPin className="h-5 w-5" />
            {(propertyData as any).location || 'Location not specified'}
          </p>
        </div>

        {/* Property Details Card */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Property Information
            </CardTitle>
            <CardDescription>Verified blockchain record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Current Owner
                </div>
                <div className="font-medium">{(propertyData as any).currentOwner || 'Unknown'}</div>
                <div className="text-xs text-muted-foreground">
                  {(propertyData as any).ownerPrincipal || 'Principal not available'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Registration Date
                </div>
                <div className="font-medium">{(propertyData as any).registrationDate || 'Not available'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Area</div>
                <div className="font-medium">{(propertyData as any).area || 'Not specified'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Land Use</div>
                <div className="font-medium">{(propertyData as any).landUse || 'Not specified'}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Geo Coordinates</div>
              <div className="font-mono text-sm">{(propertyData as any).geoCoordinates || 'Not available'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Deed Hash</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-xs">
                  {(propertyData as any).deedHash || 'Not available'}
                </code>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for History and Documents */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="history" className="transition-all duration-200">
              Ownership History
            </TabsTrigger>
            <TabsTrigger value="documents" className="transition-all duration-200">
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ownership History</h2>
            </div>
            {ownershipHistory.length === 0 ? (
              <EmptyState
                icon={ArrowRightLeft}
                title="No ownership history available"
                description="The ownership history for this property has not been recorded yet or is not available."
              />
            ) : (
              <div className="space-y-4">
                {ownershipHistory.map((record: any, index: number) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <ArrowRightLeft className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {record.from} → {record.to}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {new Date(record.timestamp).toLocaleDateString()}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Transaction: {record.transactionHash}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Property Documents</h2>
            </div>
            {documents.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No documents available"
                description="There are no documents associated with this property yet. Documents will appear here once they are uploaded and verified."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {documents.map((doc: any, index: number) => (
                  <Card 
                    key={index}
                    className="shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{doc.type}</CardTitle>
                        {doc.verified && (
                          <Badge variant="default" className="text-xs">
                            <Shield className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        Uploaded: {doc.uploadDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Document Hash</div>
                        <code className="block rounded bg-muted px-2 py-1 text-xs">
                          {doc.hash}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            asChild
            className="transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <Link to="/transfer/$parcelId" params={{ parcelId }}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transfer Ownership
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
