// Import the pre-generated content data
import { contentData } from './content-data.generated';

export interface PrincipleMetadata {
	id: string;
	principle: string;
	tags: string[];
	references: string[];
	status: 'draft' | 'active' | 'deprecated';
}

export interface Principle {
	metadata: Record<string, any>;
	content: string;
	htmlContent: string;
	slug: string;
}

export interface ConceptMetadata {
	id: string;
	title: string;
	icon: string;
	category: string;
	relationships: string[];
	examples: string[];
	date: string;
}

export interface Concept {
	metadata: Record<string, any>;
	content: string;
	htmlContent: string;
	slug: string;
}

// Type-safe helpers to convert from generated data
function convertPrincipleMetadata(metadata: any): Record<string, any> {
	return {
		id: metadata.id,
		principle: metadata.principle,
		tags: Array.isArray(metadata.tags) ? [...metadata.tags] : [],
		references: Array.isArray(metadata.references) ? [...metadata.references] : [],
		status: metadata.status || 'draft'
	};
}

function convertConceptMetadata(metadata: any): Record<string, any> {
	return {
		id: metadata.id,
		title: metadata.title,
		header: metadata.title,
		icon: metadata.icon || '',
		category: metadata.category || '',
		relationships: Array.isArray(metadata.relationships) ? [...metadata.relationships] : [],
		examples: Array.isArray(metadata.examples) ? [...metadata.examples] : [],
		date: metadata.date || new Date().toISOString().split('T')[0],
	};
}

// Simple synchronous function to get all principles
export function getPrinciples(): Principle[] {
	return (contentData.principles as any[]).map((p: any) => ({
		metadata: convertPrincipleMetadata(p.metadata),
		content: p.content || '',
		htmlContent: p.htmlContent || '',
		slug: p.slug || ''
	})) || [];
}

// Simple synchronous function to get all concepts as an array
export function getConceptsArray(): Concept[] {
	// Check if concepts exist in contentData
	if (!contentData.concepts || !Array.isArray(contentData.concepts) || contentData.concepts.length === 0) {
		return [];
	}
	
	return (contentData.concepts as any[]).map((c: any) => ({
		metadata: convertConceptMetadata(c.metadata),
		content: c.content || '',
		htmlContent: c.htmlContent || '',
		slug: c.slug || ''
	}));
}

// Function to get concepts as a key-value object for the heram page
export function getConcepts(): Record<string, Concept> {
	const conceptsArray = getConceptsArray();
	const conceptsObject: Record<string, Concept> = {};
	
	conceptsArray.forEach(concept => {
		conceptsObject[concept.slug] = concept;
	});
	
	return conceptsObject;
}

// Async wrapper for backward compatibility (will be removed in future)
export async function loadConcepts(): Promise<Concept[]> {
	return getConceptsArray();
}

// Function to get a specific principle by slug
export function getPrinciple(slug: string): Principle | null {
	const principles = getPrinciples();
	return principles.find(p => p.slug === slug) || null;
}

// Function to get a specific concept by slug
export function getConcept(slug: string): Concept | null {
	const concepts = getConceptsArray();
	return concepts.find(c => c.slug === slug) || null;
}

// Search function across principles and concepts
export function searchContent(
	principles: Principle[], 
	concepts: Concept[], 
	query: string
): { principles: Principle[]; concepts: Concept[] } {
	const lowerQuery = query.toLowerCase();
	
	const filteredPrinciples = principles.filter(principle => 
		principle.metadata.principle.toLowerCase().includes(lowerQuery) ||
		principle.metadata.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)) ||
		principle.content.toLowerCase().includes(lowerQuery)
	);
	
	const filteredConcepts = concepts.filter(concept =>
		concept.metadata.title.toLowerCase().includes(lowerQuery) ||
		concept.content.toLowerCase().includes(lowerQuery)
	);
	
	return {
		principles: filteredPrinciples,
		concepts: filteredConcepts
	};
}

// Function to get principles by tags
export function getPrinciplesByTag(principles: Principle[], tag: string): Principle[] {
	return principles.filter(principle => 
		principle.metadata.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
	);
}

// Function to get related principles based on tags
export function getRelatedPrinciples(
	currentPrinciple: Principle, 
	allPrinciples: Principle[]
): Principle[] {
	const currentTags = currentPrinciple.metadata.tags;
	
	return allPrinciples
		.filter(p => p.metadata.id !== currentPrinciple.metadata.id)
		.filter(p => p.metadata.tags.some((tag: string) => currentTags.includes(tag)))
		.slice(0, 3); // Return max 3 related principles
}