import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked
marked.use({ async: false });
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure marked renderer for proper heading IDs
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const id = text.toLowerCase()
    .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.setOptions({
  renderer: renderer
});

function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const slug = path.basename(filePath, '.md');
  const htmlContent = marked(markdownContent);
  
  return {
    metadata: data,
    content: markdownContent,
    htmlContent,
    slug
  };
}

// Process guidance markdown file with all special logic
function processGuidanceMarkdown() {
  const guidanceFilePath = path.join(process.cwd(), 'static', 'vagledning.md');
  
  if (!fs.existsSync(guidanceFilePath)) {
    console.warn('Guidance file not found at:', guidanceFilePath);
    return null;
  }

  const content = fs.readFileSync(guidanceFilePath, 'utf-8');
  
  // Apply all processing functions in correct order
  let processedContent = content;
  processedContent = processConcepts(processedContent);
  processedContent = processImages(processedContent);
  processedContent = processPrincipleReferences(processedContent);
  processedContent = processCrossReferences(processedContent);
  processedContent = processHeramReferences(processedContent);
  processedContent = processCallouts(processedContent);

  // Generate HTML
  let htmlContent = marked.parse(processedContent);
  
  // Fix anchor links to match our heading ID format
  htmlContent = htmlContent.replace(/href="#([^"]+)"/g, (match, encodedId) => {
    try {
      // Decode the URL-encoded ID and apply same transformation as heading IDs
      const decodedId = decodeURIComponent(encodedId);
      const normalizedId = decodedId.toLowerCase()
        .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `href="#${normalizedId}"`;
    } catch (e) {
      // If decoding fails, use original
      return match;
    }
  });
  
  // Extract sections for navigation (from original content to get clean titles)
  const sections = extractSections(content);

  return {
    htmlContent,
    sections,
    title: 'HERAF Vägledning'
  };
}

// Extract section structure from markdown
function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let inTableOfContents = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip the table of contents section
    if (line === '## Innehåll') {
      inTableOfContents = true;
      continue;
    }
    
    // End of table of contents when we hit the horizontal rule or next section
    if (inTableOfContents && (line === '---' || line.startsWith('## ') && line !== '## Innehåll')) {
      inTableOfContents = false;
    }
    
    // Skip lines in table of contents
    if (inTableOfContents) {
      continue;
    }
    
    // Only match actual markdown headings (starting with #)
    const headerMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const id = title.toLowerCase()
        .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      sections.push({ id, title, level });
    }
  }
  
  return sections;
}

