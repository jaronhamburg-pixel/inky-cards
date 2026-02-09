import { Skeleton } from '@/components/ui/skeleton';

export default function CardDetailLoading() {
  return (
    <div className="container-luxury py-12">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="w-20 h-24 rounded-md" />
            <Skeleton className="w-20 h-24 rounded-md" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
