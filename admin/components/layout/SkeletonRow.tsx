export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-slate-800/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({
  cols,
  rows = 6,
}: {
  cols: number;
  rows?: number;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-3 bg-slate-800 rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 animate-pulse flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-slate-800 rounded animate-pulse w-24" />
            <div className="h-7 bg-slate-800 rounded animate-pulse w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}