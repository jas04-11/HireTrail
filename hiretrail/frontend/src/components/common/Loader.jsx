export const Spinner = ({ size = 20 }) => (
  <div
    className="animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
    style={{ width: size, height: size }}
  />
);

export const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Spinner size={32} />
  </div>
);

export const CardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-3 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
    </div>
  </div>
);
