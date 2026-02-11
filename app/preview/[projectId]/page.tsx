"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { tasks, getCategoryById } from "@/lib/projects-data"
import { useState, use, useEffect, useMemo } from "react"
import { X, Home, ArrowLeft, Eye, Code, Copy, Check, ClipboardCheck, FileCode2, FileJson, Network, ChevronRight, ChevronDown, ChevronLeft, List, Info, FileOutput } from "lucide-react"
import EvaluationPanel from "@/components/evaluation-panel"
import * as parse5 from "parse5"

type ViewTab = "preview" | "code" | "ast" | "dom" | "about" | "output"

interface ASTNode {
  nodeName: string
  tagName?: string
  value?: string
  attrs?: Array<{ name: string; value: string }>
  childNodes?: ASTNode[]
  parentNode?: ASTNode
}

interface TaskFiles {
  html: string[]
  css: string[]
  js: string[]
  other: string[]
}

interface FileContent {
  [filename: string]: string
}

// Simple syntax highlighting for HTML
function highlightHTML(code: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let key = 0

  // Split by tags and text
  const regex = /(<\/?[^>]+>)|([^<]+)/g
  let match

  while ((match = regex.exec(code)) !== null) {
    if (match[1]) {
      // It's a tag
      const tag = match[1]
      if (tag.startsWith("</")) {
        // Closing tag
        result.push(
          <span key={key++} className="text-zinc-500">&lt;/</span>,
          <span key={key++} className="text-red-400">{tag.slice(2, -1)}</span>,
          <span key={key++} className="text-zinc-500">&gt;</span>
        )
      } else if (tag.startsWith("<!--")) {
        // Comment
        result.push(<span key={key++} className="text-zinc-600 italic">{tag}</span>)
      } else {
        // Opening tag - parse attributes
        const tagMatch = tag.match(/<(\w+)(.*?)(\/?)>/)
        if (tagMatch) {
          const [, tagName, attrs, selfClose] = tagMatch
          result.push(<span key={key++} className="text-zinc-500">&lt;</span>)
          result.push(<span key={key++} className="text-red-400">{tagName}</span>)

          // Parse attributes
          const attrRegex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
          let attrMatch
          while ((attrMatch = attrRegex.exec(attrs)) !== null) {
            const [full, name, val1, val2, val3] = attrMatch
            const value = val1 ?? val2 ?? val3
            result.push(<span key={key++} className="text-orange-400"> {name}</span>)
            if (value !== undefined) {
              result.push(
                <span key={key++} className="text-zinc-500">=</span>,
                <span key={key++} className="text-green-400">"{value}"</span>
              )
            }
          }

          result.push(<span key={key++} className="text-zinc-500">{selfClose ? "/>" : ">"}</span>)
        } else {
          result.push(<span key={key++} className="text-zinc-400">{tag}</span>)
        }
      }
    } else if (match[2]) {
      // Text content
      const text = match[2]
      if (text.trim()) {
        result.push(<span key={key++} className="text-zinc-200">{text}</span>)
      } else {
        result.push(<span key={key++}>{text}</span>)
      }
    }
  }

  return result
}

// Simple syntax highlighting for CSS
function highlightCSS(code: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let key = 0

  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Comment
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      result.push(<span key={key++} className="text-zinc-600 italic">{line}</span>)
    }
    // Selector line (ends with {)
    else if (line.includes('{')) {
      const [selector, rest] = line.split('{')
      result.push(
        <span key={key++} className="text-yellow-400">{selector}</span>,
        <span key={key++} className="text-zinc-500">{"{"}</span>,
        <span key={key++}>{rest}</span>
      )
    }
    // Property line
    else if (line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const property = line.slice(0, colonIndex)
      const value = line.slice(colonIndex + 1)
      result.push(
        <span key={key++} className="text-cyan-400">{property}</span>,
        <span key={key++} className="text-zinc-500">:</span>,
        <span key={key++} className="text-orange-300">{value}</span>
      )
    }
    // Closing brace
    else if (line.includes('}')) {
      result.push(<span key={key++} className="text-zinc-500">{line}</span>)
    }
    else {
      result.push(<span key={key++} className="text-zinc-300">{line}</span>)
    }

    if (i < lines.length - 1) {
      result.push(<span key={key++}>{'\n'}</span>)
    }
  }

  return result
}

