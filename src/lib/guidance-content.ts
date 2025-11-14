import { marked } from 'marked';
import { getConceptsArray } from './content';

export interface GuidanceSection {
    id: string;
    title: string;
    content: string;
    level: number;
    children?: GuidanceSection[];
}

export interface GuidanceContent {
    title: string;
    sections: GuidanceSection[];
    toc: GuidanceSection[];
    fullContent: string;
}

// Configure marked for safe HTML output
marked.setOptions({
    gfm: true,
    breaks: true,
});

/**
 * Parse markdown content and create structured sections
 */
async function parseMarkdownToSections(content: string): Promise<GuidanceSection[]> {
    const sections: GuidanceSection[] = [];
    const lines = content.split('\n');
    let currentSection: GuidanceSection | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
        
        if (headerMatch) {
            // Save previous section if exists
            if (currentSection) {
                currentSection.content = await marked.parse(currentContent.join('\n'));
                sections.push(currentSection);
            }

            // Create new section
            const level = headerMatch[1].length;
            const title = headerMatch[2].trim();
            const id = title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            currentSection = {
                id,
                title,
                content: '',
                level,
                children: []
            };
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    }

    // Add last section
    if (currentSection) {
        currentSection.content = await marked.parse(currentContent.join('\n'));
        sections.push(currentSection);
    }

    return buildHierarchy(sections);
}

/**
 * Build hierarchical structure from flat sections
 */
function buildHierarchy(sections: GuidanceSection[]): GuidanceSection[] {
    const hierarchy: GuidanceSection[] = [];
    const stack: GuidanceSection[] = [];

    for (const section of sections) {
        // Find the appropriate parent level
        while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
            stack.pop();
        }

        // Add to parent or root
        if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            if (!parent.children) parent.children = [];
            parent.children.push(section);
        } else {
            hierarchy.push(section);
        }

        stack.push(section);
    }

    return hierarchy;
}

/**
 * Generate table of contents from sections
 */
function generateTOC(sections: GuidanceSection[]): GuidanceSection[] {
    const toc: GuidanceSection[] = [];

    function addToTOC(section: GuidanceSection) {
        // Only include sections of level 2 and below for TOC
        if (section.level <= 3) {
            toc.push({
                id: section.id,
                title: section.title,
                content: '',
                level: section.level,
                children: []
            });
        }

        if (section.children) {
            section.children.forEach(addToTOC);
        }
    }

    sections.forEach(addToTOC);
    return toc;
}

/**
 * Process content to add interactive features like concept links
 */
