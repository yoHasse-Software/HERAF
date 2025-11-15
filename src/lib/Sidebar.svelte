<script lang="ts">
	import { X, ChevronRight, ExternalLink, Tag, Calendar, User } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { getSidebarContext, getContentSummary } from '$lib/sidebar-state.svelte';
	import type { SidebarContent } from '$lib/sidebar-state.svelte';
	
	const sidebar = getSidebarContext();
	
	// Reactive state using Svelte 5 runes
	let isOpen = $derived(sidebar.isOpen);
	let content = $derived(sidebar.content);
	let hasContent = $derived(sidebar.hasContent);
	
	// Helper function to get category color classes
	function getCategoryClasses(color?: string) {
		switch (color) {
			case 'blue':
				return 'bg-blue-100 text-blue-800';
			case 'green':
				return 'bg-green-100 text-green-800';
			case 'purple':
				return 'bg-purple-100 text-purple-800';
			case 'red':
				return 'bg-red-100 text-red-800';
			case 'yellow':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
	
	function handleClose() {
		sidebar.close();
	}
	
	function handleOverlayClick() {
		sidebar.close();
	}
	
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			sidebar.close();
		}
	}
	
	function handleOverlayKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			sidebar.close();
		}
	}
</script>


<svelte:window on:keydown={handleKeyDown} />

