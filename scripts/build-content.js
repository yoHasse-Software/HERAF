import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked
marked.use({ async: false });

function processMarkdownFile(filePath, contentDir, type) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const slug = path.basename(filePath, '.md');
  const htmlContent = marked(markdownContent);
  
  return {
    metadata: data,
    content: markdownContent,
    htmlContent,
    slug,
    type
  };
}

function buildContentData() {
  const contentDir = path.join(process.cwd(), 'src/content');
  const principlesDir = path.join(contentDir, 'principles');
  const conceptsDir = path.join(contentDir, 'concepts');
  
  const data = {
    principles: [],
    concepts: []
  };
  
  // Process principles
  if (fs.existsSync(principlesDir)) {
    const principleFiles = fs.readdirSync(principlesDir).filter(f => f.endsWith('.md'));
    for (const file of principleFiles) {
      const filePath = path.join(principlesDir, file);
      try {
        const principle = processMarkdownFile(filePath, principlesDir, 'principle');
        data.principles.push(principle);
      } catch (error) {
        console.error(`Error processing principle ${file}:`, error);
      }
    }
  }
  
  // Process concepts
  if (fs.existsSync(conceptsDir)) {
    const conceptFiles = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
    for (const file of conceptFiles) {
      const filePath = path.join(conceptsDir, file);
      try {
        const concept = processMarkdownFile(filePath, conceptsDir, 'concept');
        data.concepts.push(concept);
      } catch (error) {
        console.error(`Error processing concept ${file}:`, error);
      }
    }
  }
  
  // Sort principles
  data.principles.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.principle.localeCompare(b.metadata.principle);
  });
  
  return data;
}

// Create the plugin
export function contentPlugin() {
  return {
    name: 'content-plugin',
    configResolved(config) {
      this.isProduction = config.command === 'build';
    },
    buildStart() {
      // Generate content data at build time
      const contentData = buildContentData();
      
      // Write to a temporary file that can be imported
      const outputDir = path.join(process.cwd(), 'src/lib');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputFile = path.join(outputDir, 'content-data.generated.ts');
      const content = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const contentData = ${JSON.stringify(contentData, null, 2)} as const;

export type GeneratedPrincipleMetadata = {
  id: string;
  principle: string;
  tags: string[];
  references: string[];
  status: 'draft' | 'active' | 'deprecated';
};

export type GeneratedPrinciple = {
  metadata: GeneratedPrincipleMetadata;
  content: string;
  htmlContent: string;
  slug: string;
  type: 'principle';
};

export type GeneratedConceptMetadata = {
  id: string;
  title: string;
  icon: string;
  category: string;
  relationships: string[];
  examples: string[];
  date: string;
};

export type GeneratedConcept = {
  metadata: GeneratedConceptMetadata;
  content: string;
  htmlContent: string;
  slug: string;
  type: 'concept';
};
`;
      
      fs.writeFileSync(outputFile, content);
      console.log('Content data generated successfully!');
    }
  };
}