// Process concept references in content  
function processConcepts(content) {
  // We need to get concepts from the content data we're building
  const conceptsDir = path.join(process.cwd(), 'src/content/concepts');
  
  if (!fs.existsSync(conceptsDir)) {
    return content; // No concepts to process
  }
  
  let processedContent = content;
  const conceptFiles = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
  const conceptMap = new Map();
  
  // Build concept map
  for (const file of conceptFiles) {
    const filePath = path.join(conceptsDir, file);
    const concept = processMarkdownFile(filePath);
    const title = concept.metadata.title?.toLowerCase();
    if (title && title !== 'heram') {
      conceptMap.set(title, concept.slug);
      
      // Add Swedish word forms for common patterns
      // Definite forms (adds -en, -et, -n, -t)
      conceptMap.set(title + 'en', concept.slug);
      conceptMap.set(title + 'et', concept.slug);
      if (!title.endsWith('e')) {
        conceptMap.set(title + 'n', concept.slug);
        conceptMap.set(title + 't', concept.slug);
      }
      
      // Plural forms
      if (!title.endsWith('er') && !title.endsWith('ar')) {
        conceptMap.set(title + 'er', concept.slug);
        conceptMap.set(title + 'ar', concept.slug);
        conceptMap.set(title + 'erna', concept.slug); // definite plural
        conceptMap.set(title + 'arna', concept.slug); // definite plural
      }
    }
  }
  
  // Process concept terms - avoid links already in markdown link format or inside headers
  conceptMap.forEach((slug, conceptTerm) => {
    // More robust regex to avoid matching inside existing markdown links
    const regex = new RegExp(`\\b(${conceptTerm})\\b(?![^\\[]*\\]\\([^\\)]*\\))(?![^\\(]*\\))`, 'gi');
    
    processedContent = processedContent.replace(regex, (match, ...args) => {
      const offset = args[args.length - 2];
      const fullString = args[args.length - 1];
      
      // Get the line containing this match to check if it's a header
      const beforeMatch = fullString.substring(0, offset);
      const currentLineStart = beforeMatch.lastIndexOf('\n') + 1;
      const currentLineEnd = fullString.indexOf('\n', offset);
      const currentLine = fullString.substring(currentLineStart, currentLineEnd === -1 ? fullString.length : currentLineEnd);
      
      // Check if current line is a header (starts with #)
      if (currentLine.trim().match(/^#{1,6}\s/)) {
        return match; // Don't link if inside a header
      }
      
      // Check if we're inside markdown link text [text](url)
      const textBeforeMatch = fullString.substring(0, offset);
      
      // Find the most recent potential link start before our match
      const linkTextStart = textBeforeMatch.lastIndexOf('[');
      
      // Only check for markdown links if there's a [ before our match
      if (linkTextStart !== -1) {
        const linkTextEnd = fullString.indexOf(']', linkTextStart);
        
        // If there's a ] after the [, check if it forms a valid markdown link
        if (linkTextEnd !== -1 && linkTextEnd > offset) {
          const possibleUrlStart = fullString.indexOf('(', linkTextEnd);
          const possibleUrlEnd = fullString.indexOf(')', possibleUrlStart);
          
          // Only treat as markdown link if we have the complete [text](url) pattern
          // AND our match is between [ and ]
          if (possibleUrlStart === linkTextEnd + 1 && possibleUrlEnd !== -1) {
            if (offset > linkTextStart && offset < linkTextEnd) {
              return match; // Don't link if inside markdown link text
            }
          }
        }
      }
      
      // For interactive content, use concept: protocol for sidebar handling
      return `<a href="concept:${slug}" class="concept-link" title="${match}">${match}</a>`;
    });
  });
  
  return processedContent;
}

// Process images with proper paths and styling
function processImages(content) {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)(\{([^}]+)\})?/g, (match, alt, src, _, attributes) => {
    let imageStyle = '';
    let imageClass = 'guidance-image';
    
    // Parse attributes if provided
    if (attributes) {
      const attrPairs = attributes.split(/\s+/);
      attrPairs.forEach((attr) => {
        if (attr.includes('=')) {
          const [key, value] = attr.split('=');
          const cleanValue = value.replace(/['"]/g, '');
          
          if (key === 'width') {
            imageStyle += `max-width: ${cleanValue}; `;
          } else if (key === 'height') {
            imageStyle += `max-height: ${cleanValue}; `;
          } else if (key === 'class') {
            imageClass += ` ${cleanValue}`;
          }
        } else {
          imageClass += ` ${attr}`;
        }
      });
    }
    
    // Special handling for logo images
    if (!imageStyle && (src.includes('logo') || alt.toLowerCase().includes('logo') || alt.toLowerCase().includes('vägledning'))) {
      imageClass += ' logo-image';
    }
    
    const styleAttr = imageStyle ? ` style="${imageStyle.trim()}"` : '';
    
    // Convert relative paths to proper static asset paths
    const resolvedSrc = src.startsWith('http') ? src : `/${src.startsWith('/') ? src.slice(1) : src}`;
    
    return `<figure class="image-figure">
        <img src="${resolvedSrc}" alt="${alt}" class="${imageClass}"${styleAttr} loading="lazy" />
        ${alt ? `<figcaption class="image-caption">${alt}</figcaption>` : ''}
    </figure>`;
  });
}

// Process principle references
function processPrincipleReferences(content) {
  const governanceDir = path.join(process.cwd(), 'src/content/governance/principles');
  
  if (!fs.existsSync(governanceDir)) {
    return content;
  }
  
  const principleFiles = fs.readdirSync(governanceDir).filter(f => f.endsWith('.md'));
  const principles = [];
  
  for (const file of principleFiles) {
    const filePath = path.join(governanceDir, file);
    const principle = processMarkdownFile(filePath);
    principles.push({ id: principle.metadata.id, header: principle.metadata.principle });
  }
  
  return content.replace(/\[P:([^\]]+)\]/g, (match, principleRef) => {
    const principle = principles.find(p => p.id.toLowerCase() === principleRef.toLowerCase());
    return principle ? 
      `<a href="principle:${principle.id}" class="principle-ref" title="Visa princip: ${principle.id}">${principle.id} - ${principle.header}</a>` : 
      match;
  });
}

