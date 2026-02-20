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
} from 'lucide-react';
import { useGetLandRecord } from '../hooks/useQueries';

export default function PropertyDetailsPage() {
  const { parcelId } = useParams({ from: '/property/$parcelId' });
  const { data: propertyData, isLoading, isFetching } = useGetLandRecord(parcelId);

  const mockPropertyData = {
    parcelId: parcelId,
    geoCoordinates: '-1.2921, 36.8219',
    currentOwner: 'John Doe',
    ownerPrincipal: 'abc123...xyz789',
    status: 'ACTIVE',
    registrationDate: '2024-03-15',
    area: '2.5 acres',
    deedHash: 'sha256:a1b2c3d4e5f6...',
    landUse: 'Residential',
    ownershipHistory: [
      {
        from: 'Previous Owner',
        to: 'John Doe',
        timestamp: '2024-03-15T10:30:00Z',
        transactionHash: 'tx:0x1234...5678',
      },
      {
        from: 'Original Owner',
        to: 'Previous Owner',
        timestamp: '2020-06-10T14:20:00Z',
        transactionHash: 'tx:0xabcd...efgh',
      },
    ],
    documents: [
      {
        type: 'Title Deed',
        hash: 'sha256:a1b2c3d4e5f6...',
        uploadDate: '2024-03-15',
        verified: true,
      },
      {
        type: 'Survey Report',
        hash: 'sha256:b2c3d4e5f6a7...',
        uploadDate: '2024-03-14',
        verified: true,
      },
    ],
  };

  const displayData = propertyData || mockPropertyData;
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

        {isLoading ? (
          <DetailSkeleton />
        ) : (
          <>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{displayData.parcelId}</h1>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {displayData.geoCoordinates}
                </p>
              </div>
              <Badge 
                variant={displayData.status === 'ACTIVE' ? 'default' : 'destructive'} 
                className="w-fit text-sm"
              >
                {displayData.status}
              </Badge>
            </div>

            {/* Property Overview */}
            <Card className="mb-8 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Property Information</CardTitle>
                <CardDescription>Blockchain-verified land record details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Current Owner
                    </div>
                    <div className="font-medium">{displayData.currentOwner}</div>
                    <div className="text-xs text-muted-foreground">{displayData.ownerPrincipal}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Registration Date
                    </div>
                    <div className="font-medium">{displayData.registrationDate}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Land Area
                    </div>
                    <div className="font-medium">{displayData.area}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Land Use
                    </div>
                    <div className="font-medium">{displayData.landUse}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Deed Hash
                    </div>
                    <div className="truncate font-mono text-sm">{displayData.deedHash}</div>
                  </div>
                  <div className="pt-2">
                    <Button 
                      asChild 
                      className="w-full shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      <Link to="/transfer/$parcelId" params={{ parcelId }}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Transfer Property
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for History and Documents */}
            <Tabs defaultValue="history" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="history" className="transition-all duration-200">
                  Ownership History
                </TabsTrigger>
                <TabsTrigger value="documents" className="transition-all duration-200">
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card className="shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Ownership History</CardTitle>
                    <CardDescription>Immutable blockchain record of all ownership transfers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {displayData.ownershipHistory.map((transfer, index) => (
                        <div key={index}>
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                              <ArrowRightLeft className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="font-medium">
                                  {transfer.from} → {transfer.to}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(transfer.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-3 w-3" />
                                <span className="font-mono">{transfer.transactionHash}</span>
                              </div>
                            </div>
                          </div>
                          {index < displayData.ownershipHistory.length - 1 && (
                            <Separator className="my-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Verified Documents</CardTitle>
                    <CardDescription>All documents are cryptographically hashed and stored on-chain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {displayData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-border/50 p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">{doc.type}</div>
                              <div className="text-xs text-muted-foreground">
                                Uploaded: {doc.uploadDate}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {doc.verified && (
                              <Badge variant="outline" className="gap-1.5 text-xs">
                                <Shield className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="transition-all duration-200 hover:bg-muted active:scale-95"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
