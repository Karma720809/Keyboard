import { PostSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground relative py-16">
      <PostSkeleton />
    </main>
  );
}