// Process cross-references to sections within the document
function processCrossReferences(content) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, reference) => {
    const sectionId = reference.toLowerCase()
      .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<a href="#${sectionId}" class="section-ref" title="Gå till: ${reference}">${reference}</a>`;
  });
}

// Process HERAM references
function processHeramReferences(content) {
  // Only process standalone [HERAM] references, not ones that are part of markdown links
  return content.replace(/\[HERAM\](?!\([^)]*\))/g, '<a href="concept:heram" class="concept-link">HERAM</a>');
}

// Process callouts
function processCallouts(content) {
  const calloutTypes = ['note', 'tip', 'warning', 'danger', 'info', 'important', 'example'];
  return content.replace(/```(\w+)\s*(.*?)\n([\s\S]*?)```/gs, (match, type, titleLine, content) => {
    if (!calloutTypes.includes(type.toLowerCase())) {
      return match; // Return unchanged for code blocks
    }
    
    const title = titleLine.trim() || type.charAt(0).toUpperCase() + type.slice(1);
    const iconMap = {
      note: '📝',
      tip: '💡', 
      warning: '⚠️',
      danger: '🚨',
      info: 'ℹ️',
      important: '❗',
      example: '💡'
    };
    
    return `<div class="callout callout-${type}">
      <div class="callout-header">
        <span class="callout-icon">${iconMap[type] || 'ℹ️'}</span>
        <span class="callout-title">${title}</span>
      </div>
      <div class="callout-content">${marked.parse(content?.trim() || '')}</div>
    </div>`;
  });
}

function buildContentData() {
  const contentDir = path.join(process.cwd(), 'src/content');
  const governanceDir = path.join(contentDir, 'governance');
  const principlesDir = path.join(governanceDir, 'principles');
  const rulesDir = path.join(governanceDir, 'rules');
  const guidelinesDir = path.join(governanceDir, 'guidelines');
  const conceptsDir = path.join(contentDir, 'concepts');
  
  const data = {
    governance: {
      principles: [],
      rules: [],
      guidelines: []
    },
    concepts: [],
    guidance: null
  };
  
  // Process guidance
  data.guidance = processGuidanceMarkdown();
  
  // Process principles
  if (fs.existsSync(principlesDir)) {
    const principleFiles = fs.readdirSync(principlesDir).filter(f => f.endsWith('.md'));
    for (const file of principleFiles) {
      const filePath = path.join(principlesDir, file);
      try {
        const principle = processMarkdownFile(filePath);
        data.governance.principles.push(principle);
      } catch (error) {
        console.error(`Error processing principle ${file}:`, error);
      }
    }
  }
  
  // Process rules
  if (fs.existsSync(rulesDir)) {
    const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));
    for (const file of ruleFiles) {
      const filePath = path.join(rulesDir, file);
      try {
        const rule = processMarkdownFile(filePath);
        data.governance.rules.push(rule);
      } catch (error) {
        console.error(`Error processing rule ${file}:`, error);
      }
    }
  }
  
  // Process guidelines
  if (fs.existsSync(guidelinesDir)) {
    const guidelineFiles = fs.readdirSync(guidelinesDir).filter(f => f.endsWith('.md'));
    for (const file of guidelineFiles) {
      const filePath = path.join(guidelinesDir, file);
      try {
        const guideline = processMarkdownFile(filePath);
        data.governance.guidelines.push(guideline);
      } catch (error) {
        console.error(`Error processing guideline ${file}:`, error);
      }
    }
  }
  
  // Process concepts
  if (fs.existsSync(conceptsDir)) {
    const conceptFiles = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
    for (const file of conceptFiles) {
      const filePath = path.join(conceptsDir, file);
      try {
        const concept = processMarkdownFile(filePath);
        data.concepts.push(concept);
      } catch (error) {
        console.error(`Error processing concept ${file}:`, error);
      }
    }
  }
  
  // Sort governance items
  data.governance.principles.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.principle.localeCompare(b.metadata.principle);
  });
  
  data.governance.rules.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.id.localeCompare(b.metadata.id);
  });
  
  data.governance.guidelines.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.id.localeCompare(b.metadata.id);
  });
  
  return data;
}

// Generate the content
const contentData = buildContentData();

// Write to a file that can be imported
const outputDir = path.join(process.cwd(), 'src/lib');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, 'content-data.generated.ts');
const content = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const contentData = ${JSON.stringify(contentData, null, 2)};
`;

fs.writeFileSync(outputFile, content);
console.log('✅ Content data generated successfully at', outputFile);
console.log(`📊 Generated ${contentData.governance.principles.length} principles, ${contentData.governance.rules.length} rules, ${contentData.governance.guidelines.length} guidelines, ${contentData.concepts.length} concepts, and ${contentData.guidance ? 'guidance content' : 'no guidance'}`);