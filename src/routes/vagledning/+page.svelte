<script lang="ts">
	import { ChevronRight, Search, BookOpen, Menu, ArrowUp } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { getSidebarContext } from '$lib/sidebar-state.svelte';
    import { getConcept, type Concept } from '$lib/content';
	import { loadGuidanceContent, getNavigationSections, type GuidanceContent } from '$lib/guidance-content';
	
	let guidanceContent = $state<Promise<GuidanceContent | null>>();
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	
	const sidebar = getSidebarContext();
	
	let currentSection = $state('');
	let searchQuery = $state('');
	let showTOC = $state(false);
	let showBackToTop = $state(false);
	
	
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
		
	}

	// Dynamically determine which section should be highlighted based on actual scroll position
	function updateCurrentSection() {
		const sections = document.querySelectorAll('.guidance-content h1[id], .guidance-content h2[id], .guidance-content h3[id]');
		if (sections.length === 0) return;

		// Get the actual scroll margin from CSS
		const firstSection = sections[0] as HTMLElement;
		const scrollMargin = parseInt(getComputedStyle(firstSection).scrollMarginTop) || 0;
		
		let current = '';
		let closestSection: string = "";
		let closestDistance = Infinity;

		sections.forEach((section) => {
			const rect = section.getBoundingClientRect();
			// Calculate distance from the "active zone" (top of viewport + scroll margin)
			const activeZone = scrollMargin;
			const distanceFromActiveZone = Math.abs(rect.top - activeZone);
			
			// Section is visible and closest to the active zone
			if (rect.bottom > 0 && rect.top < window.innerHeight) {
				if (distanceFromActiveZone < closestDistance) {
					closestDistance = distanceFromActiveZone;
					closestSection = section.id;
				}
			}
		});

		// If we found a closest section, use it
		if (closestSection) {
			current = closestSection;
		}
		
		if (current !== currentSection) {
			currentSection = current;
		}
	}

	let intersectionObserver: IntersectionObserver | null = null;

	// Setup intersection observer for content after it loads
	function setupSectionTracking() {
		// Clean up existing observer
		if (intersectionObserver) {
			intersectionObserver.disconnect();
		}

		// Get the actual scroll margin dynamically
		const headings = document.querySelectorAll('.guidance-content h1[id], .guidance-content h2[id], .guidance-content h3[id]');
		if (headings.length === 0) return;

		const firstHeading = headings[0] as HTMLElement;
		const scrollMargin = parseInt(getComputedStyle(firstHeading).scrollMarginTop) || 0;

		// Set up intersection observer with dynamic root margin based on actual CSS
		intersectionObserver = new IntersectionObserver(
			(entries) => {
				// Use the same logic as handleScroll for consistency
				updateCurrentSection();
			},
			{ 
				threshold: [0, 0.1, 0.5, 1], 
				rootMargin: `-${scrollMargin + 20}px 0px -50% 0px` // Dynamic margin based on actual CSS
			}
		);

		// Observe all section headings
		headings.forEach((heading) => {
			intersectionObserver?.observe(heading);
		});
	}

	// Setup concept link handlers for interactive content
	function setupConceptLinkHandlers() {
		// Add click handlers for concept links
		const conceptLinks = document.querySelectorAll('.guidance-content a[href^="concept:"]');
		conceptLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const href = (e.target as HTMLAnchorElement).getAttribute('href');
				if (href?.startsWith('concept:')) {
					const conceptSlug = href.replace('concept:', '');
					openTermInSidebar(conceptSlug);
				}
			});
		});
		
		// Setup expandable section handlers
		const expandButtons = document.querySelectorAll('.guidance-content .expand-toggle');
		expandButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				const button = e.currentTarget as HTMLButtonElement;
				const content = button.nextElementSibling as HTMLElement;
				const section = button.parentElement as HTMLElement;
				
				if (content.style.display === 'none' || !content.style.display) {
					content.style.display = 'block';
					section.classList.add('expanded');
				} else {
					content.style.display = 'none';
					section.classList.remove('expanded');
				}
			});
		});
		
		// Setup section reference handlers
		const sectionRefs = document.querySelectorAll('.guidance-content .section-ref');
		sectionRefs.forEach(link => {
			link.addEventListener('click', (e) => {
				showTOC = false; // Close mobile TOC
			});
		});
		
		// Setup principle reference handlers
		const principleRefs = document.querySelectorAll('.guidance-content a[href^="principle:"]');
		principleRefs.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const href = (e.target as HTMLAnchorElement).getAttribute('href');
				if (href?.startsWith('principle:')) {
					const principleSlug = href.replace('principle:', '');
					// You could extend this to open principles in sidebar
					console.log('Open principle:', principleSlug);
				}
			});
		});
	}
	
	onMount(() => {
		let cancelled = false;

		
		try {
			guidanceContent = loadGuidanceContent();
			if (cancelled) return; 

			isLoading = false;
			
			// Wait for content to be loaded and rendered
			setTimeout(() => {
				if (!cancelled) {
					setupSectionTracking();
					setupConceptLinkHandlers();
					// Initial section update
					updateCurrentSection();
				}
			}, 100);
		} catch (err: any) {
			if (cancelled) return;
			error = err.message;
			isLoading = false;
		}
		

		// sync setup
		window.addEventListener('scroll', handleScroll);

		// cleanup (must be returned from here)
		return () => {
			cancelled = true;
			window.removeEventListener('scroll', handleScroll);
			if (intersectionObserver) {
				intersectionObserver.disconnect();
			}
		};
	});

