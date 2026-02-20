import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

// This file contains React Query hooks for backend integration with real-time synchronization

export function useGetAllLandRecords() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['landRecords'],
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Replace with actual backend call
      // return actor.getAllLandRecords();
      return [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

export function useGetLandRecord(parcelId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['landRecord', parcelId],
    queryFn: async () => {
      if (!actor) return null;
      // TODO: Replace with actual backend call
      // return actor.getLandRecord(parcelId);
      return null;
    },
    enabled: !!actor && !isFetching && !!parcelId,
    refetchInterval: 10000, // Refetch every 10 seconds for property details
    staleTime: 8000, // Consider data stale after 8 seconds
    refetchOnWindowFocus: true,
  });
}

export function useSearchLandRecords(query: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['searchLandRecords', query],
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Replace with actual backend call
      // return actor.searchLandRecords(query);
      return [];
    },
    enabled: !!actor && !isFetching && !!query,
    refetchInterval: 10000, // Refetch every 10 seconds for search results
    staleTime: 8000,
    refetchOnWindowFocus: true,
  });
}

export function useRegisterLandParcel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      parcelId: string;
      geoCoordinates: string;
      deedHash: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      // TODO: Replace with actual backend call
      // return actor.registerLandParcel(data.parcelId, data.geoCoordinates, data.deedHash);
      return data;
    },
    onMutate: async (newProperty) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['landRecords'] });
      await queryClient.cancelQueries({ queryKey: ['searchLandRecords'] });
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });

      // Snapshot previous values
      const previousLandRecords = queryClient.getQueryData(['landRecords']);
      const previousUserProfile = queryClient.getQueryData(['userProfile']);

      // Optimistically update land records cache
      queryClient.setQueryData(['landRecords'], (old: any) => {
        if (!old) return old;
        return [...old, { ...newProperty, status: 'ACTIVE', registrationDate: new Date().toISOString() }];
      });

      // Return context with snapshot for rollback
      return { previousLandRecords, previousUserProfile };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousLandRecords) {
        queryClient.setQueryData(['landRecords'], context.previousLandRecords);
      }
      if (context?.previousUserProfile) {
        queryClient.setQueryData(['userProfile'], context.previousUserProfile);
      }
      toast.error('Failed to register property', {
        description: error instanceof Error ? error.message : 'An error occurred during registration',
      });
    },
    onSuccess: () => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: ['landRecords'] });
      queryClient.invalidateQueries({ queryKey: ['searchLandRecords'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Property registered successfully', {
        description: 'Your property has been recorded on the blockchain',
      });
    },
  });
}

export function useTransferOwnership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { parcelId: string; newOwner: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      // TODO: Replace with actual backend call
      // return actor.transferOwnership(data.parcelId, data.newOwner);
      return data;
    },
    onMutate: async (transferData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['landRecord', transferData.parcelId] });
      await queryClient.cancelQueries({ queryKey: ['landRecords'] });
      await queryClient.cancelQueries({ queryKey: ['pendingTransfers'] });
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });

      // Snapshot previous values
      const previousLandRecord = queryClient.getQueryData(['landRecord', transferData.parcelId]);
      const previousLandRecords = queryClient.getQueryData(['landRecords']);
      const previousPendingTransfers = queryClient.getQueryData(['pendingTransfers']);
      const previousUserProfile = queryClient.getQueryData(['userProfile']);

      // Optimistically update property details
      queryClient.setQueryData(['landRecord', transferData.parcelId], (old: any) => {
        if (!old) return old;
        return { ...old, currentOwner: transferData.newOwner, status: 'PENDING_TRANSFER' };
      });

      // Optimistically add to pending transfers
      queryClient.setQueryData(['pendingTransfers'], (old: any) => {
        if (!old) return old;
        return [
          ...old,
          {
            parcelId: transferData.parcelId,
            newOwner: transferData.newOwner,
            status: 'Pending',
            initiatedDate: new Date().toISOString(),
          },
        ];
      });

      return { previousLandRecord, previousLandRecords, previousPendingTransfers, previousUserProfile };
    },
    onError: (error, variables, context) => {
      // Rollback all optimistic updates
      if (context?.previousLandRecord) {
        queryClient.setQueryData(['landRecord', variables.parcelId], context.previousLandRecord);
      }
      if (context?.previousLandRecords) {
        queryClient.setQueryData(['landRecords'], context.previousLandRecords);
      }
      if (context?.previousPendingTransfers) {
        queryClient.setQueryData(['pendingTransfers'], context.previousPendingTransfers);
      }
      if (context?.previousUserProfile) {
        queryClient.setQueryData(['userProfile'], context.previousUserProfile);
      }
      toast.error('Failed to initiate transfer', {
        description: error instanceof Error ? error.message : 'An error occurred during transfer',
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch all affected queries
      queryClient.invalidateQueries({ queryKey: ['landRecord', variables.parcelId] });
      queryClient.invalidateQueries({ queryKey: ['landRecords'] });
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Transfer initiated successfully', {
        description: 'The ownership transfer has been recorded on the blockchain',
      });
    },
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!actor) return null;
      // TODO: Replace with actual backend call
      // return actor.getUserProfile();
      return null;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000,
    refetchOnWindowFocus: true,
  });
}

export function useGetPendingTransfers() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['pendingTransfers'],
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Replace with actual backend call
      // return actor.getPendingTransfers();
      return [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds for pending transfers (most volatile)
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
}
