# HERAF Content System

This project uses a build-time content generation system that processes Markdown files with frontmatter and generates TypeScript files that can be bundled with the SPA.

## How it works

1. **Markdown files** with YAML frontmatter are stored in `src/content/`
2. **Build script** (`scripts/generate-content.js`) processes these files using `gray-matter` and `marked`
3. **Generated TypeScript file** (`src/lib/content-data.generated.ts`) contains all processed content as a static data structure
4. **Content API** (`src/lib/content.ts`) provides a clean interface to access the data

## Content Structure

### Principles (`src/content/principles/*.md`)

```yaml
---
id: "EAP001"
principle: "Principle title"
tags: ["tag1", "tag2"]
references: ["REF001"]
status: "active" # draft | active | deprecated
category: "Category name"
---

Markdown content here...
```

### Concepts (`src/content/concepts/*.md`)

```yaml
---
id: "concept-001"
title: "Concept Title"
icon: "icon-name"
category: "Category"
relationships: ["other-concept"]
examples: ["Example 1", "Example 2"]
date: "2024-01-01"
---

Markdown content here...
```

## Usage

### API Functions

```typescript
import { getPrinciples, getConcepts, searchContent } from '$lib/content';

// Get all principles (synchronous)
const principles = getPrinciples();

// Get all concepts (synchronous)
const concepts = getConcepts();

// Search across content
const results = searchContent(principles, concepts, "search term");

// Get specific items
const principle = getPrinciple("EAP001");
const concept = getConcept("concept-001");
```

### Build Process

The content is generated during both development and production builds:

```bash
# Development (auto-generates content)
npm run dev

# Production build (auto-generates content)
npm run build

# Generate content manually
npm run build:content
```

## Benefits

- ✅ **SPA Compatible**: No server-side file system access needed
- ✅ **Type Safe**: Full TypeScript support with proper interfaces  
- ✅ **Fast Loading**: Content is pre-processed and bundled
- ✅ **SEO Friendly**: Content is available at build time for SSG
- ✅ **Developer Friendly**: Write content in Markdown with frontmatter
- ✅ **Build-time Processing**: Markdown is converted to HTML during build

## Adding Content

1. Create a new `.md` file in the appropriate `src/content/` subdirectory
2. Add proper frontmatter with required fields
3. Write your content in Markdown
4. Run `npm run dev` or `npm run build:content` to regenerate the data

The content will be automatically available in your application through the content API.