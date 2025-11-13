import { getContext, setContext } from 'svelte';
import type { Principle, Concept } from '$lib/content';

// Define content types that can be displayed in sidebar
export type SidebarContentType = 'principle' | 'concept' | 'custom';

export interface SidebarContent {
	type: SidebarContentType;
	title: string;
	content: string;
	htmlContent?: string;
	metadata?: any;
	data?: Principle | Concept | any;
}

// Create a sidebar state class using Svelte 5 runes
class SidebarState {
	// Core state
	isOpen = $state(false);
	content = $state<SidebarContent | null>(null);
	
	// Derived states
	hasContent = $derived(this.content !== null);
	contentType = $derived(this.content?.type || null);
	
	// Actions
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
	
	// Convenience methods for different content types
	openPrinciple(principle: Principle) {
		this.open({
			type: 'principle',
			title: principle.metadata.principle,
			content: principle.content,
			htmlContent: principle.htmlContent,
			metadata: principle.metadata,
			data: principle
		});
	}
	
	openConcept(concept: Concept) {
		this.open({
			type: 'concept',
			title: concept.metadata.title,
			content: concept.content,
			htmlContent: concept.htmlContent,
			metadata: concept.metadata,
			data: concept
		});
	}
	
	openCustomContent(title: string, htmlContent: string, metadata?: any) {
		this.open({
			type: 'custom',
			title,
			content: '',
			htmlContent,
			metadata,
			data: { title, htmlContent, metadata }
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

// Type guard functions
export function isPrincipleContent(content: SidebarContent | null): content is SidebarContent & { data: Principle } {
	return content?.type === 'principle';
}

export function isConceptContent(content: SidebarContent | null): content is SidebarContent & { data: Concept } {
	return content?.type === 'concept';
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