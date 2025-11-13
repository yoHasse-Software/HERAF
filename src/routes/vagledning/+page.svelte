<script lang="ts">
	import { ChevronRight, Search, Info, BookOpen, Lightbulb, Settings, Target } from '@lucide/svelte';
	import { onMount } from 'svelte';
	
	let currentSection = $state('introduction');
	let searchQuery = $state('');
	let showTermModal = $state(false);
	let selectedTerm = $state('');
	
	const navigationSections = [
		{ id: 'introduction', title: 'Inledning', icon: BookOpen },
		{ id: 'concepts', title: 'Begrepp', icon: Lightbulb },
		{ id: 'heram-overview', title: 'HERAM Översikt', icon: Settings },
		{ id: 'create-architecture', title: 'Skapa Referensarkitektur', icon: Target },
		{ id: 'examples', title: 'Exempel & Mallar', icon: ChevronRight }
	];
	
	const terms = {
		'Referensarkitektur': 'En generisk arkitektur för en klass av informationssystem som ger vägledning för designen av specifika arkitekturer.',
		'Concern': 'Ett intresse eller fokusområde som är viktigt för systemets intressenter.',
		'Aspekt': 'En dimension av intresse för design av ett system.',
		'Princip': 'En grundläggande regel eller tro som vägleder eller begränsar arkitekturella beslut.',
		'Vy': 'En representation av ett system från perspektivet av relaterade concerns.'
	};
	
	function scrollToSection(sectionId: string) {
		currentSection = sectionId;
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
	
	function openTermModal(term: string) {
		selectedTerm = term;
		showTermModal = true;
	}
	
	function closeModal() {
		showTermModal = false;
		selectedTerm = '';
	}
	
	onMount(() => {
		// Highlight clickable terms in the content
		const content = document.querySelector('.main-content');
		if (content) {
			Object.keys(terms).forEach(term => {
				const regex = new RegExp(`\\b${term}\\b`, 'gi');
				content.innerHTML = content.innerHTML.replace(regex, `<span class="clickable-term" data-term="${term}">${term}</span>`);
			});
			
			// Add event listeners to clickable terms
			content.addEventListener('click', (e) => {
				const target = e.target as HTMLElement;
				if (target.classList.contains('clickable-term')) {
					openTermModal(target.dataset.term || '');
				}
			});
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Page Header -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-8">
			<h1 class="text-3xl font-bold text-[#352F44] mb-2">Vägledningen</h1>
			<p class="text-gray-600">Det levande dokumentet för att skapa referensarkitekturer</p>
			
			<!-- Search Bar -->
			<div class="mt-6 max-w-md">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input 
						bind:value={searchQuery}
						type="text" 
						placeholder="Sök i begrepp, processsteg, principer..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#352F44] focus:border-transparent"
					>
				</div>
			</div>
		</div>
		
		<div class="grid lg:grid-cols-5 gap-8">
			<!-- Sidebar Navigation -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
					<h3 class="font-semibold text-gray-900 mb-4">Navigation</h3>
					<nav class="space-y-2">
						{#each navigationSections as section}
						{@const IconComponent = section.icon}

							<button
								onclick={() => scrollToSection(section.id)}
								class="w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200
									{currentSection === section.id 
										? 'bg-[#352F44] text-white' 
										: 'text-gray-700 hover:bg-gray-100'}"
							>
								<IconComponent class="w-4 h-4 mr-3" />
								<span class="text-sm">{section.title}</span>
							</button>
						{/each}
					</nav>
					
					<!-- Progress Indicator -->
					<div class="mt-6 pt-6 border-t">
						<div class="text-sm text-gray-600 mb-2">Du är här:</div>
						<div class="text-xs font-medium text-[#352F44]">
							{navigationSections.find(s => s.id === currentSection)?.title || 'Inledning'}
						</div>
					</div>
				</div>
			</div>
			
			<!-- Main Content Area -->
			<div class="lg:col-span-3">
				<div class="bg-white rounded-xl shadow-sm p-8 main-content">
					<!-- Introduction Section -->
					<section id="introduction" class="mb-12">
						<h2 class="text-2xl font-bold text-[#352F44] mb-6 flex items-center">
							<BookOpen class="w-6 h-6 mr-3" />
							Inledning
						</h2>
						<div class="prose max-w-none">
							<p class="text-gray-700 leading-relaxed mb-4">
								Denna vägledning hjälper dig att förstå och använda HERAF (Higher Education Reference Architecture Framework) 
								för att skapa effektiva <span class="clickable-term" data-term="Referensarkitektur">referensarkitekturer</span> 
								inom högskole- och universitetssektorn.
							</p>
							<p class="text-gray-700 leading-relaxed mb-6">
								HERAF kombinerar den teoretiska grunden i HERAM med praktisk vägledning för att skapa 
								arkitekturer som är jämförbara, återanvändbara och underhållsbara.
							</p>
							
							<div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
								<div class="flex items-start">
									<Info class="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
									<div>
										<h4 class="font-medium text-blue-900 mb-1">Tips</h4>
										<p class="text-blue-800 text-sm">
											Klicka på understrukna begrepp för att få snabba definitioner och fördjupning.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
					
					<!-- Concepts Section -->
					<section id="concepts" class="mb-12">
						<h2 class="text-2xl font-bold text-[#352F44] mb-6 flex items-center">
							<Lightbulb class="w-6 h-6 mr-3" />
							Centrala Begrepp
						</h2>
						<div class="grid md:grid-cols-2 gap-6">
							{#each Object.entries(terms) as [term, definition]}
								<div class="border border-gray-200 rounded-lg p-4 hover:border-[#352F44] transition-colors cursor-pointer"
									 onclick={() => openTermModal(term)}>
									<h4 class="font-semibold text-gray-900 mb-2">{term}</h4>
									<p class="text-gray-600 text-sm">{definition.substring(0, 80)}...</p>
									<button class="text-[#352F44] text-sm mt-2 hover:underline">
										Läs mer →
									</button>
								</div>
							{/each}
						</div>
					</section>
					
					<!-- HERAM Overview Section -->
					<section id="heram-overview" class="mb-12">
						<h2 class="text-2xl font-bold text-[#352F44] mb-6 flex items-center">
							<Settings class="w-6 h-6 mr-3" />
							HERAM i Praktiken
						</h2>
						<div class="prose max-w-none">
							<p class="text-gray-700 leading-relaxed mb-4">
								HERAM (Higher Education Reference Architecture Model) definierar de byggstenar och 
								<span class="clickable-term" data-term="Princip">principer</span> som alla referensarkitekturer bör följa.
							</p>
							
							<div class="bg-gradient-to-r from-[#0D3B4F]/10 to-[#456882]/10 rounded-lg p-6 my-6">
								<h4 class="font-semibold text-[#0D3B4F] mb-3">HERAM:s Kärnkomponenter</h4>
								<ul class="space-y-2 text-gray-700">
									<li>• <strong>Vyer (Views):</strong> Olika perspektiv på arkitekturen</li>
									<li>• <strong>Aspekter:</strong> Horisontella intressen som säkerhet, prestanda</li>
									<li>• <strong>Concerns:</strong> Intressenters specifika behov och krav</li>
									<li>• <strong>Principer:</strong> Vägledande regler för arkitekturella beslut</li>
								</ul>
								<a href="/heram" class="inline-flex items-center mt-4 text-[#0D3B4F] hover:underline">
									Utforska HERAM interaktivt
									<ChevronRight class="w-4 h-4 ml-1" />
								</a>
							</div>
						</div>
					</section>
					
					<!-- Create Architecture Section -->
					<section id="create-architecture" class="mb-12">
						<h2 class="text-2xl font-bold text-[#352F44] mb-6 flex items-center">
							<Target class="w-6 h-6 mr-3" />
							Skapa Din Referensarkitektur
						</h2>
						<div class="prose max-w-none">
							<p class="text-gray-700 leading-relaxed mb-6">
								Processen för att skapa en referensarkitektur följer fyra huvudsteg med kontinuerliga aktiviteter.
							</p>
							
							<div class="grid md:grid-cols-2 gap-4 mb-6">
								<div class="bg-gray-50 p-4 rounded-lg">
									<h4 class="font-semibold text-gray-900 mb-2">Huvudsteg</h4>
									<ol class="space-y-1 text-sm text-gray-700">
										<li>1. Omfång</li>
										<li>2. Identifiering</li>
										<li>3. Definiering</li>
										<li>4. Konkretisering</li>
									</ol>
								</div>
								<div class="bg-gray-50 p-4 rounded-lg">
									<h4 class="font-semibold text-gray-900 mb-2">Kontinuerliga Aktiviteter</h4>
									<ul class="space-y-1 text-sm text-gray-700">
										<li>• Förankra med målgrupp</li>
										<li>• Kommunicera med intressenter</li>
										<li>• Dokumentera beslut</li>
									</ul>
								</div>
							</div>
							
							<a href="/process" class="inline-flex items-center px-4 py-2 bg-[#352F44] text-white rounded-lg hover:bg-[#5C5470] transition-colors">
								Gå till interaktiv processguide
								<ChevronRight class="w-4 h-4 ml-2" />
							</a>
						</div>
					</section>
					
					<!-- Examples Section -->
					<section id="examples" class="mb-12">
						<h2 class="text-2xl font-bold text-[#352F44] mb-6 flex items-center">
							<ChevronRight class="w-6 h-6 mr-3" />
							Exempel & Mallar
						</h2>
						<div class="grid md:grid-cols-3 gap-6">
							<div class="border border-gray-200 rounded-lg p-4 hover:border-[#352F44] transition-colors">
								<h4 class="font-semibold text-gray-900 mb-2">IAM Referensarkitektur</h4>
								<p class="text-gray-600 text-sm mb-3">Identitets- och åtkomsthantering för högskolor</p>
								<button class="text-[#352F44] text-sm hover:underline">Visa exempel →</button>
							</div>
							<div class="border border-gray-200 rounded-lg p-4 hover:border-[#352F44] transition-colors">
								<h4 class="font-semibold text-gray-900 mb-2">Integration RA</h4>
								<p class="text-gray-600 text-sm mb-3">Systemintegration och dataflöden</p>
								<button class="text-[#352F44] text-sm hover:underline">Visa exempel →</button>
							</div>
							<div class="border border-gray-200 rounded-lg p-4 hover:border-[#352F44] transition-colors">
								<h4 class="font-semibold text-gray-900 mb-2">Mallar</h4>
								<p class="text-gray-600 text-sm mb-3">Nedladdningsbara mallar för att komma igång</p>
								<button class="text-[#352F44] text-sm hover:underline">Ladda ner →</button>
							</div>
						</div>
					</section>
				</div>
			</div>
			
			<!-- Right Sidebar -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
					<h3 class="font-semibold text-gray-900 mb-4">Snabbval</h3>
					<div class="space-y-3">
						<button class="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
							<div class="font-medium text-gray-900 text-sm">Principer</div>
							<div class="text-xs text-gray-600">Arkitekturprinciper</div>
						</button>
						<button class="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
							<div class="font-medium text-gray-900 text-sm">Begrepp</div>
							<div class="text-xs text-gray-600">Definitioner</div>
						</button>
						<button class="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
							<div class="font-medium text-gray-900 text-sm">Processsteg</div>
							<div class="text-xs text-gray-600">Gå till process</div>
						</button>
					</div>
					
					<div class="mt-6 pt-6 border-t">
						<div class="text-sm text-gray-600 mb-2">Nästa steg:</div>
						<a href="/heram" class="text-xs font-medium text-[#0D3B4F] hover:underline">
							Utforska HERAM-modellen →
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Term Modal -->
{#if showTermModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-xl max-w-lg w-full p-6">
			<div class="flex justify-between items-start mb-4">
				<h3 class="text-xl font-bold text-gray-900">{selectedTerm}</h3>
				<button onclick={closeModal} class="text-gray-400 hover:text-gray-600">
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<p class="text-gray-700 mb-4">{terms[selectedTerm]}</p>
			<div class="flex space-x-3">
				<button onclick={closeModal} class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
					Stäng
				</button>
				<button class="px-4 py-2 bg-[#352F44] text-white rounded-lg hover:bg-[#5C5470] transition-colors">
					Läs mer i HERAM
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.clickable-term) {
		text-decoration: underline;
		text-decoration-style: dotted;
		color: #352F44;
		cursor: pointer;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
	}
	:global(.clickable-term:hover) {
		background-color: rgba(53,47,68,0.1);
	}
</style>