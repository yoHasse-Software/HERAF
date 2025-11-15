<script lang="ts">
	import { Brain, Eye, Shield, Zap, Users, FileText, ArrowRight, Info, X, Archive, Target, Layers, Map, Compass, AlertCircle, Puzzle, BookOpen, Navigation } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { getConcepts, getPrinciple, getPrinciples, type Concept, type ConceptMetadata, type Principle } from '$lib/content';
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
	let principles: Principle[] = $state([]);
	let concepts: Record<string, Concept> = $state({});
	
	// Load principles on mount
	onMount(async () => {
		try {
			principles = getPrinciples();
		} catch (error) {
			console.error('Error loading principles:', error);
		}
		// Load concepts metadata
		try {
			concepts = getConcepts();
		} catch (error) {
			console.error('Error loading concepts metadata:', error);
		}
	});

	
	function openConceptInSidebar(conceptSlug: string) {
		const concept = concepts[conceptSlug];
		if (concept) {
			sidebar.openConcept(concept);
		} else {
			console.warn(`Concept not found: ${conceptSlug}`);
		}
	}
	
	function openPrincipleInSidebar(principle: Principle) {
		sidebar.openPrinciple(principle);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Page Header -->
		<div class="bg-gradient-to-r from-[#0D3B4F] to-[#456882] rounded-xl shadow-sm p-8 mb-8 text-white">
			<div class="flex items-center mb-4">
				<Brain class="w-8 h-8 mr-3" />
				<h1 class="text-3xl font-bold">HERAM</h1>
			</div>
			<p class="text-blue-100 text-lg mb-2">Higher Education Reference Architecture Model</p>
			<p class="text-blue-200">Den interaktiva modellen som definierar kärnbegreppen och relationerna</p>
		</div>
		
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Interactive Concept Map -->
			<div class="lg:col-span-2">
				<div class="bg-white rounded-xl shadow-sm p-8">
					<h2 class="text-2xl font-bold text-[#0D3B4F] mb-6">Interaktiv Konceptkarta</h2>
					<p class="text-gray-600 mb-8">Klicka på begreppen för att utforska definitioner, relationer och exempel.</p>
					
					<!-- Concept Map Visualization -->
					<div class="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl min-h-96">
						<!-- Center: Reference Architecture -->
						<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0D3B4F] text-white px-6 py-4 rounded-lg text-center font-semibold">
							Referens-<br>arkitektur
						</div>
						
						<!-- Surrounding Concepts -->
						<button 
							onclick={() => openConceptInSidebar('vy')}
							class="absolute top-8 left-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<Eye class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Vy</div>
						</button>
						
						<button 
							onclick={() => openConceptInSidebar('aspekter')}
							class="absolute top-8 right-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<Shield class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Aspekt</div>
						</button>
						
						<button 
							onclick={() => openConceptInSidebar('angelagenhet')}
							class="absolute bottom-8 left-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<Users class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Angelägenhet</div>
						</button>
						
						<button 
							onclick={() => openConceptInSidebar('styrande-principer')}
							class="absolute bottom-8 right-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<FileText class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Princip</div>
						</button>
						
						<button 
							onclick={() => openConceptInSidebar('intressenter')}
							class="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<Users class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Intressent</div>
						</button>
						
						<button 
							onclick={() => openConceptInSidebar('arkitekturperspektiv')}
							class="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<Zap class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Perspektiv</div>
						</button>
						
						<!-- Connection Lines (SVG overlay) -->
						<svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
							<defs>
								<marker id="arrowhead" markerWidth="10" markerHeight="7" 
								 refX="10" refY="3.5" orient="auto">
								  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
								</marker>
							</defs>
							<!-- Lines connecting concepts -->
							<line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" />
							<line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" />
							<line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" />
							<line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" />
						</svg>
					</div>
				</div>
			</div>
			
			<!-- Principles List -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow-sm p-6">
					<h3 class="text-xl font-bold text-[#0D3B4F] mb-6">Arkitekturprinciper</h3>
					
					<div class="space-y-4">
						{#each principles as principle}
							<button 
								onclick={() => openPrincipleInSidebar(principle)}
								class="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#0D3B4F] hover:bg-blue-50 transition-all duration-200"
							>
								<div class="flex justify-between items-start mb-2">
									<h4 class="font-semibold text-gray-900 text-sm">{principle.metadata.principle}</h4>
									<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{principle.metadata.status}</span>
								</div>
								<div class="flex flex-wrap gap-1 mb-2">
									{#each principle.metadata.tags.slice(0, 3) as tag}
										<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
									{/each}
								</div>
								<div class="flex items-center text-[#0D3B4F] text-xs">
									Läs mer <ArrowRight class="w-3 h-3 ml-1" />
								</div>
							</button>
						{:else}
							<div class="text-gray-500 text-center py-4">
								Inga principer laddade än...
							</div>
						{/each}
					</div>
					
					<div class="mt-6 pt-6 border-t">
						<a href={resolve('/vagledning')} class="text-sm text-[#0D3B4F] hover:underline flex items-center">
							← Tillbaka till vägledningen
						</a>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Quick Reference Grid -->
		<div class="mt-8 bg-white rounded-xl shadow-sm p-8">
			<h3 class="text-xl font-bold text-[#0D3B4F] mb-6">Snabbreferens</h3>
			<div class="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
				{#each Object.entries(concepts) as [slug, concept]}
					{@const IconComponent = iconMap[concept.metadata.icon] || FileText}
					<button 
						onclick={() => openConceptInSidebar(slug)}
						class="p-4 border border-gray-200 rounded-lg hover:border-[#0D3B4F] hover:bg-blue-50 transition-colors text-center"
					>
						<IconComponent class="w-8 h-8 mx-auto mb-2 text-[#0D3B4F]" />
						<h4 class="text-sm font-semibold text-gray-900">{concept.metadata.title}</h4>
						<!-- <p class="text-xs text-gray-600 mt-1">{@html concept.htmlContent.substring(0, 40)}...</p> -->
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>