// Simple syntax highlighting for JavaScript
function highlightJS(code: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let key = 0

  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined']

  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Simple comment handling
    if (line.trim().startsWith('//')) {
      result.push(<span key={key++} className="text-zinc-600 italic">{line}</span>)
    } else {
      // Tokenize and highlight
      const tokens = line.split(/(\s+|[{}()[\];,.]|"[^"]*"|'[^']*'|`[^`]*`)/g)
      for (const token of tokens) {
        if (!token) continue
        if (keywords.includes(token)) {
          result.push(<span key={key++} className="text-purple-400">{token}</span>)
        } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
          result.push(<span key={key++} className="text-green-400">{token}</span>)
        } else if (/^\d+$/.test(token)) {
          result.push(<span key={key++} className="text-orange-400">{token}</span>)
        } else if (/^[{}()[\];,.]$/.test(token)) {
          result.push(<span key={key++} className="text-zinc-500">{token}</span>)
        } else if (/^[a-zA-Z_]\w*$/.test(token) && tokens[tokens.indexOf(token) + 1]?.trim() === '(') {
          result.push(<span key={key++} className="text-yellow-400">{token}</span>)
        } else {
          result.push(<span key={key++} className="text-zinc-300">{token}</span>)
        }
      }
    }

    if (i < lines.length - 1) {
      result.push(<span key={key++}>{'\n'}</span>)
    }
  }

  return result
}

