"use client"

import Link from "next/link"
import { categories, tasks } from "@/lib/projects-data"

const TIER_LABELS = { tier1: "Structural Claims", tier2: "Styling Claims", tier3: "Functional/Interactive Claims" }
const TIER_COLORS = {
  tier1: "bg-green-500/20 text-green-700",
  tier2: "bg-blue-500/20 text-blue-700",
  tier3: "bg-purple-500/20 text-purple-700",
}

export default function Home() {
  const getTaskCountByTier = (categoryId: string, tier: string) => {
    return tasks.filter((t) => t.category === categoryId && t.tier === tier).length
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-pretty">Design Theater</h1>
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                Evaluating Thinking Authenticity in UI Generating Agent
              </p>
            </div>
            <a
              href="https://github.com/Kaif-Imteyaz/Design-Theater"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* system prompt */}
       <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-xl font-bold text-foreground mb-4 text-pretty">System Prompt (Provided with the Task Prompt)</h1>
          <p className="text-lg text-muted-foreground max-w-3xl text-pretty">
            Please follow these constraints strictly: <br />
            - Use ONLY HTML, CSS, and JavaScript (no frameworks, libraries, or external dependencies) <br />
            - Do NOT use web search or any external tools
 
          </p>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const tier1Count = getTaskCountByTier(category.id, "tier1")
            const tier2Count = getTaskCountByTier(category.id, "tier2")
            const tier3Count = getTaskCountByTier(category.id, "tier3")
            const totalCount = tier1Count + tier2Count + tier3Count

            return (
              <Link key={category.id} href={`/category/${category.id}`}>
                <div className="group p-6 rounded-lg border border-border hover:border-primary hover:bg-card transition-all cursor-pointer h-full">
                  {/* <div className={`inline-block w-4 h-4 rounded-full ${category.color}`} /> */}
                  <h3 className="text-xl font-semibold text-foreground mb-4">{category.name}</h3>

                  {/* Tier Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tier 1:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS.tier1}`}>
                        {tier1Count} tasks
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tier 2: </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS.tier2}`}>
                        {tier2Count} tasks
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tier 3:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS.tier3}`}>
                        {tier3Count} tasks
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground font-medium">
                    {totalCount} total tasks
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>
            copyright &copy; Design Theater {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
