import { marked } from 'marked';

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
        
        // Extract title from first heading
        const titleMatch = rawContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'HERAF Vägledning';

        // Parse sections
        const sections = await parseMarkdownToSections(rawContent);
        
        // Generate TOC
        const toc = generateTOC(sections);
        
        // Generate full HTML content
        const fullContent = await marked.parse(rawContent);

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