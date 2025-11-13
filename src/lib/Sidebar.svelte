<script lang="ts">
	import { X, ChevronRight, ExternalLink, Tag, Calendar, User, Eye, Shield, Users, FileText, Zap, Archive, ArrowRight, Target, Layers, Map, Compass, AlertCircle, Puzzle, BookOpen, Navigation } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { getSidebarContext, isPrincipleContent, isConceptContent, getContentSummary } from '$lib/sidebar-state.svelte';
	import type { SidebarContent } from '$lib/sidebar-state.svelte';
	import { marked } from 'marked';
	
	// Icon mapping for concepts
	const iconMap = {
		'Archive': Archive,
		'ArrowRight': ArrowRight,
		'Target': Target,
		'FileTemplate': BookOpen,
		'Layers': Layers,
		'Map': Map,
		'Compass': Compass,
		'Guide': Navigation,
		'Shield': Shield,
		'Users': Users,
		'AlertCircle': AlertCircle,
		'Eye': Eye,
		'FileText': FileText,
		'Puzzle': Puzzle
	};
	
	const sidebar = getSidebarContext();
	
	// Reactive state using Svelte 5 runes
	let isOpen = $derived(sidebar.isOpen);
	let content = $derived(sidebar.content);
	let hasContent = $derived(sidebar.hasContent);
	
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
			<!-- Content Type Indicator -->
			<div class="p-4 bg-gray-50 border-b">
				<div class="flex items-center text-sm text-gray-600">
					{#if content.type === 'principle'}
						<Tag class="w-4 h-4 mr-2" />
						Arkitekturprincip
					{:else if content.type === 'concept'}
						<User class="w-4 h-4 mr-2" />
						Koncept
					{:else}
						<ExternalLink class="w-4 h-4 mr-2" />
						Information
					{/if}
				</div>
			</div>
			
			<!-- Metadata for Principles -->
			{#if isPrincipleContent(content)}
				<div class="p-4 border-b">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
							{content.data.metadata.status}
						</span>
						{#if content.data.metadata.date}
							<div class="flex items-center text-xs text-gray-500">
								<Calendar class="w-3 h-3 mr-1" />
								{content.data.metadata.date}
							</div>
						{/if}
					</div>
					
					{#if content.data.metadata.tags.length > 0}
						<div>
							<h4 class="text-xs font-medium text-gray-700 mb-2">Taggar</h4>
							<div class="flex flex-wrap gap-1">
								{#each content.data.metadata.tags as tag (tag)}
									<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{tag}</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Metadata for Concepts -->
			{#if isConceptContent(content)}
				<div class="p-4 border-b">
					{#if content.data.metadata.category}
						<div class="mb-3">
							<span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
								{content.data.metadata.category}
							</span>
						</div>
					{/if}
					
					{#if content.data.metadata.examples && content.data.metadata.examples.length > 0}
						<div>
							<h4 class="text-xs font-medium text-gray-700 mb-2">Exempel</h4>
							<div class="space-y-1">
								{#each content.data.metadata.examples as example (example)}
									<div class="text-xs text-gray-600">• {example}</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Main Content -->
			<div class="p-4">
				{#if content.htmlContent}
					<!-- Content is sanitized through marked markdown processor -->
					<div class="prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-[#0D3B4F] prose-a:no-underline hover:prose-a:underline">
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
		<footer class="border-t border-gray-200 p-4 bg-gray-50">
			{#if isPrincipleContent(content)}
				<div class="space-y-2">
					{#if content.data.metadata.references.length > 0}
						<div>
							<h5 class="text-xs font-medium text-gray-700 mb-1">Relaterade principer</h5>
							<div class="flex flex-wrap gap-1">
								{#each content.data.metadata.references as reference (reference)}
									<span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{reference}</span>
								{/each}
							</div>
						</div>
					{/if}
					<a 
						href={`/vagledning#principle-${content.data.metadata.id}`} 
						class="inline-flex items-center text-xs text-[#0D3B4F] hover:underline"
					>
						Se i fullständig vägledning
						<ChevronRight class="w-3 h-3 ml-1" />
					</a>
				</div>
			{:else if isConceptContent(content)}
				<div class="space-y-2">
					{#if content.data.metadata.relationships.length > 0}
						<div>
							<h5 class="text-xs font-medium text-gray-700 mb-1">Relaterade koncept</h5>
							<div class="flex flex-wrap gap-1">
								{#each content.data.metadata.relationships as relationship (relationship)}
									<span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{relationship}</span>
								{/each}
							</div>
						</div>
					{/if}
					<a 
						href="/heram" 
						class="inline-flex items-center text-xs text-[#0D3B4F] hover:underline"
					>
						Utforska i HERAM
						<ChevronRight class="w-3 h-3 ml-1" />
					</a>
				</div>
			{:else}
				<a 
					href="/vagledning" 
					class="inline-flex items-center text-xs text-[#0D3B4F] hover:underline"
				>
					Tillbaka till vägledning
					<ChevronRight class="w-3 h-3 ml-1" />
				</a>
			{/if}
		</footer>
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