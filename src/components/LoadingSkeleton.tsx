const LoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[16px] p-4 space-y-3 animate-pulse"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="h-4 w-full rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
