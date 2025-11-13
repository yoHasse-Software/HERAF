import { getContext, setContext } from 'svelte';
import type { Principle, Concept } from '$lib/content';
import type { Snippet } from 'svelte';

// Generic sidebar content interface
export interface SidebarContent {
	title: string;
	content: string;
	htmlContent?: string;
	categoryLabel?: string;
	categoryColor?: string;
	metadata?: Record<string, any>;
	footerContent?: string;
	footerHref?: string;
}

// Create a sidebar state class using Svelte 5 runes
class SidebarState {
	// Core state
	isOpen = $state(false);
	content = $state<SidebarContent | null>(null);
	
	// Derived states
	hasContent = $derived(this.content !== null);
	
	// Generic open method - this is the main API
	open(content: SidebarContent) {
		this.content = content;
		this.isOpen = true;
	}
	
	close() {
		this.isOpen = false;
		// Delay clearing content to allow for closing animation
		setTimeout(() => {
			if (!this.isOpen) {
				this.content = null;
			}
		}, 300); // Match transition duration
	}
	
	toggle() {
		if (this.isOpen) {
			this.close();
		} else if (this.content) {
			this.isOpen = true;
		}
	}
	
	// Convenience methods for backward compatibility
	openPrinciple(principle: Principle) {
		this.open({
			title: principle.metadata.id,
			content: principle.content,
			htmlContent: principle.htmlContent,
			categoryLabel: 'Arkitekturprincip',
			categoryColor: 'blue',
			metadata: {
				header: principle.metadata.principle,
				status: principle.metadata.status,
				tags: principle.metadata.tags,
				references: principle.metadata.references,
				type: 'principle'
			},
			footerContent: 'Se i fullständig vägledning',
			footerHref: `/vagledning#principle-${principle.metadata.id}`
		});
	}
	
	openConcept(concept: Concept) {
		this.open({
			title: concept.metadata.title,
			content: concept.content,
			htmlContent: concept.htmlContent,
			categoryLabel: 'Koncept',
			categoryColor: 'green',
			metadata: {
				header: concept.metadata.title,
				category: concept.metadata.category,
				examples: concept.metadata.examples,
				relationships: concept.metadata.relationships,
				type: 'concept'
			},
			footerContent: 'Utforska i HERAM',
			footerHref: '/heram'
		});
	}
	
	// Generic method for custom content (e.g., terms, definitions)
	openGeneric(options: {
		title: string;
		htmlContent?: string;
		content?: string;
		categoryLabel?: string;
		categoryColor?: string;
		metadata?: Record<string, any>;
		footerContent?: string;
		footerHref?: string;
	}) {
		console.log('openGeneric called with options:', options);
		this.open({
			title: options.title,
			content: options.content || '',
			htmlContent: options.htmlContent,
			categoryLabel: options.categoryLabel,
			categoryColor: options.categoryColor || 'gray',
			metadata: options.metadata,
			footerContent: options.footerContent,
			footerHref: options.footerHref
		});
	}
	
	// Update content without changing open state
	updateContent(content: SidebarContent) {
		this.content = content;
	}
}

// Context key for the sidebar state
const SIDEBAR_CONTEXT_KEY = 'sidebar';

// Create and provide sidebar context
export function createSidebarContext() {
	const sidebar = new SidebarState();
	setContext(SIDEBAR_CONTEXT_KEY, sidebar);
	return sidebar;
}

// Get sidebar context
export function getSidebarContext(): SidebarState {
	const context = getContext(SIDEBAR_CONTEXT_KEY);
	if (!context) {
		throw new Error('Sidebar context not found. Make sure createSidebarContext() is called in a parent component.');
	}
	return context as SidebarState;
}

// Helper function to get content summary for preview
export function getContentSummary(content: SidebarContent): string {
	if (!content.htmlContent && !content.content) return '';
	
	const text = content.content || content.htmlContent || '';
	// Remove HTML tags and get first 150 characters
	const plainText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
	return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}

// Export the state class for typing
export { SidebarState };