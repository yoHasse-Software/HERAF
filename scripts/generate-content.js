import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked
marked.use({ async: false });

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
        const principle = processMarkdownFile(filePath);
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
        const concept = processMarkdownFile(filePath);
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
console.log(`📊 Generated ${contentData.principles.length} principles and ${contentData.concepts.length} concepts`);