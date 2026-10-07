export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-[17px] font-semibold text-ink leading-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-[12px] text-ink-secondary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 pt-0.5">{actions}</div>
      )}
    </div>
  )
}

