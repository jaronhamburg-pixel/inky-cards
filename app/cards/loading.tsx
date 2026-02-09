import { CardGridSkeleton } from '@/components/ui/skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function CardsLoading() {
  return (
    <div className="container-luxury py-12">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      <Skeleton className="h-4 w-40 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
            <Skeleton className="h-6 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </aside>
        <div className="lg:col-span-3">
          <CardGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
