<script lang="ts">
	import { Brain, Eye, Shield, Zap, Users, FileText, ArrowRight, ArrowUp, Info, X, Archive, Target, Layers, Map, Compass, AlertCircle, Puzzle, BookOpen, Navigation, ChevronDown, ChevronRight } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { getConcepts, getPrinciple, type Concept, type ConceptMetadata } from '$lib/content';
	import { contentData } from '$lib/content-data.generated.js';
	import { getSidebarContext } from '$lib/sidebar-state.svelte';
	import { resolve } from '$app/paths';

	// Icon mapping for concepts
	const iconMap: Record<string, any> = {
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
	let concepts: Record<string, Concept> = $state({});
	
	// Get governance and concepts from new structure
	const governance = contentData.governance;
	const conceptsArray = contentData.concepts;
	
	// Tab state
	let activeTab = $state('concepts');
	
	// Back to top functionality
	let showBackToTop = $state(false);
	
	// Load concepts metadata on mount
	onMount(async () => {
		try {
			concepts = getConcepts();
		} catch (error) {
			console.error('Error loading concepts metadata:', error);
		}
	});
	
	onMount(() => {
		// Handle scroll for back to top button
		function handleScroll() {
			showBackToTop = window.scrollY > 300;
		}
		
		window.addEventListener('scroll', handleScroll);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	
	function openConceptInSidebar(conceptSlug: string) {
		// Find concept in the new data structure
		const concept = conceptsArray.find(c => c.slug === conceptSlug);
		if (concept) {
			sidebar.openConcept(concept);
		} else {
			console.warn(`Concept not found: ${conceptSlug}`);
		}
	}

	function scrollToConcept(conceptSlug: string) {
		const element = document.getElementById(`concept-${conceptSlug}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
	
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
		<!-- Page Header -->
		<div class="bg-gradient-to-r from-[#0D3B4F] to-[#456882] rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white">
			<div class="flex items-center mb-3 sm:mb-4">
				<Brain class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
				<h1 class="text-2xl sm:text-3xl font-bold">HERAM</h1>
			</div>
			<p class="text-blue-100 text-base sm:text-lg mb-1 sm:mb-2">Higher Education Reference Architecture Model</p>
			<p class="text-blue-200 text-sm sm:text-base">Den interaktiva modellen som definierar kärnbegreppen och relationerna</p>
		</div>
		
		<!-- Tab Navigation -->
		<div class="bg-white rounded-xl shadow-sm mb-8">
			<div class="border-b border-gray-200">
				<nav class="flex overflow-x-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-x-2 sm:space-x-8">
					<button
						class="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 {activeTab === 'concepts' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'concepts'}
					>
						<div class="flex items-center gap-1 sm:gap-2">
							<Brain class="h-3 w-3 sm:h-4 sm:w-4" />
							<span class="hidden sm:inline">Koncept & Modell</span>
							<span class="sm:hidden">Koncept</span>
						</div>
					</button>
					<button
						class="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 {activeTab === 'principles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'principles'}
					>
						<div class="flex items-center gap-1 sm:gap-2">
							<FileText class="h-3 w-3 sm:h-4 sm:w-4" />
							<span class="hidden sm:inline">Principer ({governance.principles.length})</span>
							<span class="sm:hidden">Principer</span>
						</div>
					</button>
					<button
						class="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 {activeTab === 'rules' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'rules'}
					>
						<div class="flex items-center gap-1 sm:gap-2">
							<AlertCircle class="h-3 w-3 sm:h-4 sm:w-4" />
							<span class="hidden sm:inline">Regler ({governance.rules.length})</span>
							<span class="sm:hidden">Regler</span>
						</div>
					</button>
					<button
						class="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 {activeTab === 'guidelines' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'guidelines'}
					>
						<div class="flex items-center gap-1 sm:gap-2">
							<BookOpen class="h-3 w-3 sm:h-4 sm:w-4" />
							<span class="hidden sm:inline">Riktlinjer ({governance.guidelines.length})</span>
							<span class="sm:hidden">Riktlinjer</span>
						</div>
					</button>
				</nav>
			</div>
			
			<!-- Tab Content -->
			<div class="p-4 sm:p-6 lg:p-8">
				{#if activeTab === 'concepts'}
					<!-- Concept Map & Concepts Tab -->
					<div class="space-y-6 sm:space-y-8">
						<div class="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
							<!-- Interactive Concept Map -->
							<div class="xl:col-span-3 order-2 xl:order-1">
								<h2 class="text-xl sm:text-2xl font-bold text-[#0D3B4F] mb-4 sm:mb-6">Konceptkarta</h2>
								<p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Klicka på begreppen för att navigera till beskrivningen nedan.</p>
								
								<!-- Concept Map Visualization -->
								<div class="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 rounded-xl min-h-64 sm:min-h-96 overflow-hidden">
									<!-- Center: Reference Architecture -->
									<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0D3B4F] text-white px-3 sm:px-6 py-2 sm:py-4 rounded-lg text-center font-semibold text-sm sm:text-base">
										Referensarkitektur
									</div>
								</div>
								<h3 class="text-xl sm:text-2xl font-bold text-[#0D3B4F] mb-6 sm:mb-8 mt-8 sm:mt-12">Konceptbeskrivningar</h3>
								<div class="space-y-6 sm:space-y-8">
									{#each conceptsArray as concept}
										{@const IconComponent = iconMap[concept.metadata.icon] || Puzzle}
										<div id="concept-{concept.slug}" class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm scroll-mt-8">
											<div class="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
												<div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
													<IconComponent class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
												</div>
												<div class="flex-1 min-w-0">
													<h4 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">{concept.metadata.title}</h4>
													<div class="flex items-center gap-2 text-sm text-gray-500">
														<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
															{concept.metadata.category}
														</span>
													</div>
												</div>
											</div>
											<div class="prose prose-gray prose-sm sm:prose-lg max-w-none concept-content overflow-hidden">
												{@html concept.htmlContent}
											</div>
										</div>
									{/each}
								</div>
								
							</div>
							
							<!-- Sticky Navigation Sidebar -->
							<div class="xl:col-span-1 order-1 xl:order-2">
								<div class="xl:sticky xl:top-8 bg-gray-50 rounded-lg p-3 sm:p-4 max-h-64 xl:max-h-[calc(100vh-2rem)] overflow-y-auto">
									<h3 class="text-base sm:text-lg font-bold text-[#0D3B4F] mb-3 sm:mb-4">Koncept</h3>
									<nav class="space-y-1">
										{#each conceptsArray as concept}
											{@const IconComponent = iconMap[concept.metadata.icon] || Puzzle}
											<button 
												onclick={() => scrollToConcept(concept.slug)}
												class="flex items-center gap-2 w-full text-left p-2 text-xs sm:text-sm rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-700 hover:text-purple-700"
											>
												<IconComponent class="h-3 w-3 text-purple-600 flex-shrink-0" />
												<span class="truncate">{concept.metadata.title}</span>
											</button>
										{/each}
									</nav>
								</div>
							</div>
						</div>
						
						<!-- Concepts Descriptions -->
						<div class="mt-12">

						</div>
					</div>
					
				{:else if activeTab === 'principles'}
					<!-- Principles Tab -->
					<div class="space-y-4 sm:space-y-6">
						<h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
							<FileText class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
							Principer
						</h2>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							{#each governance.principles as principle}
								<div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
									<div class="flex justify-between items-start mb-3 sm:mb-4">
										<h3 class="text-base sm:text-lg font-semibold text-gray-900 flex-1 pr-2">{principle.metadata.id}</h3>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
											{principle.metadata.status}
										</span>
									</div>
									<h4 class="text-sm font-medium text-gray-700 mb-3">{principle.metadata.principle}</h4>
									<div class="concept-content mb-4 text-sm sm:text-base overflow-hidden">
										{@html principle.htmlContent}
									</div>
									<div class="flex flex-wrap gap-1 mb-4">
										{#each principle.metadata.tags.slice(0, 3) as tag}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
												{tag}
											</span>
										{/each}
									</div>
									<button 
										onclick={() => sidebar.openGeneric({
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
											}
										})}
										class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
									>
										Läs mer <ArrowRight class="w-3 h-3 ml-1" />
									</button>
								</div>
							{/each}
						</div>
					</div>
					
				{:else if activeTab === 'rules'}
					<!-- Rules Tab -->
					<div class="space-y-4 sm:space-y-6">
						<h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
							<AlertCircle class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
							Regler
						</h2>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							{#each governance.rules as rule}
								<div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
									<div class="flex justify-between items-start mb-3 sm:mb-4">
										<h3 class="text-base sm:text-lg font-semibold text-gray-900 flex-1 pr-2">{rule.metadata.id}</h3>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
											{rule.metadata.status}
										</span>
									</div>
									<h4 class="text-sm font-medium text-gray-700 mb-3">{rule.metadata.rule}</h4>
									<div class="concept-content mb-4 text-sm sm:text-base overflow-hidden">
										{@html rule.htmlContent}
									</div>
									<div class="flex flex-wrap gap-1 mb-4">
										{#each rule.metadata.tags.slice(0, 3) as tag}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
												{tag}
											</span>
										{/each}
									</div>
									<button 
										onclick={() => sidebar.openGeneric({
											title: rule.metadata.id,
											content: rule.content,
											htmlContent: rule.htmlContent,
											categoryLabel: 'Regel',
											categoryColor: 'red',
											metadata: {
												header: rule.metadata.rule,
												status: rule.metadata.status,
												tags: rule.metadata.tags,
												references: rule.metadata.references,
												type: 'rule'
											}
										})}
										class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
									>
										Läs mer <ArrowRight class="w-3 h-3 ml-1" />
									</button>
								</div>
							{/each}
						</div>
					</div>
					
				{:else if activeTab === 'guidelines'}
					<!-- Guidelines Tab -->
					<div class="space-y-4 sm:space-y-6">
						<h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
							<BookOpen class="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
							Riktlinjer
						</h2>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							{#each governance.guidelines as guideline}
								<div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
									<div class="flex justify-between items-start mb-3 sm:mb-4">
										<h3 class="text-base sm:text-lg font-semibold text-gray-900 flex-1 pr-2">{guideline.metadata.id}</h3>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
											{guideline.metadata.status}
										</span>
									</div>
									<h4 class="text-sm font-medium text-gray-700 mb-3">{guideline.metadata.guideline}</h4>
									<div class="concept-content mb-4 text-sm sm:text-base overflow-hidden">
										{@html guideline.htmlContent}
									</div>
									<div class="flex flex-wrap gap-1 mb-4">
										{#each guideline.metadata.tags.slice(0, 3) as tag}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
												{tag}
											</span>
										{/each}
									</div>
									<button 
										onclick={() => sidebar.openGeneric({
											title: guideline.metadata.id,
											content: guideline.content,
											htmlContent: guideline.htmlContent,
											categoryLabel: 'Riktlinje',
											categoryColor: 'green',
											metadata: {
												header: guideline.metadata.guideline,
												status: guideline.metadata.status,
												tags: guideline.metadata.tags,
												references: guideline.metadata.references,
												type: 'guideline'
											}
										})}
										class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
									>
										Läs mer <ArrowRight class="w-3 h-3 ml-1" />
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Quick Reference Grid (only shown on concepts tab) -->
		{#if activeTab === 'concepts'}
			<div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
				<h3 class="text-lg sm:text-xl font-bold text-[#0D3B4F] mb-4 sm:mb-6">Snabbreferens</h3>
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
					{#each conceptsArray as concept}
						{@const IconComponent = iconMap[concept.metadata.icon] || FileText}
						<button 
							onclick={() => scrollToConcept(concept.slug)}
							class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-[#0D3B4F] hover:bg-blue-50 transition-colors text-center"
						>
							<IconComponent class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-[#0D3B4F]" />
							<h4 class="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{concept.metadata.title}</h4>
						</button>
					{/each}
				</div>
			</div>
		{/if}
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