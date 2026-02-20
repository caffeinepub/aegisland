import { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useTransferOwnership } from '../hooks/useQueries';

export default function TransferPage() {
  const { parcelId } = useParams({ from: '/transfer/$parcelId' });
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [buyerPrincipal, setBuyerPrincipal] = useState('');
  const [transferComplete, setTransferComplete] = useState(false);

  const transferMutation = useTransferOwnership();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleTransfer = async () => {
    if (!buyerPrincipal) return;

    try {
      await transferMutation.mutateAsync({
        parcelId,
        newOwner: buyerPrincipal,
      });
      setTransferComplete(true);
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
              Please login with Internet Identity to transfer properties.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (transferComplete) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="mx-auto max-w-2xl">
          <Card className="border-primary/20 bg-primary/5 shadow-lg">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-md">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Transfer Initiated Successfully</CardTitle>
              <CardDescription className="text-base">
                The property transfer has been recorded on the blockchain and is now pending completion.
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
                    <span className="text-muted-foreground">New Owner:</span>
                    <span className="truncate font-mono text-xs">{buyerPrincipal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">Pending</span>
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
          <Link to="/property/$parcelId" params={{ parcelId }}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Link>
        </Button>

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Transfer Property</h1>
          <p className="text-lg text-muted-foreground">
            Initiate a blockchain-verified property transfer for {parcelId}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Transfer Details</CardTitle>
              <CardDescription>Enter the new owner's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="buyerPrincipal" className="text-sm font-medium">
                  Buyer's Principal ID
                </Label>
                <Input
                  id="buyerPrincipal"
                  placeholder="Enter the buyer's Internet Identity principal"
                  value={buyerPrincipal}
                  onChange={(e) => setBuyerPrincipal(e.target.value)}
                  disabled={transferMutation.isPending}
                  className="h-11 font-mono text-sm transition-all duration-200 focus:ring-2"
                />
                <p className="text-xs text-muted-foreground">
                  The buyer must have a valid Internet Identity principal
                </p>
              </div>

              <Alert className="border-primary/20 bg-primary/5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  This action will initiate a property transfer on the blockchain. The transfer will be recorded
                  immutably and cannot be reversed without the buyer's consent.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/20 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Transfer Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    1
                  </span>
                  <span className="pt-0.5">Transfer request is submitted to the blockchain</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    2
                  </span>
                  <span className="pt-0.5">Buyer receives notification and reviews the transfer</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    3
                  </span>
                  <span className="pt-0.5">Upon acceptance, ownership is transferred automatically</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    4
                  </span>
                  <span className="pt-0.5">All records are updated on the blockchain ledger</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate({ to: '/property/$parcelId', params: { parcelId } })}
              disabled={transferMutation.isPending}
              className="transition-all duration-200 hover:bg-muted active:scale-95"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!buyerPrincipal || transferMutation.isPending}
              className="min-w-[160px] shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              {transferMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating...
                </>
              ) : (
                'Initiate Transfer'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
