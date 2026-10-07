import { useCallback, useState } from 'react'

export default function FileDropzone({ onFile, accept = '.pdf', label = 'Upload PDF' }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFile = useCallback(
    (file) => {
      if (!file) return
      setFileName(file.name)
      onFile(file)
    },
    [onFile],
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
        dragging
          ? 'border-accent bg-accent-light dark:bg-accent/10'
          : 'border-border hover:border-accent/40 hover:bg-surface/50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0])
        }}
      />
      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-ink-secondary">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 3v9M5 8l4-5 4 5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[13px] font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-[11px] text-ink-muted">Drag and drop or click to browse</p>
      {fileName && <p className="mt-2 text-[11px] font-medium text-accent">{fileName}</p>}
    </div>
  )
}
