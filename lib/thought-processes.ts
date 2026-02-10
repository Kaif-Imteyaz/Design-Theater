// Thought processes and outputs organized by category and task
// Each category has its own section with task-specific thought processes

export interface ThoughtProcessData {
  thoughtProcess1?: string;
  thoughtProcess2?: string;
  output?: string;
}

// ChatGPT (GPT-5 Thinking) thought processes
export const chatgptThoughts: Record<string, ThoughtProcessData> = {
  "task1.1": {
    thoughtProcess1: "I'll avoid using external dependencies, so no Google Maps iframe. The user only asked for a simple HTML/CSS/JS file, with no frameworks. I'll create a single file with inlined code for the page, including necessary sections like hero, about, menu highlights, and hours. For the map, I'll use an SVG image and link to 'Open in Maps' I'll use an inline SVG for the map and clickable links like telephone and \"Get directions.\" No external dependencies, just links. I'll also include a call to action, a specials section, and a gallery with placeholder images. The site will be accessible, responsive, and optimized with meta tags and structured data. I'll add a tiny JS for store hours based on the user's time zone. Since the user didn't provide specific hours, I'll use suggested ones and mark them as placeholders, making them easy to edit. For the coffee shop's opening, I'll use \"Serving our neighborhood since 2022.\" I'll add placeholder text for the address too. I'll include a contact form with mailto for ease and ensure performance optimizations like lazy-loaded images. I'll also include a design explanation section. I'll use Canmore to create the HTML code instead of pasting it in chat, as the instructions suggest. The document will be titled \"Morning Brew Homepage (HTML)\"; I'll include meta tags and system font stacks. The design will have sections like an announcement bar, header with logo, and specials. I'll provide a brief overview and customization instructions afterward.",
    thoughtProcess2: "",
    output: "I've built you a clean, single-file homepage using only HTML, CSS, and vanilla JS (no external dependencies). It\u2019s already in the canvas to the right\u2014ready to preview and edit.\n\nHere\u2019s the design strategy and how the content is organized for a neighborhood coffee shop:\n\nGoals\n\nHelp new visitors decide to come in (vibe + basics fast).\n\nMake regulars\u2019 routines easier (hours, Wi-Fi, menu highlights, directions).\n\nKeep it lightweight, fast, and easy to maintain (one file, no frameworks).\n\nInformation Architecture (top \u2192 bottom)\n\nAnnouncement bar: timely promo (\u201cPumpkin Spice is back\u201d). Easy to change; great for seasonal specials or holiday hours.\n\nSticky header + simple nav: Brand at left; Menu, About, Visit, Contact anchors. On mobile, the menu collapses into a simple toggle.\n\nHero: One-liner value prop + two clear CTAs (\u201cView Menu\u201d, \u201cHours & Location\u201d). The background \u201csteam\u201d graphic is a tiny inline SVG (no images needed) to suggest warmth.\n\nMenu Highlights: Four cards (espresso, flat white, cold brew, pastries). Great for scannability; prices are example placeholders\u2014update freely.\n\nAbout: Short paragraph that captures your 3-year community vibe, plus a \u201cGood to know\u201d card (Wi-Fi password, outlets, reusable-cup discount, dietary options).\n\nHours & Location:\n\nHours table auto-renders from a small config object.\n\n\u201cOpen now / Closed now\u201d badge updates live based on the current time and your hours.\n\n\u201cGet Directions\u201d uses a universal Google Maps link (just a hyperlink\u2014no embedded widget).\n\nCall and Email buttons are included.\n\nTestimonials: Three short quotes to reinforce trust and vibe.\n\nContact: Simple form that opens the user\u2019s email app via mailto: (so you don\u2019t need a backend).\n\nFooter: Social links (placeholders), copyright, brand.\n\nVisual & UX Choices\n\nWarm palette (sage/evergreen + latte accent) for a cozy, artisanal feel.\n\nSystem fonts for performance and a friendly, modern look.\n\nCard-based layout for clarity and quick scanning on mobile.\n\nAccessible semantics: landmarks, labels, strong color contrast, aria-live for the open/closed badge, keyboard-friendly controls.\n\nPerformance: one HTML file, inline CSS/JS, no external requests; great Lighthouse scores out of the box.\n\nWhat to customize (all in one place)\n\nOpen the JS CONFIG object at the bottom of the file to update:\n\nshopName, address, phone, email\n\nmapsQuery (used to build the \u201cGet Directions\u201d link)\n\nwifiPassword\n\nhours (set open/close by weekday arrays)\nThen update any placeholder prices and social links in the markup.\n\nSEO & Local Discovery\n\nDescriptive <title> and <meta name=\\\"description\\\">\n\nOpen Graph tags for decent unfURLs when you share the site\n\nJSON-LD CafeOrCoffeeShop schema with address, phone, and opening hours\u2014helps search engines and map listings.\n\nMaintenance Tips\n\nFor holiday hours: temporarily change the announcement bar and edit the hours config (or add a quick \u201cClosed on\u2026\u201d note).\n\nSeasonal promos: rotate the announcement bar and swap a Menu Highlight card.\n\nIf you later add a real menu page or catering info, create new sections and link from the hero CTAs.\n\nIf you\u2019d like, tell me your exact address, phone, hours, and social links, and I\u2019ll plug them into the code for you now."
  },
  "task1.2": {
    thoughtProcess1: "I need to build a homepage using HTML, CSS, and JS only, without relying on external resources like web.run. Since we're working with canmore, this will be a standalone code. I’ll ensure the design is modern, responsive, and includes key elements like a schedule filter, trainer cards, and membership form, while maintaining accessibility and performance.",
    thoughtProcess2: "",
    output: ""
  },
  "task1.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 2 tasks
  "task2.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 3 tasks
  "task3.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  }
};

// Claude (Sonnet 4 Thinking) thought processes
export const claudeThoughts: Record<string, ThoughtProcessData> = {
  "task1.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 2 tasks
  "task2.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 3 tasks
  "task3.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  }
};

// Firebase (Gemini 2.5 Pro) thought processes
export const firebaseThoughts: Record<string, ThoughtProcessData> = {
  "task1.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 2 tasks
  "task2.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 3 tasks
  "task3.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  }
};

// Bolt (v1 agent legacy) thought processes
export const boltThoughts: Record<string, ThoughtProcessData> = {
  "task1.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 2 tasks
  "task2.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 3 tasks
  "task3.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  }
};

// v0 (v0 Mini; powered by Claude Haiku) thought processes
export const v0Thoughts: Record<string, ThoughtProcessData> = {
  "task1.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task1.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 2 tasks
  "task2.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task2.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  // Tier 3 tasks
  "task3.1": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.2": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.3": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.4": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.5": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.6": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.7": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  },
  "task3.8": {
    thoughtProcess1: "",
    thoughtProcess2: "",
    output: ""
  }
};

// Map category ID to thought process data
export const thoughtProcessesByCategory: Record<string, Record<string, ThoughtProcessData>> = {
  chatgpt: chatgptThoughts,
  claude: claudeThoughts,
  firebase: firebaseThoughts,
  bolt: boltThoughts,
  v0: v0Thoughts
};

// Helper function to get thought process for a specific category and task
export function getThoughtProcess(categoryId: string, taskBaseId: string): ThoughtProcessData | undefined {
  const categoryThoughts = thoughtProcessesByCategory[categoryId];
  if (!categoryThoughts) return undefined;
  return categoryThoughts[taskBaseId];
}
