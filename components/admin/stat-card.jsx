export function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-semibold text-zinc-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-zinc-100 rounded-lg">
            <Icon className="w-5 h-5 text-zinc-600" />
          </div>
        )}
      </div>
    </div>
  );
}