function processInteractiveContent(content: string): string {
    const concepts = getConceptsArray();
    let processedContent = content;
    
    // Create a map of concept titles to their slugs for easy lookup
    const conceptMap = new Map<string, string>();
    concepts.forEach(concept => {
        const title = concept.metadata.title?.toLowerCase();
        if (title) {
            conceptMap.set(title, concept.slug);
            // Also add plural forms
            if (!title.endsWith('er') && !title.endsWith('ar')) {
                conceptMap.set(title + 'er', concept.slug);
                conceptMap.set(title + 'ar', concept.slug);
            }
        }
    });
    
    // Process concept terms - but avoid links that are already in markdown link format
    conceptMap.forEach((slug, conceptTerm) => {
        const regex = new RegExp(`\\b(${conceptTerm})\\b(?![^[]*\\]\\([^)]*\\))`, 'gi');
        processedContent = processedContent.replace(regex, (match) => {
            const concept = concepts.find(c => c.slug === slug);
            if (concept) {
                return `[${match}](concept:${slug} "${concept.metadata.title}")`;
            }
            return match;
        });
    });
    
    // Process custom callout boxes
    processedContent = processedContent.replace(/:::(\w+)\s*(.*?)\s*:::/gs, (match, type, content) => {
        const icon = getCalloutIcon(type);
        const className = getCalloutClass(type);
        return `<div class="callout callout-${type} ${className}" data-callout="${type}">
            <div class="callout-header">
                <span class="callout-icon">${icon}</span>
                <span class="callout-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
            <div class="callout-content">${content.trim()}</div>
        </div>`;
    });
    
    // Process example blocks
    processedContent = processedContent.replace(/```example\s*(.*?)\s*```/gs, (match, content) => {
        return `<div class="example-block">
            <div class="example-header">
                <span class="example-icon">💡</span>
                <span class="example-title">Exempel</span>
            </div>
            <div class="example-content">${content.trim()}</div>
        </div>`;
    });
    
    // Process image captions and enhance image display
    processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)(\{([^}]+)\})?/g, (match, alt, src, _, attributes) => {
        const figureClass = attributes ? ` class="${attributes}"` : '';
        return `<figure class="image-figure"${figureClass}>
            <img src="${src}" alt="${alt}" class="guidance-image" loading="lazy" />
            ${alt ? `<figcaption class="image-caption">${alt}</figcaption>` : ''}
        </figure>`;
    });
    
    // Process expandable sections
    processedContent = processedContent.replace(/\+\+\+\s*(.*?)\s*\+\+\+(.*?)\+\+\+/gs, (match, title, content) => {
        const expandId = 'expand-' + Math.random().toString(36).substr(2, 9);
        return `<div class="expandable-section">
            <button class="expand-toggle" onclick="toggleExpand('${expandId}')">
                <span class="expand-icon">▶</span>
                <span class="expand-title">${title.trim()}</span>
            </button>
            <div class="expand-content" id="${expandId}" style="display: none;">
                ${content.trim()}
            </div>
        </div>`;
    });
    
    // Process cross-references to sections within the document
    processedContent = processedContent.replace(/\[\[([^\]]+)\]\]/g, (match, reference) => {
        const sectionId = reference.toLowerCase()
            .replace(/[åäö]/g, (char: string) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        return `<a href="#${sectionId}" class="section-ref" title="Gå till: ${reference}">${reference}</a>`;
    });
    
    // Process principle references
    processedContent = processedContent.replace(/\[P:([^\]]+)\]/g, (match, principleRef) => {
        return `<a href="principle:${principleRef.toLowerCase()}" class="principle-ref" title="Visa princip: ${principleRef}">${principleRef}</a>`;
    });
    
    return processedContent;
}

/**
 * Get callout icon based on type
 */
function getCalloutIcon(type: string): string {
    const icons: Record<string, string> = {
        tip: '💡',
        warning: '⚠️',
        danger: '🚨',
        info: 'ℹ️',
        note: '📝',
        important: '❗',
        example: '💡'
    };
    return icons[type] || 'ℹ️';
}

/**
 * Get callout CSS class based on type
 */
function getCalloutClass(type: string): string {
    const classes: Record<string, string> = {
        tip: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        danger: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        note: 'bg-gray-50 border-gray-200 text-gray-800',
        important: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return classes[type] || 'bg-gray-50 border-gray-200 text-gray-800';
}

/**
 * Fetch and parse the guidance content from static markdown file
 */
export async function loadGuidanceContent(): Promise<GuidanceContent> {
    try {
        // Fetch the markdown file from static assets
        const response = await fetch('/vagledning.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawContent = await response.text();
        
        // Process content to add interactive features
        const processedContent = processInteractiveContent(rawContent);
        
        // Extract title from first heading
        const titleMatch = processedContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'HERAF Vägledning';

        // Parse sections
        const sections = await parseMarkdownToSections(processedContent);
        
        // Generate TOC
        const toc = generateTOC(sections);
        
        // Generate full HTML content
        const fullContent = await marked.parse(processedContent);

        return {
            title,
            sections,
            toc,
            fullContent
        };
    } catch (error) {
        console.error('Error loading guidance content:', error);
        throw new Error('Failed to load guidance content');
    }
}

/**
 * Get a specific section by ID
 */
export function findSection(sections: GuidanceSection[], id: string): GuidanceSection | null {
    for (const section of sections) {
        if (section.id === id) {
            return section;
        }
        if (section.children) {
            const found = findSection(section.children, id);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Get navigation data for sections
 */
export function getNavigationSections(sections: GuidanceSection[]) {
    return sections
        .filter(section => section.level <= 2) // Only main sections
        .map(section => ({
            id: section.id,
            title: section.title,
            level: section.level,
            children: section.children?.filter(child => child.level <= 3) || []
        }));
}