</script>


<div class="min-h-screen bg-gray-50 ">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
		<!-- Page Header -->
		 {#await guidanceContent}
			<!-- Navigation -->
			<div class="space-y-2">
				<div class="h-8 bg-gray-200 rounded animate-pulse"></div>
				<div class="h-6 bg-gray-200 rounded animate-pulse ml-3"></div>
				<div class="h-6 bg-gray-200 rounded animate-pulse"></div>
				<div class="h-6 bg-gray-200 rounded animate-pulse ml-3"></div>
				<div class="h-6 bg-gray-200 rounded animate-pulse"></div>
			</div>
		{:then gContent}
		{@const navSections = getNavigationSections(gContent?.sections || [])}
		{@const allSections = navSections.flatMap(section => [section, ...(section.children || []), ...(section.children ? section.children.flatMap(child => child.children || []) : [])])}
		<div class="bg-white rounded-xl shadow-sm p-6 mb-8">
			<h1 class="text-3xl font-bold text-[#352F44] mb-2">
				{gContent?.title || 'HERAF - Vägledning'}
			</h1>
			<p class="text-gray-600">Det levande dokumentet för att skapa referensarkitekturer inom högre utbildning </p>
			
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
		
		<div class="grid lg:grid-cols-5 gap-8 min-w-0">
			<!-- Sidebar Navigation -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow-sm p-4 sticky top-8">
					<!-- Mobile TOC Toggle -->
					<button
						onclick={() => showTOC = !showTOC}
						class="lg:hidden w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-4"
					>
						<span class="font-semibold text-gray-900">Innehållsförteckning </span>
						<Menu class="w-4 h-4" />
					</button>

					<div class="lg:block" class:hidden={!showTOC}>
						<h3 class="font-semibold text-gray-900 mb-4">Innehållsförteckning</h3>

						{#if error}
							<!-- Error State -->
							<div class="text-center py-4">
								<p class="text-sm text-gray-500">Kunde inte ladda navigering</p>
							</div>
						{/if}
						
						{#if navSections.length === 0}
							<!-- Empty State -->
							<div class="text-center py-4">
								<p class="text-sm text-gray-500">Ingen navigering tillgänglig</p>
							</div>
						{:else}
							<!-- Loaded Navigation -->
							<nav class="space-y-1 max-h-96 overflow-y-auto overflow-x-hidden pr-1">
								{#each navSections as section}
									<a
										href="#{section.id}"
										class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm block
											{currentSection === section.id 
												? 'bg-[#352F44] text-white' 
												: 'text-gray-700 hover:bg-gray-100'}
											{section.level === 1 ? 'font-semibold' : section.level === 2 ? 'font-medium' : 'font-normal'}"
									>
										{section.title}
									</a>
									
									<!-- Render children if they exist -->
									{#if section.children && section.children.length > 0}
										{#each section.children as child}
											<a
												href="#{child.id}"
												class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm ml-4 block
													{currentSection === child.id 
														? 'bg-[#352F44] text-white' 
														: 'text-gray-600 hover:bg-gray-100'}
													{child.level === 3 ? 'text-xs' : 'text-sm'}"
											>
												{child.title}
											</a>
											
											<!-- Render grandchildren if they exist -->
											{#if child.children && child.children.length > 0}
												{#each child.children as grandchild}
													<a
														href="#{grandchild.id}"
														class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-xs ml-8 block
															{currentSection === grandchild.id 
																? 'bg-[#352F44] text-white' 
																: 'text-gray-500 hover:bg-gray-100'}"
													>
														{grandchild.title}
													</a>
												{/each}
											{/if}
										{/each}
									{/if}
								{/each}
							</nav>
						{/if}
					</div>
					
					<!-- Progress Indicator -->
					<div class="mt-6 pt-6 border-t">
						<div class="text-sm text-gray-600 mb-2">Du läser:</div>
						<div class="text-xs font-medium text-[#352F44]">
							{allSections.find(s => s.id === currentSection)?.title || 'Början av dokumentet'}
						</div>
					</div>
				</div>

			</div>
			
			<!-- Main Content Area -->
			<div class="lg:col-span-4 min-w-0">
				<div class="bg-white rounded-xl shadow-sm p-8 overflow-hidden min-w-0">
					{#if isLoading}
						<!-- Loading State -->
						<div class="flex items-center justify-center py-12">
							<div class="text-center">
								<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#352F44] mx-auto mb-4"></div>
								<p class="text-gray-600">Laddar vägledning...</p>
							</div>
						</div>
					{:else if error}
						<!-- Error State -->
						<div class="text-center py-12">
							<div class="text-red-500 mb-4">
								<BookOpen class="w-12 h-12 mx-auto mb-2" />
								<p class="text-lg font-semibold">Kunde inte ladda vägledningen</p>
							</div>
							<p class="text-gray-600 mb-4">{error}</p>
							<button 
								onclick={() => window.location.reload()}
								class="bg-[#352F44] text-white px-4 py-2 rounded-lg hover:bg-[#5C5470] transition-colors"
							>
								Försök igen
							</button>
						</div>
					{:else if gContent}
						<!-- Guidance Content -->
						<div class="prose max-w-none guidance-content min-w-0">
							{@html gContent.fullContent}
						</div>
					{:else}
						<!-- Fallback -->
						<div class="text-center py-12">
							<BookOpen class="w-12 h-12 mx-auto mb-4 text-gray-400" />
							<p class="text-gray-600">Inget innehåll att visa</p>
						</div>
					{/if}
				</div>
			</div>

		</div>
		{/await}

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
		color: rgb(55, 65, 81);
		line-height: 1.625;
		min-width: 0;
		overflow-wrap: break-word;
		word-wrap: break-word;
	}
	
	:global(.guidance-content h1) {
		font-size: 1.875rem;
		font-weight: 700;
		color: #352F44;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgb(229, 231, 235);
		scroll-margin-top: 120px;
	}
	
	:global(.guidance-content h2) {
		font-size: 1.5rem;
		font-weight: 700;
		color: #352F44;
		margin-bottom: 1.5rem;
		margin-top: 3rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgb(229, 231, 235);
		scroll-margin-top: 120px;
	}
	
	:global(.guidance-content h3) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #0D3B4F;
		margin-bottom: 1rem;
		margin-top: 2rem;
		scroll-margin-top: 120px;
	}
	
	:global(.guidance-content h4) {
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(17, 24, 39);
		margin-bottom: 0.75rem;
		margin-top: 1.5rem;
	}
	
	:global(.guidance-content h5) {
		font-size: 1rem;
		font-weight: 600;
		color: rgb(55, 65, 81);
		margin-bottom: 0.5rem;
		margin-top: 1rem;
	}
	
	:global(.guidance-content p) {
		margin-bottom: 1rem;
		color: rgb(55, 65, 81);
		line-height: 1.625;
		overflow-wrap: break-word;
		word-wrap: break-word;
	}
	
	:global(.guidance-content ul, .guidance-content ol) {
		margin-bottom: 1rem;
		line-height: 1.5;
	}
	
	:global(.guidance-content li) {
		color: rgb(55, 65, 81);
		line-height: 1.625;
	}
	
	:global(.guidance-content ul > li) {
		margin-left: 1.5rem;
		list-style-type: disc;
	}
	
	:global(.guidance-content ol > li) {
		margin-left: 1.5rem;
		list-style-type: decimal;
	}
	
	:global(.guidance-content blockquote) {
		background-color: rgb(239, 246, 255);
		border-left: 4px solid rgb(59, 130, 246);
		padding: 1rem;
		border-radius: 0.375rem;
		margin: 1.5rem 0;
	}
	
	:global(.guidance-content code) {
		background-color: rgb(243, 244, 246);
		color: rgb(55, 65, 81);
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	}
	
	:global(.guidance-content pre) {
		background-color: rgb(17, 24, 39);
		color: rgb(243, 244, 246);
		padding: 1rem;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
		overflow-x: auto;
		max-width: 100%;
	}
	
	:global(.guidance-content pre code) {
		background-color: transparent;
		color: rgb(243, 244, 246);
		padding: 0;
	}
	
	:global(.guidance-content table) {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid rgb(209, 213, 219);
		margin: 1.5rem 0;
	}
	
	:global(.guidance-content th) {
		background-color: rgb(243, 244, 246);
		border: 1px solid rgb(209, 213, 219);
		padding: 1rem;
		text-align: left;
		font-weight: 600;
	}
	
	:global(.guidance-content td) {
		border: 1px solid rgb(209, 213, 219);
		padding: 1rem;
	}
	
	:global(.guidance-content a) {
		color: #0D3B4F;
		text-decoration: underline;
		transition: color 0.2s ease;
	}
	
	:global(.guidance-content a:hover) {
		color: #456882;
	}
	
	:global(.guidance-content strong) {
		font-weight: 600;
		color: rgb(17, 24, 39);
	}
	
	:global(.guidance-content em) {
		font-style: italic;
	}
	
	/* Special styling for callout boxes */
	:global(.guidance-content blockquote strong:first-child) {
		color: rgb(30, 58, 138);
		display: block;
		margin-bottom: 0.25rem;
	}
	
	/* Section spacing */
	:global(.guidance-content > *:first-child) {
		margin-top: 0;
	}
	
	:global(.guidance-content hr) {
		border-color: rgb(209, 213, 219);
		margin: 2rem 0;
	}
	
	:global(.guidance-content a[href^="concept:"]) {
		color: #0D3B4F;
		text-decoration: underline;
		text-decoration-style: dotted;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	:global(.guidance-content a[href^="concept:"]:hover) {
		color: #456882;
		text-decoration-style: solid;
		background-color: rgba(13, 59, 79, 0.05);
		padding: 0 1px;
	}
	
	/* Section references */
	:global(.guidance-content .section-ref) {
		color: #352F44;
		text-decoration: none;
		background-color: rgba(53, 47, 68, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
		border: 1px solid rgba(53, 47, 68, 0.2);
		transition: all 0.2s ease;
	}
	
	:global(.guidance-content .section-ref:hover) {
		background-color: rgba(53, 47, 68, 0.2);
		border-color: rgba(53, 47, 68, 0.4);
	}
	
	/* Principle references */
	:global(.guidance-content .principle-ref) {
		color: #5C5470;
		text-decoration: none;
		background-color: rgba(92, 84, 112, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
		border: 1px solid rgba(92, 84, 112, 0.2);
		transition: all 0.2s ease;
		font-weight: 500;
	}
	
	:global(.guidance-content .principle-ref:hover) {
		background-color: rgba(92, 84, 112, 0.2);
		border-color: rgba(92, 84, 112, 0.4);
	}
	
	/* Callout boxes */
	:global(.guidance-content .callout) {
		margin: 1.5rem 0;
		border: 1px solid;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	
	:global(.guidance-content .callout-header) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		font-weight: 600;
		border-bottom: 1px solid inherit;
		background-color: rgba(0, 0, 0, 0.05);
	}
	
	:global(.guidance-content .callout-content) {
		padding: 1rem;
		line-height: 1.6;
	}
	
	:global(.guidance-content .callout-icon) {
		font-size: 1.2rem;
	}
	
	:global(.guidance-content .callout-tip) {
		background-color: rgb(240, 253, 244);
		border-color: rgb(187, 247, 208);
		color: rgb(21, 128, 61);
	}
	
	:global(.guidance-content .callout-warning) {
		background-color: rgb(254, 252, 232);
		border-color: rgb(253, 224, 71);
		color: rgb(146, 64, 14);
	}
	
	:global(.guidance-content .callout-danger) {
		background-color: rgb(254, 242, 242);
		border-color: rgb(252, 165, 165);
		color: rgb(153, 27, 27);
	}
	
	:global(.guidance-content .callout-info) {
		background-color: rgb(239, 246, 255);
		border-color: rgb(147, 197, 253);
		color: rgb(29, 78, 216);
	}
	
	:global(.guidance-content .callout-note) {
		background-color: rgb(249, 250, 251);
		border-color: rgb(209, 213, 219);
		color: rgb(55, 65, 81);
	}
	
	:global(.guidance-content .callout-important) {
		background-color: rgb(250, 245, 255);
		border-color: rgb(196, 181, 253);
		color: rgb(109, 40, 217);
	}
	
	/* Example blocks */
	:global(.guidance-content .example-block) {
		margin: 1.5rem 0;
		border: 1px solid rgb(187, 247, 208);
		border-radius: 0.5rem;
		background-color: rgb(240, 253, 244);
		overflow: hidden;
	}
	
	:global(.guidance-content .example-header) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		font-weight: 600;
		color: rgb(21, 128, 61);
		border-bottom: 1px solid rgb(187, 247, 208);
		background-color: rgba(21, 128, 61, 0.1);
	}
	
	:global(.guidance-content .example-content) {
		padding: 1rem;
		color: rgb(21, 128, 61);
		line-height: 1.6;
	}
	
	:global(.guidance-content .example-icon) {
		font-size: 1.2rem;
	}
	
	/* Image styling */
	:global(.guidance-content .image-figure) {
		margin: 2rem 0;
		text-align: center;
	}
	
	:global(.guidance-content .guidance-image) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 0 auto;
		display: block;
		object-fit: contain;
	}
	
	/* Logo images - make them smaller */
	:global(.guidance-content .logo-image) {
		max-width: 600px;
		max-height: 550px;
		object-fit: contain;
		margin: 0 auto;
	}
	
	:global(.guidance-content .image-caption) {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: rgb(107, 114, 128);
		font-style: italic;
	}
	
	/* Expandable sections */
	:global(.guidance-content .expandable-section) {
		margin: 1.5rem 0;
		border: 1px solid rgb(229, 231, 235);
		border-radius: 0.5rem;
		overflow: hidden;
	}
	
	:global(.guidance-content .expand-toggle) {
		width: 100%;
		padding: 1rem;
		background-color: rgb(249, 250, 251);
		border: none;
		text-align: left;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background-color 0.2s ease;
		font-weight: 500;
		color: rgb(55, 65, 81);
	}
	
	:global(.guidance-content .expand-toggle:hover) {
		background-color: rgb(243, 244, 246);
	}
	
	:global(.guidance-content .expand-icon) {
		transition: transform 0.2s ease;
		font-size: 0.875rem;
		color: rgb(107, 114, 128);
	}
	
	:global(.guidance-content .expandable-section.expanded .expand-icon) {
		transform: rotate(90deg);
	}
	
	:global(.guidance-content .expand-content) {
		padding: 1rem;
		border-top: 1px solid rgb(229, 231, 235);
		background-color: white;
		line-height: 1.6;
	}
	
	/* Mobile responsiveness */
	@media (max-width: 768px) {
		:global(.guidance-content h1) {
			font-size: 1.5rem;
		}
		
		:global(.guidance-content h2) {
			font-size: 1.25rem;
		}
		
		:global(.guidance-content h3) {
			font-size: 1.125rem;
		}
		
		:global(.guidance-content) {
			font-size: 0.875rem;
		}
		
		/* Ensure images fit on mobile screens */
		:global(.guidance-content .guidance-image) {
			max-width: calc(100vw - 4rem);
			min-width: 100%;
			width: 100%;
		}
		
		:global(.guidance-content .logo-image) {
			max-width: min(300px, calc(100vw - 4rem));
			max-height: 200px;
		}
		
		:global(.guidance-content .image-figure) {
			margin: 1rem 0;
		}
		
		/* Better table handling on mobile */
		:global(.guidance-content table) {
			font-size: 0.875rem;
		}
		
		:global(.guidance-content th, .guidance-content td) {
			padding: 0.75rem;
		}
	}
</style>