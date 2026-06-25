import * as React from "react"
import { Upload } from "lucide-react"
import Link from "next/link"

export function PaperActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard/upload">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </button>
      </Link>
    </div>
  )
}
