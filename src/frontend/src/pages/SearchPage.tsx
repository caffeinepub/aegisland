import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useSearchLandRecords } from '../hooks/useQueries';
import { EmptyState } from '../components/EmptyState';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading, isFetching } = useSearchLandRecords(searchQuery);

  const displayResults = searchResults || [];
  const isSyncing = isFetching && !isLoading;
  const hasSearched = searchQuery.length > 0;

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <Skeleton className="h-6 w-40 animate-shimmer" />
        <Skeleton className="h-4 w-32 animate-shimmer" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-3/4 animate-shimmer" />
        </div>
        <Skeleton className="h-10 w-full animate-shimmer" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Search Properties</h1>
          <p className="text-lg text-muted-foreground">
            Search the blockchain registry for land parcels and ownership records.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by parcel ID, location, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-4 text-base shadow-sm transition-all duration-200 focus:shadow-md focus:ring-2"
            />
            {isSyncing && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {!hasSearched ? (
          <EmptyState
            icon={Search}
            title="Start searching"
            description="Enter a parcel ID, location, or owner name to search for properties in the blockchain registry."
          />
        ) : isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayResults.map((property: any) => (
              <Card 
                key={property.parcelId} 
                className="overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{property.parcelId}</CardTitle>
                    <Badge 
                      variant={property.status === 'ACTIVE' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{property.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{property.owner}</span>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    className="w-full transition-all duration-200 hover:shadow-md active:scale-95"
                  >
                    <Link to="/property/$parcelId" params={{ parcelId: property.parcelId }}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No properties found"
            description="No properties match your search criteria. Try adjusting your search terms or browse all available properties."
          />
        )}
      </div>
    </div>
  );
}
