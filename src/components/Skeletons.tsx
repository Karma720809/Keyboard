import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-md ${className}`} />
);

export const TableSkeleton = () => {
  return (
    <div className="apple-panel rounded-2xl overflow-hidden border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-black/40 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 w-16 text-center"><Skeleton className="h-4 w-6 mx-auto" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
              <th className="px-6 py-4 w-32 text-center"><Skeleton className="h-4 w-20 mx-auto" /></th>
              <th className="px-6 py-4 w-32 text-center"><Skeleton className="h-4 w-24 mx-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-4 mx-auto" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                <td className="px-6 py-4 text-center text-white/40"><Skeleton className="h-4 w-20 mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-16 px-6">
      <div className="mb-8">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="apple-panel p-10 md:p-14 rounded-[32px] border border-white/10 shadow-2xl">
        <div className="border-b border-white/10 pb-8 mb-8">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="pt-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};