// Simple syntax highlighting for Markdown
function highlightMarkdown(code: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let key = 0

  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Headings
    if (line.match(/^#{1,6}\s/)) {
      const match = line.match(/^(#{1,6})\s(.*)/)
      if (match) {
        result.push(
          <span key={key++} className="text-purple-400 font-bold">{match[1]} </span>,
          <span key={key++} className="text-white font-semibold">{match[2]}</span>
        )
      }
    }
    // Code blocks
    else if (line.startsWith('```')) {
      result.push(<span key={key++} className="text-green-400">{line}</span>)
    }
    // Inline code
    else if (line.includes('`')) {
      const parts = line.split(/(`[^`]+`)/g)
      parts.forEach(part => {
        if (part.startsWith('`') && part.endsWith('`')) {
          result.push(<span key={key++} className="text-green-400 bg-zinc-800 px-1 rounded">{part}</span>)
        } else {
          result.push(<span key={key++} className="text-zinc-300">{part}</span>)
        }
      })
    }
    // Lists
    else if (line.match(/^\s*[-*+]\s/)) {
      const match = line.match(/^(\s*)([-*+])(\s.*)/)
      if (match) {
        result.push(
          <span key={key++}>{match[1]}</span>,
          <span key={key++} className="text-cyan-400">{match[2]}</span>,
          <span key={key++} className="text-zinc-300">{match[3]}</span>
        )
      }
    }
    // Numbered lists
    else if (line.match(/^\s*\d+\.\s/)) {
      const match = line.match(/^(\s*)(\d+\.)(\s.*)/)
      if (match) {
        result.push(
          <span key={key++}>{match[1]}</span>,
          <span key={key++} className="text-cyan-400">{match[2]}</span>,
          <span key={key++} className="text-zinc-300">{match[3]}</span>
        )
      }
    }
    // Bold/italic
    else if (line.includes('**') || line.includes('__') || line.includes('*') || line.includes('_')) {
      let remaining = line
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
        const italicMatch = remaining.match(/^\*([^*]+)\*/)
        if (boldMatch) {
          result.push(<span key={key++} className="text-white font-bold">{boldMatch[0]}</span>)
          remaining = remaining.slice(boldMatch[0].length)
        } else if (italicMatch) {
          result.push(<span key={key++} className="text-zinc-200 italic">{italicMatch[0]}</span>)
          remaining = remaining.slice(italicMatch[0].length)
        } else {
          result.push(<span key={key++} className="text-zinc-300">{remaining[0]}</span>)
          remaining = remaining.slice(1)
        }
      }
    }
    // Links
    else if (line.includes('[')) {
      const parts = line.split(/(\[[^\]]+\]\([^)]+\))/g)
      parts.forEach(part => {
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          result.push(
            <span key={key++} className="text-blue-400">[{linkMatch[1]}]</span>,
            <span key={key++} className="text-zinc-500">(</span>,
            <span key={key++} className="text-cyan-400">{linkMatch[2]}</span>,
            <span key={key++} className="text-zinc-500">)</span>
          )
        } else {
          result.push(<span key={key++} className="text-zinc-300">{part}</span>)
        }
      })
    }
    // Regular text
    else {
      result.push(<span key={key++} className="text-zinc-300">{line}</span>)
    }

    if (i < lines.length - 1) {
      result.push(<span key={key++}>{'\n'}</span>)
    }
  }

  return result
}

// AST Tree Node Component
function ASTTreeNode({ node, depth = 0 }: { node: ASTNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth < 3)

  const hasChildren = node.childNodes && node.childNodes.length > 0
  const isTextNode = node.nodeName === "#text"
  const isComment = node.nodeName === "#comment"
  const isDocument = node.nodeName === "#document" || node.nodeName === "#document-fragment"

  if (isTextNode) {
    const text = node.value?.trim()
    if (!text) return null
    return (
      <div className="flex items-center gap-1 py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <span className="text-green-400 text-xs font-mono">"{text.slice(0, 50)}{text.length > 50 ? '...' : ''}"</span>
      </div>
    )
  }

  if (isComment) {
    return (
      <div className="flex items-center gap-1 py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <span className="text-zinc-600 italic text-xs font-mono">&lt;!-- comment --&gt;</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 py-0.5 hover:bg-zinc-800/50 cursor-pointer rounded"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />
        ) : (
          <span className="w-3" />
        )}
        <span className={`text-xs font-mono ${isDocument ? 'text-purple-400' : 'text-red-400'}`}>
          {node.nodeName}
        </span>
        {node.attrs && node.attrs.length > 0 && (
          <span className="text-zinc-500 text-xs font-mono">
            {node.attrs.slice(0, 2).map(a => `${a.name}="${a.value.slice(0, 15)}${a.value.length > 15 ? '...' : ''}"`).join(' ')}
            {node.attrs.length > 2 && ` +${node.attrs.length - 2}`}
          </span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.childNodes?.map((child, i) => (
            <ASTTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// DOM Tree Component (simplified visual representation)
function DOMTreeNode({ node, depth = 0 }: { node: ASTNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth < 4)

  const hasChildren = node.childNodes && node.childNodes.filter(n =>
    n.nodeName !== "#text" || n.value?.trim()
  ).length > 0

  const isTextNode = node.nodeName === "#text"
  const isComment = node.nodeName === "#comment"
  const isDocument = node.nodeName === "#document" || node.nodeName === "#document-fragment"

  // Skip text-only nodes
  if (isTextNode || isComment) return null
  if (isDocument && node.childNodes) {
    return (
      <>
        {node.childNodes.map((child, i) => (
          <DOMTreeNode key={i} node={child} depth={depth} />
        ))}
      </>
    )
  }

  const tagName = node.tagName || node.nodeName

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 hover:bg-zinc-800/50 cursor-pointer rounded group"
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          <span className="text-zinc-500">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 font-mono text-sm">&lt;{tagName}&gt;</span>
          {node.attrs?.find(a => a.name === 'class') && (
            <span className="text-zinc-500 text-xs font-mono bg-zinc-800 px-1.5 rounded">
              .{node.attrs.find(a => a.name === 'class')?.value.split(' ')[0]}
            </span>
          )}
          {node.attrs?.find(a => a.name === 'id') && (
            <span className="text-amber-500 text-xs font-mono bg-zinc-800 px-1.5 rounded">
              #{node.attrs.find(a => a.name === 'id')?.value}
            </span>
          )}
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div className="border-l border-zinc-800 ml-4">
          {node.childNodes?.map((child, i) => (
            <DOMTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Task Navigation Component
function TaskNavigation({ currentTask, categoryTasks, category }: { currentTask: typeof tasks[0], categoryTasks: typeof tasks, category?: { modelName: string } }) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Parse task number from baseId (e.g., "task1.1" -> { tier: 1, num: 1 })
  const parseTaskId = (id: string) => {
    const match = id.match(/task(\d+)\.(\d+)/)
    if (match) {
      return { tier: parseInt(match[1]), num: parseInt(match[2]) }
    }
    return null
  }

  const currentParsed = parseTaskId(currentTask.id.split('-').pop() || '')
  const currentIndex = categoryTasks.findIndex(t => t.id === currentTask.id)

  const goToTask = (index: number) => {
    if (index >= 0 && index < categoryTasks.length) {
      router.push(`/preview/${categoryTasks[index].id}`)
    }
  }

  const goToPrev = () => goToTask(currentIndex - 1)
  const goToNext = () => goToTask(currentIndex + 1)

  // Group tasks by tier for dropdown
  const tasksByTier = categoryTasks.reduce((acc, task) => {
    const tier = task.tier
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  return (
    <div className="flex items-center gap-2">
      {/* Quick navigation buttons */}
      <div className="flex items-center bg-zinc-800 rounded-lg">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous task"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-0.5 px-1">
          {categoryTasks.slice(Math.max(0, currentIndex - 2), Math.min(categoryTasks.length, currentIndex + 3)).map((task, idx) => {
            const realIndex = Math.max(0, currentIndex - 2) + idx
            const parsed = parseTaskId(task.id.split('-').pop() || '')
            const isActive = task.id === currentTask.id
            return (
              <button
                key={task.id}
                onClick={() => goToTask(realIndex)}
                className={`min-w-[28px] h-7 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-primary text-red-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-zinc-700'
                }`}
                title={task.title}
              >
                {parsed ? `${parsed.tier}.${parsed.num}` : realIndex + 1}
              </button>
            )
          })}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === categoryTasks.length - 1}
          className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next task"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown for all tasks */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-zinc-800 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <List className="w-4 h-4" />
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-72 max-h-[70vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50">
            <p className="px-3 py-2 text-xs font-semibold text-white uppercase">{category?.modelName}</p>
              {Object.entries(tasksByTier).map(([tier, tierTasks]) => (
                <div key={tier}>
                  <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase bg-zinc-800/50 sticky top-0">
                    {tier === 'tier1' ? 'Tier 1 - Information Architecture' :
                     tier === 'tier2' ? 'Tier 2 - Visual Design' :
                     'Tier 3 - Interaction Design'}
                  </div>
                  {tierTasks.map((task) => {
                    const parsed = parseTaskId(task.id.split('-').pop() || '')
                    const isActive = task.id === currentTask.id
                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          router.push(`/preview/${task.id}`)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                          isActive
                            ? 'bg-primary/20 text-red-400'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="font-mono text-xs bg-zinc-700 px-1.5 py-0.5 rounded">
                          {parsed ? `${parsed.tier}.${parsed.num}` : '?'}
                        </span>
                        <span className="truncate">{task.title.replace(/^Task \d+\.\d+ - /, '')}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PreviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const task = tasks.find((t) => t.id === projectId)
  const category = task ? getCategoryById(task.category) : undefined

  // Get all tasks for the same category (for navigation)
  const categoryTasks = useMemo(() => {
    if (!task) return []
    return tasks.filter(t => t.category === task.category)
  }, [task])

  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<ViewTab>("preview")
  const [taskFiles, setTaskFiles] = useState<TaskFiles | null>(null)
  const [activeFile, setActiveFile] = useState<string>("")
  const [fileContents, setFileContents] = useState<FileContent>({})
  const [codeLoading, setCodeLoading] = useState(false)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [isEvalOpen, setIsEvalOpen] = useState(false)
  const [thoughtContents, setThoughtContents] = useState<Record<string, string>>({})

  // Fetch thought contents from HTML file based on task category
  useEffect(() => {
    if (!task) return

    // Map category to tool name for HTML file
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

        // Get all divs with IDs and store their innerHTML
        doc.querySelectorAll('div[id]').forEach(div => {
          contents[div.id] = div.innerHTML
        })

        setThoughtContents(contents)
      })
      .catch(console.error)
  }, [task])

  // All available files for code tabs
  const allCodeFiles = useMemo(() => {
    if (!taskFiles) return []
    return [
      ...taskFiles.html.map(f => ({ name: f, type: 'html' as const })),
      ...taskFiles.css.map(f => ({ name: f, type: 'css' as const })),
      ...taskFiles.js.map(f => ({ name: f, type: 'js' as const })),
      ...taskFiles.other.map(f => ({ name: f, type: 'other' as const }))
    ]
  }, [taskFiles])

  // Get primary HTML file for preview
  const primaryHtmlFile = useMemo(() => {
    if (!taskFiles || taskFiles.html.length === 0) return 'index.html'
    return taskFiles.html[0]
  }, [taskFiles])

  // Fetch task files on mount
  useEffect(() => {
    if (!task) return

    // Parse category and taskId from the task path
    const pathParts = task.path.split('/').filter(Boolean)
    if (pathParts.length >= 2) {
      const category = pathParts[0]
      const taskId = pathParts[1]

      fetch(`/api/task-files/${category}/${taskId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.files) {
            setTaskFiles(data.files)
            // Set default active file
            const files = data.files as TaskFiles
            if (files.html.length > 0) {
              setActiveFile(files.html[0])
            } else if (files.css.length > 0) {
              setActiveFile(files.css[0])
            } else if (files.js.length > 0) {
              setActiveFile(files.js[0])
            } else if (files.other.length > 0) {
              setActiveFile(files.other[0])
            }
          }
        })
        .catch(console.error)
    }
  }, [task])

  // Parse HTML into AST
  const htmlAST = useMemo(() => {
    const htmlFile = taskFiles?.html[0]
    const htmlContent = htmlFile ? fileContents[htmlFile] : ''
    if (!htmlContent) return null
    try {
      return parse5.parse(htmlContent) as ASTNode
    } catch {
      return null
    }
  }, [fileContents, taskFiles])

  // Fetch code content when needed
  useEffect(() => {
    if ((activeTab === "code" || activeTab === "ast" || activeTab === "dom") && task && taskFiles) {
      const filesToFetch = allCodeFiles.filter(f => !fileContents[f.name])

      if (filesToFetch.length > 0) {
        setCodeLoading(true)
        Promise.all(
          filesToFetch.map(f =>
            fetch(`${task.path}/${f.name}`)
              .then(r => r.ok ? r.text() : getDefaultContent(f.type))
              .catch(() => getDefaultContent(f.type))
              .then(content => ({ name: f.name, content }))
          )
        ).then(results => {
          const newContents: FileContent = { ...fileContents }
          results.forEach(r => {
            newContents[r.name] = r.content
          })
          setFileContents(newContents)
          setCodeLoading(false)
        })
      }
    }
  }, [activeTab, task, taskFiles, allCodeFiles, fileContents])

  const getDefaultContent = (type: 'html' | 'css' | 'js' | 'other') => {
    switch (type) {
      case 'html': return '<!-- File not found -->'
      case 'css': return '/* File not found */'
      case 'js': return '// File not found'
      case 'other': return '// File not found'
    }
  }

  const copyToClipboard = async (content: string, file: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedFile(file)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const getFileColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'html':
      case 'htm':
        return "text-orange-400"
      case 'css':
        return "text-blue-400"
      case 'js':
        return "text-yellow-400"
      case 'md':
        return "text-purple-400"
      case 'json':
        return "text-green-400"
      case 'txt':
        return "text-gray-400"
      default:
        return "text-zinc-400"
    }
  }

  const getFileIcon = (filename: string) => {
    return <FileCode2 className={`w-4 h-4 ${getFileColor(filename)}`} />
  }

  const getHighlightedCode = (filename: string) => {
    const content = fileContents[filename] || ''
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'html':
      case 'htm':
        return highlightHTML(content)
      case 'css':
        return highlightCSS(content)
      case 'js':
        return highlightJS(content)
      case 'md':
        return highlightMarkdown(content)
      default:
        return [<span key={0} className="text-zinc-300">{content}</span>]
    }
  }

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

            {/* Task Navigation */}
            <TaskNavigation currentTask={task} categoryTasks={categoryTasks} category={category} />

            <div className="h-4 w-px bg-border/30" />
            <span className="text-muted-foreground text-xs sm:text-sm">{task.title}</span>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("about")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "about"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Prompt</span>
              </button>

              
              <button
                onClick={() => setActiveTab("output")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "output"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileOutput className="w-4 h-4" />
                <span className="hidden sm:inline">Output</span>
              </button>

              
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Code</span>
              </button>
              <button
                onClick={() => setActiveTab("ast")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "ast"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span className="hidden sm:inline">AST</span>
              </button>
              <button
                onClick={() => setActiveTab("dom")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeTab === "dom"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">DOM</span>
              </button>
            </div>

            {/* Evaluate Button */}
            <button
              onClick={() => setIsEvalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-300/10 text-green-500 hover:bg-green-200/20 rounded text-sm font-medium transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Evaluate</span>
            </button>

            {/* Close Button */}
            <Link
              href={`/category/${task.category}`}
              title="Close preview"
              className="text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              <X className="w-5 h-5 text-red-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full h-screen pt-12">
        {/* Prompt Tab */}
        {activeTab === "about" && (
          <div className="h-full overflow-auto bg-zinc-950">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {task.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">{tag}</span>
                  ))}
                </div>
              </div>

              {task.prompt && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Prompt
                  </h2>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{task.prompt}</p>
                  </div>
                </div>
              )}

              {task.uxprinciple && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-zinc-200">UX Principles</h2>
                  <div className="flex flex-wrap gap-2">
                    {task.uxprinciple.split(',').map(principle => (
                      <span key={principle.trim()} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {principle.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-zinc-200">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {task.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Output Tab */}
        {activeTab === "output" && (
          <div className="h-full overflow-auto bg-zinc-950">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Thought Process Section */}
              {(task.thoughtProcess1 || task.thoughtProcess2) && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    Thought Process
                  </h2>
                  {task.thoughtProcess1 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-400">Part 1</h3>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <div
                          className="text-zinc-300 leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{
                            __html: thoughtContents[task.thoughtProcess1] || task.thoughtProcess1
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {task.thoughtProcess2 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-400">Part 2</h3>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <div
                          className="text-zinc-300 leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{
                            __html: thoughtContents[task.thoughtProcess2] || task.thoughtProcess2
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Model Output Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                  <FileOutput className="w-5 h-5 text-green-400" />
                  Output/Explanation (in chat)
                </h2>
                {task.output ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div
                      className="text-zinc-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: thoughtContents[task.output] || task.output
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                    <FileOutput className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-500">No output available for this task</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 bg-black flex items-center justify-center z-20 pt-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            )}
            <iframe
              src={`${task.path}/${primaryHtmlFile}`}
              title={task.title}
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            />
          </>
        )}

        {/* Code Tab - VS Code Style */}
        {activeTab === "code" && (
          <div className="h-full flex flex-col bg-zinc-950">
            {codeLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Loading code files...</p>
                </div>
              </div>
            ) : (
              <>
                {/* VS Code Style File Tabs */}
                <div className="flex items-center bg-zinc-900 border-b border-zinc-800 overflow-x-auto">
                  {allCodeFiles.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setActiveFile(file.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                        activeFile === file.name
                          ? "bg-zinc-950 border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-800"
                      }`}
                    >
                      {getFileIcon(file.name)}
                      <span className={activeFile === file.name ? getFileColor(file.name) : ""}>{file.name}</span>
                    </button>
                  ))}
                  <div className="flex-1" />
                  {activeFile && (
                    <button
                      onClick={() => copyToClipboard(fileContents[activeFile] || '', activeFile)}
                      className="flex items-center gap-1.5 px-3 py-1.5 mr-2 text-sm text-muted-foreground hover:text-foreground hover:bg-zinc-800 rounded transition-colors"
                      title="Copy code"
                    >
                      {copiedFile === activeFile ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Code Content with Syntax Highlighting */}
                <div className="flex-1 overflow-auto">
                  {activeFile && (
                    <pre className="p-4 text-sm leading-relaxed">
                      <code className="font-mono whitespace-pre">{getHighlightedCode(activeFile)}</code>
                    </pre>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* AST Tab */}
        {activeTab === "ast" && (
          <div className="h-full flex flex-col bg-zinc-950">
            {codeLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Parsing HTML...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">HTML AST </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Parsed from {taskFiles?.html[0] || 'index.html'}</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {htmlAST ? (
                    <ASTTreeNode node={htmlAST} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Failed to parse HTML</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* DOM Tree Tab */}
        {activeTab === "dom" && (
          <div className="h-full flex flex-col bg-zinc-950">
            {codeLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Building DOM Tree...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">DOM Tree</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Visual element hierarchy</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {htmlAST ? (
                    <DOMTreeNode node={htmlAST} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Failed to parse HTML</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Evaluation Panel */}
      <EvaluationPanel
        taskId={projectId}
        toolModel={category?.modelName}
        isOpen={isEvalOpen}
        onClose={() => setIsEvalOpen(false)}
      />
    </main>
  )
}
