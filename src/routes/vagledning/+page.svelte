<script lang="ts">
	import { ChevronRight, Search, BookOpen, Menu, ArrowUp } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { getSidebarContext } from '$lib/sidebar-state.svelte';
    import { getConcept, type Concept } from '$lib/content';
	import type { PageData } from './$types';
	
	interface Props {
		data: PageData;
	}
	
	let { data }: Props = $props();
	
	const sidebar = getSidebarContext();
	
	let currentSection = $state('');
	let searchQuery = $state('');
	let showTOC = $state(false);
	let showBackToTop = $state(false);
	
	// Generate navigation sections from the guidance content
	const navigationSections = $derived(() => {
		return data.guidance.toc
			.filter(section => section.level <= 2) // Only main sections
			.map(section => ({
				id: section.id,
				title: section.title,
				level: section.level
			}));
	});
	
	function scrollToSection(sectionId: string) {
		currentSection = sectionId;
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		showTOC = false; // Close mobile TOC
	}
	
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	
	function openTermInSidebar(termName: string) {
		const concept = getConcept(termName);
		if (concept) {
			sidebar.openConcept(concept);
		}
	}
	
	// Handle scroll events for current section tracking and back-to-top button
	function handleScroll() {
		const scrollTop = window.scrollY;
		
		// Show back-to-top button when scrolled down
		showBackToTop = scrollTop > 500;
		
		// Update current section based on scroll position
		const sections = document.querySelectorAll('h2, h3');
		let current = '';
		
		sections.forEach((section) => {
			const rect = section.getBoundingClientRect();
			if (rect.top <= 100) {
				const id = section.id || section.textContent?.toLowerCase()
					.replace(/[^a-z0-9\s-]/g, '')
					.replace(/\s+/g, '-') || '';
				current = id;
			}
		});
		
		currentSection = current;
	}
	
	onMount(() => {
		// Add scroll listener
		window.addEventListener('scroll', handleScroll);
		
		// Set up intersection observer for section tracking
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						currentSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.1, rootMargin: '-100px 0px -50% 0px' }
		);
		
		// Observe all section headings
		document.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
			observer.observe(heading);
		});
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
		};
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Page Header -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-8">
			<h1 class="text-3xl font-bold text-[#352F44] mb-2">{data.guidance.title}</h1>
			<p class="text-gray-600">Det levande dokumentet för att skapa referensarkitekturer inom högre utbildning</p>
			
			<!-- Search Bar -->
			<div class="mt-6 max-w-md">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input 
						bind:value={searchQuery}
						type="text" 
						placeholder="Sök i vägledningen..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#352F44] focus:border-transparent"
					>
				</div>
			</div>
		</div>
		
		<div class="grid lg:grid-cols-5 gap-8">
			<!-- Sidebar Navigation -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
					<!-- Mobile TOC Toggle -->
					<button
						onclick={() => showTOC = !showTOC}
						class="lg:hidden w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-4"
					>
						<span class="font-semibold text-gray-900">Innehållsförteckning</span>
						<Menu class="w-4 h-4" />
					</button>
					
					<!-- Navigation -->
					<div class="lg:block" class:hidden={!showTOC}>
						<h3 class="font-semibold text-gray-900 mb-4">Innehållsförteckning</h3>
						<nav class="space-y-1 max-h-96 overflow-y-auto">
							{#each navigationSections as section}
								<button
									onclick={() => scrollToSection(section.id)}
									class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm
										{currentSection === section.id 
											? 'bg-[#352F44] text-white' 
											: 'text-gray-700 hover:bg-gray-100'}
										{section.level === 2 ? 'font-medium' : 'ml-3 text-xs'}"
								>
									{section.title}
								</button>
							{/each}
						</nav>
					</div>
					
					<!-- Progress Indicator -->
					<div class="mt-6 pt-6 border-t">
						<div class="text-sm text-gray-600 mb-2">Du läser:</div>
						<div class="text-xs font-medium text-[#352F44]">
							{navigationSections.find(s => s.id === currentSection)?.title || 'Början av dokumentet'}
						</div>
					</div>
				</div>
			</div>
			
			<!-- Main Content Area -->
			<div class="lg:col-span-4">
				<div class="bg-white rounded-xl shadow-sm p-8">
					<!-- Guidance Content -->
					<div class="prose max-w-none guidance-content">
						{@html data.guidance.fullContent}
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Back to Top Button -->
	{#if showBackToTop}
		<button
			onclick={scrollToTop}
			class="fixed bottom-8 right-8 bg-[#352F44] hover:bg-[#5C5470] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
			aria-label="Tillbaka till toppen"
		>
			<ArrowUp class="w-5 h-5" />
		</button>
	{/if}
</div>

<style>
	:global(.guidance-content) {
		@apply text-gray-700 leading-relaxed;
	}
	
	:global(.guidance-content h1) {
		@apply text-3xl font-bold text-[#352F44] mb-6 pb-3 border-b border-gray-200;
	}
	
	:global(.guidance-content h2) {
		@apply text-2xl font-bold text-[#352F44] mb-6 mt-12 pb-2 border-b border-gray-200;
		scroll-margin-top: 120px;
	}
	
	:global(.guidance-content h3) {
		@apply text-xl font-semibold text-[#0D3B4F] mb-4 mt-8;
		scroll-margin-top: 120px;
	}
	
	:global(.guidance-content h4) {
		@apply text-lg font-semibold text-gray-900 mb-3 mt-6;
	}
	
	:global(.guidance-content h5) {
		@apply text-base font-semibold text-gray-800 mb-2 mt-4;
	}
	
	:global(.guidance-content p) {
		@apply mb-4 text-gray-700 leading-relaxed;
	}
	
	:global(.guidance-content ul, .guidance-content ol) {
		@apply mb-4 space-y-2;
	}
	
	:global(.guidance-content li) {
		@apply text-gray-700 leading-relaxed;
	}
	
	:global(.guidance-content ul > li) {
		@apply ml-6 list-disc;
	}
	
	:global(.guidance-content ol > li) {
		@apply ml-6 list-decimal;
	}
	
	:global(.guidance-content blockquote) {
		@apply bg-blue-50 border-l-4 border-blue-500 p-4 rounded my-6;
	}
	
	:global(.guidance-content code) {
		@apply bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono;
	}
	
	:global(.guidance-content pre) {
		@apply bg-gray-900 text-gray-100 p-4 rounded-lg my-6 overflow-x-auto;
	}
	
	:global(.guidance-content pre code) {
		@apply bg-transparent text-gray-100 p-0;
	}
	
	:global(.guidance-content table) {
		@apply w-full border-collapse border border-gray-300 my-6;
	}
	
	:global(.guidance-content th) {
		@apply bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold;
	}
	
	:global(.guidance-content td) {
		@apply border border-gray-300 px-4 py-2;
	}
	
	:global(.guidance-content a) {
		@apply text-[#0D3B4F] underline hover:text-[#456882] transition-colors;
	}
	
	:global(.guidance-content strong) {
		@apply font-semibold text-gray-900;
	}
	
	:global(.guidance-content em) {
		@apply italic;
	}
	
	/* Special styling for callout boxes */
	:global(.guidance-content blockquote strong:first-child) {
		@apply text-blue-900 block mb-1;
	}
	
	/* Section spacing */
	:global(.guidance-content > *:first-child) {
		@apply mt-0;
	}
	
	:global(.guidance-content hr) {
		@apply border-gray-300 my-8;
	}
	
	/* Mobile responsiveness */
	@media (max-width: 768px) {
		:global(.guidance-content h1) {
			@apply text-2xl;
		}
		
		:global(.guidance-content h2) {
			@apply text-xl;
		}
		
		:global(.guidance-content h3) {
			@apply text-lg;
		}
		
		:global(.guidance-content) {
			@apply text-sm;
		}
	}
</style>