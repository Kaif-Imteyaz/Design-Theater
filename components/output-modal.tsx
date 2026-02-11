"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/projects-data"
import { getCategoryById } from "@/lib/projects-data"
import { X, Brain, Lightbulb, FileOutput, Cpu } from "lucide-react"

interface OutputModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export default function OutputModal({ task, isOpen, onClose }: OutputModalProps) {
  const [thoughtContents, setThoughtContents] = useState<Record<string, string>>({})

  // Fetch thought contents from HTML file based on task category
  useEffect(() => {
    if (!isOpen || !task) return

    const toolMap: Record<string, string> = {
      'chatgpt': 'chatgpt',
      'claude': 'claude',
      'firebase': 'firebase',
      'bolt': 'bolt',
      'v0': 'v0'
    }

    const toolName = toolMap[task.category] || task.category

    fetch(`/thoughts/${toolName}.html`)
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const contents: Record<string, string> = {}

        doc.querySelectorAll('div[id]').forEach(div => {
          contents[div.id] = div.innerHTML
        })

        setThoughtContents(contents)
      })
      .catch(console.error)
  }, [isOpen, task])

  if (!isOpen || !task) return null

  const category = getCategoryById(task.category)

  // Get content from HTML or show empty if not found
  const thought1Content = task.thoughtProcess1 ? (thoughtContents[task.thoughtProcess1] || '') : ''
  const thought2Content = task.thoughtProcess2 ? (thoughtContents[task.thoughtProcess2] || '') : ''
  const outputContent = task.output ? (thoughtContents[task.output] || '') : ''

  const hasThoughtProcess1 = !!thought1Content.trim()
  const hasThoughtProcess2 = !!thought2Content.trim()
  const hasOutput = !!outputContent.trim()

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border sticky top-0 bg-background">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{task.title}</h2>
            {category?.modelName && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-500 text-sm rounded font-medium">
                  <Cpu className="w-4 h-4" />
                  {category.modelName}
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="ml-4 p-1 hover:bg-muted rounded transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thought Process 1 */}
          {hasThoughtProcess1 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 border-b border-border">
                <Brain className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-semibold text-blue-500">Thought Process 1</h3>
              </div>
              <div className="p-4">
                <div
                  className="text-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: thought1Content }}
                />
              </div>
            </div>
          )}

          {/* Thought Process 2 */}
          {hasThoughtProcess2 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border-b border-border">
                <Lightbulb className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-semibold text-green-500">Thought Process 2</h3>
              </div>
              <div className="p-4">
                <div
                  className="text-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: thought2Content }}
                />
              </div>
            </div>
          )}

          {/* Output */}
          {hasOutput && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border-b border-border">
                <FileOutput className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-amber-500">Output/Explanation (in chat)</h3>
              </div>
              <div className="p-4">
                <div
                  className="text-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: outputContent }}
                />
              </div>
            </div>
          )}

          {/* No content message */}
          {!hasThoughtProcess1 && !hasThoughtProcess2 && !hasOutput && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No output data available for this task.</p>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-6 border-t border-border">
            <a
              href={`/preview/${task.id}`}
              className="w-full inline-block px-4 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors text-center"
            >
              Open Preview
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
