"use client"

import type { Task } from "@/lib/projects-data"
import { getCategoryById } from "@/lib/projects-data"
import { X, Brain, Lightbulb, FileOutput, Cpu } from "lucide-react"

interface OutputModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export default function OutputModal({ task, isOpen, onClose }: OutputModalProps) {
  if (!isOpen || !task) return null

  const category = getCategoryById(task.category)
  const hasThoughtProcess1 = !!task.thoughtProcess1
  const hasThoughtProcess2 = !!task.thoughtProcess2
  const hasOutput = !!task.output

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
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {task.thoughtProcess1}
                </p>
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
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {task.thoughtProcess2}
                </p>
              </div>
            </div>
          )}

          {/* Output */}
          {hasOutput && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border-b border-border">
                <FileOutput className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-amber-500">Output Summary</h3>
              </div>
              <div className="p-4">
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {task.output}
                </p>
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