<!-- Overlay -->
{#if isOpen}
	<div 
		class="fixed inset-0 bg-opacity-100 z-40 transition-opacity duration-300"
		onclick={handleOverlayClick}
		onkeydown={handleOverlayKeyDown}
		role="button"
		tabindex="-1"
		transition:fade={{ duration: 300 }}
		aria-label="Stäng sidebar"
	></div>
{/if}

<!-- Sidebar -->
<aside 
	class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
	class:translate-x-full={!isOpen}
	class:translate-x-0={isOpen}
>
	<!-- Header -->
	<header class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#0D3B4F] to-[#456882] text-white">
		<h2 class="text-lg font-semibold truncate">
			{content?.title || 'Sidebar'}
		</h2>
		<button 
			onclick={handleClose}
			class="p-2 rounded-lg hover:bg-white/20 transition-colors"
			aria-label="Stäng sidebar"
		>
			<X class="w-5 h-5" />
		</button>
	</header>
	
	<!-- Content -->
	{#if content}
		<div class="flex-1 overflow-y-auto">
			<!-- Category Indicator -->
			{#if content.categoryLabel}
				<div class="p-4 bg-gray-50 border-b">
					<div class="flex items-center text-sm">
						<ExternalLink class="w-4 h-4 mr-2" />
						<span class="text-xs font-medium px-2 py-1 rounded-full {getCategoryClasses(content.categoryColor)}">
							{content.categoryLabel}
						</span>
					</div>
				</div>
			{/if}
			
			<!-- Metadata Section -->
			{#if content.metadata}
				<div class="p-4 border-b">
					<!-- Status/Category badges -->
					<div class="flex items-center justify-start mb-3 gap-2">
                        {#if content.metadata.header}
                            <h1 class="">{content.metadata.header}</h1>
                        {/if}
						{#if content.metadata.status}
							<span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
								{content.metadata.status}
							</span>
						{/if}
						{#if content.metadata.date}
							<div class="flex items-center text-xs text-gray-500">
								<Calendar class="w-3 h-3 mr-1" />
								{new Date(content.metadata.date).toLocaleDateString('sv-SE')}
							</div>
						{/if}
					</div>
					
					<!-- Tags -->
					{#if content.metadata.tags && content.metadata.tags.length > 0}
						<div class="mb-3">
							<h4 class="text-xs font-medium text-gray-700 mb-2">Taggar</h4>
							<div class="flex flex-wrap gap-1">
								{#each content.metadata.tags as tag (tag)}
									<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{tag}</span>
								{/each}
							</div>
						</div>
					{/if}
					
					<!-- Examples -->
					{#if content.metadata.examples && content.metadata.examples.length > 0}
						<div class="mb-3">
							<h4 class="text-xs font-medium text-gray-700 mb-2">Exempel</h4>
							<div class="space-y-1">
								{#each content.metadata.examples as example (example)}
									<div class="text-xs text-gray-600">• {example}</div>
								{/each}
							</div>
						</div>
					{/if}
					
					<!-- Category (for concepts) -->
					{#if content.metadata.category}
						<div class="mb-3">
							<h4 class="text-xs font-medium text-gray-700 mb-2">Kategori</h4>
							<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
								{content.metadata.category}
							</span>
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Main Content -->
			<div class="p-4">
				{#if content.htmlContent}
					<!-- Content is sanitized through marked markdown processor -->
					<div class="sidebar-content">
						{@html content.htmlContent}
					</div>
				{:else if content.content}
					<div class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
						{content.content}
					</div>
				{:else}
					<div class="text-gray-500 text-sm italic text-center py-8">
						Inget innehåll tillgängligt
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Footer with Actions -->
		{#if content.footerContent || content.footerHref || (content.metadata?.relationships && content.metadata.relationships.length > 0) || (content.metadata?.references && content.metadata.references.length > 0)}
			<footer class="border-t border-gray-200 p-4 bg-gray-50">
				<!-- Relationships -->
				{#if content.metadata?.relationships && content.metadata.relationships.length > 0}
					<div class="mb-3">
						<h5 class="text-xs font-medium text-gray-700 mb-1">Relaterade koncept</h5>
						<div class="flex flex-wrap gap-1">
							{#each content.metadata.relationships as relationship (relationship)}
								<span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{relationship}</span>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- References -->
				{#if content.metadata?.references && content.metadata.references.length > 0}
					<div class="mb-3">
						<h5 class="text-xs font-medium text-gray-700 mb-1">Relaterade principer</h5>
						<div class="flex flex-wrap gap-1">
							{#each content.metadata.references as reference (reference)}
								<span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{reference}</span>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Footer link -->
				{#if content.footerContent && content.footerHref}
					<a 
						href={content.footerHref} 
						class="inline-flex items-center text-xs text-[#0D3B4F] hover:underline"
					>
						{content.footerContent}
						<ChevronRight class="w-3 h-3 ml-1" />
					</a>
				{:else if content.footerContent}
					<div class="text-xs text-gray-600">
						{content.footerContent}
					</div>
				{/if}
			</footer>
		{/if}
	{:else}
		<!-- Empty state -->
		<div class="flex-1 flex items-center justify-center p-8">
			<div class="text-center text-gray-500">
				<ExternalLink class="w-12 h-12 mx-auto mb-4 opacity-50" />
				<p class="text-sm">Välj ett innehåll för att visa det här</p>
			</div>
		</div>
	{/if}
</aside>


<style>
	/* Custom styling for sidebar content */
	:global(.sidebar-content) {
		font-size: 0.875rem; /* text-sm */
		line-height: 1.5;
		color: #374151; /* text-gray-700 */
	}

	/* Header styling with better hierarchy */
	:global(.sidebar-content h1) {
		font-size: 1.125rem; /* text-lg */
		font-weight: 700; /* font-bold */
		color: #0D3B4F; /* Brand color */
		margin: 0 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #E5E7EB; /* border-gray-200 */
	}

	:global(.sidebar-content h2) {
		font-size: 1rem; /* text-base */
		font-weight: 600; /* font-semibold */
		color: #1F2937; /* text-gray-800 */
		margin: 1.5rem 0 0.75rem 0;
		padding-left: 0.5rem;
		background-color: #F9FAFB; /* bg-gray-50 */
		padding: 0.5rem 0.75rem;
		border-radius: 0.25rem;
	}

	:global(.sidebar-content h3) {
		font-size: 0.9375rem; /* slightly smaller */
		font-weight: 600; /* font-semibold */
		color: #374151; /* text-gray-700 */
		margin: 1.25rem 0 0.5rem 0;
		padding-left: 0.75rem;
	}

	:global(.sidebar-content h4) {
		font-size: 0.875rem; /* text-sm */
		font-weight: 600; /* font-semibold */
		color: #4B5563; /* text-gray-600 */
		margin: 1rem 0 0.5rem 0;
	}

	/* Paragraph styling */
	:global(.sidebar-content p) {
		margin: 0 0 0.75rem 0;
		line-height: 1.6;
	}

	/* List styling */
	:global(.sidebar-content ul) {
		margin: 0.5rem 0 1rem 0;
		padding-left: 1rem;
	}

	:global(.sidebar-content li) {
		margin: 0.25rem 0;
		line-height: 1.5;
	}

	:global(.sidebar-content ul li) {
		position: relative;
		list-style: none;
	}

	:global(.sidebar-content ul li::before) {
		content: "•";
		color: #0D3B4F;
		font-weight: bold;
		position: absolute;
		left: -0.75rem;
	}

	/* Strong text styling */
	:global(.sidebar-content strong) {
		font-weight: 600;
		color: #1F2937; /* text-gray-800 */
	}

	/* Link styling */
	:global(.sidebar-content a) {
		color: #0D3B4F;
		text-decoration: none;
		font-weight: 500;
		border-bottom: 1px dotted #0D3B4F;
	}

	:global(.sidebar-content a:hover) {
		text-decoration: none;
		border-bottom: 1px solid #0D3B4F;
		background-color: rgba(13, 59, 79, 0.05);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		margin: -0.125rem -0.25rem;
	}

	/* Code styling if any */
	:global(.sidebar-content code) {
		background-color: #F3F4F6; /* bg-gray-100 */
		color: #1F2937; /* text-gray-800 */
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
		font-family: 'Courier New', monospace;
	}

	/* Special styling for definition sections */
	:global(.sidebar-content blockquote) {
		border-left: 4px solid #D1D5DB; /* border-gray-300 */
		padding-left: 1rem;
		margin: 1rem 0;
		font-style: italic;
		color: #6B7280; /* text-gray-500 */
	}

	/* Ensure proper spacing between sections */
	:global(.sidebar-content > *:first-child) {
		margin-top: 0;
	}

	:global(.sidebar-content > *:last-child) {
		margin-bottom: 0;
	}

	/* Special styling for concept categories */
	:global(.sidebar-content h2 + h3) {
		margin-top: 1rem;
	}

	/* Nested list styling */
	:global(.sidebar-content ul ul) {
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
		padding-left: 0.75rem;
	}

	:global(.sidebar-content ul ul li::before) {
		content: "◦";
		color: #6B7280; /* text-gray-500 */
	}
</style>