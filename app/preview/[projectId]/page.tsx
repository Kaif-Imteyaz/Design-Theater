"use client"

import Link from "next/link"
import { tasks } from "@/lib/projects-data"
import { useState, use } from "react"
import { X, Home, ArrowLeft } from "lucide-react"
import { Arrow } from "@radix-ui/react-dropdown-menu"

export default function PreviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)  // Use React.use() to unwrap params
  const task = tasks.find((t) => t.id === projectId)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Task not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black border-b border-border/30 z-50 h-12 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/category/${task.category}`}
              title="Back to category"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              title="Home"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <Home className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-border/30" />
            <span className="text-muted-foreground">{task.title}</span>
          </div>

          {/* Close Button */}
          <Link
            href={`/category/${task.category}`}
            title="Close preview"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5 text-red-500" />
          </Link>
        </div>
      </div>

      {/* Full Screen Preview */}
      <div className="w-full h-screen pt-12">
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-20 pt-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}
        <iframe
          src={`${task.path}/index.html`}
          title={task.title}
          className="w-full h-full border-0"
          onLoad={() => setIframeLoaded(true)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        />
      </div>
    </main>
  )
}