<script lang="ts">
	import { Brain, Eye, Shield, Zap, Users, FileText, ArrowRight, Info, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	
	let selectedConcept = $state(null);
	let showConceptModal = $state(false);
	let selectedPrinciple = $state(null);
	let showPrincipleModal = $state(false);
	
	const concepts = {
		'view': {
			title: 'Vy (View)',
			icon: Eye,
			description: 'En representation av ett system från perspektivet av relaterade concerns.',
			details: 'Vyer är specifika perspektiv på arkitekturen som fokuserar på olika aspekter som säkerhet, prestanda eller användarupplevelse. Varje vy adresserar specifika stakeholder-concerns.',
			relationships: ['concern', 'aspect', 'stakeholder'],
			examples: ['Säkerhetsvy', 'Integrationsvy', 'Användarvy']
		},
		'aspect': {
			title: 'Aspekt',
			icon: Shield,
			description: 'En dimension av intresse för design av ett system.',
			details: 'Aspekter är horisontella kvaliteter som påverkar hela systemet, som säkerhet, prestanda, eller underhållsbarhet. De genomsyrar flera vyer och komponenter.',
			relationships: ['view', 'concern', 'principle'],
			examples: ['Säkerhet', 'Prestanda', 'Skalbarhet', 'Underhållsbarhet']
		},
		'concern': {
			title: 'Concern',
			icon: Users,
			description: 'Ett intresse eller fokusområde som är viktigt för systemets intressenter.',
			details: 'Concerns representerar specifika intressen från olika stakeholders som måste adresseras i arkitekturen. De driver designbeslut och arkitekturella val.',
			relationships: ['view', 'stakeholder', 'principle'],
			examples: ['Datasäkerhet', 'Användarupplevelse', 'Systemintegration']
		},
		'principle': {
			title: 'Princip',
			icon: FileText,
			description: 'En grundläggande regel eller tro som vägleder eller begränsar arkitekturella beslut.',
			details: 'Principer är vägledande regler som hjälper arkitekter att fatta konsekventa beslut. De baseras på organisatoriska värderingar och bästa praxis.',
			relationships: ['aspect', 'concern', 'decision'],
			examples: ['Öppna standarder först', 'Privacy by design', 'Återanvändning över egen utveckling']
		},
		'stakeholder': {
			title: 'Intressent',
			icon: Users,
			description: 'En individ, grupp eller organisation som har intresse i eller påverkas av arkitekturen.',
			details: 'Intressenter inkluderar användare, utvecklare, systemadministratörer, beslutsfattare och andra som påverkas av eller kan påverka arkitekturen.',
			relationships: ['concern', 'view'],
			examples: ['Slutanvändare', 'IT-avdelning', 'Säkerhetsansvariga', 'Ledning']
		},
		'decision': {
			title: 'Arkitekturbeslut',
			icon: Zap,
			description: 'Ett motiverat val mellan alternativa designlösningar.',
			details: 'Arkitekturbeslut dokumenterar viktiga designval, deras motivering och konsekvenser. De kopplar samman principer med konkreta implementationsval.',
			relationships: ['principle', 'rationale'],
			examples: ['Val av integrationsmönster', 'Autentiseringsmetod', 'Databasarkitektur']
		}
	};
	
	const principles = [
		{
			id: 'open-standards',
			title: 'Öppna standarder först',
			intention: 'Prioritera lösningar baserade på öppna standarder för att undvika leverantörslåsning.',
			when: 'Vid val mellan proprietära och öppna lösningar',
			example: 'Välj SAML över proprietära SSO-lösningar',
			category: 'Teknisk'
		},
		{
			id: 'privacy-by-design',
			title: 'Privacy by design',
			intention: 'Integrera integritetsskydd i alla system från grunden.',
			when: 'Vid design av alla system som hanterar persondata',
			example: 'Implementera dataminimering och kryptering som standard',
			category: 'Säkerhet'
		},
		{
			id: 'reuse-first',
			title: 'Återanvändning före utveckling',
			intention: 'Utvärdera befintliga lösningar innan ny utveckling påbörjas.',
			when: 'Vid alla nya systeminitiativ',
			example: 'Använd befintligt LMS istället för att utveckla nytt',
			category: 'Ekonomi'
		},
		{
			id: 'api-first',
			title: 'API-först',
			intention: 'Designa system med API:er som primärt gränssnitt för integration.',
			when: 'Vid utveckling av nya system och tjänster',
			example: 'Alla studentinformationssystem exponerar REST API:er',
			category: 'Integration'
		}
	];
	
	function openConceptModal(conceptKey: string) {
		selectedConcept = concepts[conceptKey];
		showConceptModal = true;
	}
	
	function openPrincipleModal(principle: any) {
		selectedPrinciple = principle;
		showPrincipleModal = true;
	}
	
	function closeModals() {
		showConceptModal = false;
		showPrincipleModal = false;
		selectedConcept = null;
		selectedPrinciple = null;
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
							onclick={() => openConceptModal('view')}
							class="absolute top-8 left-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={Eye} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Vy</div>
						</button>
						
						<button 
							onclick={() => openConceptModal('aspect')}
							class="absolute top-8 right-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={Shield} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Aspekt</div>
						</button>
						
						<button 
							onclick={() => openConceptModal('concern')}
							class="absolute bottom-8 left-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={Users} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Concern</div>
						</button>
						
						<button 
							onclick={() => openConceptModal('principle')}
							class="absolute bottom-8 right-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={FileText} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Princip</div>
						</button>
						
						<button 
							onclick={() => openConceptModal('stakeholder')}
							class="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={Users} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Intressent</div>
						</button>
						
						<button 
							onclick={() => openConceptModal('decision')}
							class="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-lg group hover:bg-[#0D3B4F] hover:text-white"
						>
							<svelte:component this={Zap} class="w-6 h-6 mx-auto mb-2" />
							<div class="text-sm font-medium">Beslut</div>
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
								onclick={() => openPrincipleModal(principle)}
								class="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#0D3B4F] hover:bg-blue-50 transition-all duration-200"
							>
								<div class="flex justify-between items-start mb-2">
									<h4 class="font-semibold text-gray-900 text-sm">{principle.title}</h4>
									<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{principle.category}</span>
								</div>
								<p class="text-gray-600 text-xs mb-2">{principle.intention.substring(0, 60)}...</p>
								<div class="flex items-center text-[#0D3B4F] text-xs">
									Läs mer <ArrowRight class="w-3 h-3 ml-1" />
								</div>
							</button>
						{/each}
					</div>
					
					<div class="mt-6 pt-6 border-t">
						<a href="/vagledning" class="text-sm text-[#0D3B4F] hover:underline flex items-center">
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
				{#each Object.entries(concepts) as [key, concept]}
					<button 
						onclick={() => openConceptModal(key)}
						class="p-4 border border-gray-200 rounded-lg hover:border-[#0D3B4F] hover:bg-blue-50 transition-colors text-center"
					>
						<svelte:component this={concept.icon} class="w-8 h-8 mx-auto mb-2 text-[#0D3B4F]" />
						<h4 class="text-sm font-semibold text-gray-900">{concept.title}</h4>
						<p class="text-xs text-gray-600 mt-1">{concept.description.substring(0, 40)}...</p>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Concept Modal -->
{#if showConceptModal && selectedConcept}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-xl max-w-2xl w-full p-8 max-h-96 overflow-y-auto">
			<div class="flex justify-between items-start mb-6">
				<div class="flex items-center">
					<svelte:component this={selectedConcept.icon} class="w-8 h-8 mr-3 text-[#0D3B4F]" />
					<h3 class="text-2xl font-bold text-gray-900">{selectedConcept.title}</h3>
				</div>
				<button onclick={closeModals} class="text-gray-400 hover:text-gray-600">
					<X class="w-6 h-6" />
				</button>
			</div>
			
			<div class="mb-4">
				<h4 class="font-semibold text-gray-900 mb-2">Definition</h4>
				<p class="text-gray-700">{selectedConcept.description}</p>
			</div>
			
			<div class="mb-4">
				<h4 class="font-semibold text-gray-900 mb-2">Fördjupning</h4>
				<p class="text-gray-700">{selectedConcept.details}</p>
			</div>
			
			<div class="mb-4">
				<h4 class="font-semibold text-gray-900 mb-2">Relationer</h4>
				<div class="flex flex-wrap gap-2">
					{#each selectedConcept.relationships as relation}
						<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
							{concepts[relation]?.title || relation}
						</span>
					{/each}
				</div>
			</div>
			
			<div class="mb-6">
				<h4 class="font-semibold text-gray-900 mb-2">Exempel</h4>
				<ul class="space-y-1">
					{#each selectedConcept.examples as example}
						<li class="text-gray-700 text-sm">• {example}</li>
					{/each}
				</ul>
			</div>
			
			<div class="flex space-x-3">
				<button onclick={closeModals} class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
					Stäng
				</button>
				<a href="/vagledning" class="px-4 py-2 bg-[#0D3B4F] text-white rounded-lg hover:bg-[#456882] transition-colors">
					Se i vägledningen
				</a>
			</div>
		</div>
	</div>
{/if}

<!-- Principle Modal -->
{#if showPrincipleModal && selectedPrinciple}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-xl max-w-lg w-full p-8">
			<div class="flex justify-between items-start mb-6">
				<h3 class="text-xl font-bold text-gray-900">{selectedPrinciple.title}</h3>
				<button onclick={closeModals} class="text-gray-400 hover:text-gray-600">
					<X class="w-6 h-6" />
				</button>
			</div>
			
			<div class="mb-4">
				<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{selectedPrinciple.category}</span>
			</div>
			
			<div class="mb-4">
				<h4 class="font-semibold text-gray-900 mb-2">Intention</h4>
				<p class="text-gray-700">{selectedPrinciple.intention}</p>
			</div>
			
			<div class="mb-4">
				<h4 class="font-semibold text-gray-900 mb-2">När ska den användas?</h4>
				<p class="text-gray-700">{selectedPrinciple.when}</p>
			</div>
			
			<div class="mb-6">
				<h4 class="font-semibold text-gray-900 mb-2">Exempel</h4>
				<p class="text-gray-700 italic">"{selectedPrinciple.example}"</p>
			</div>
			
			<div class="flex space-x-3">
				<button onclick={closeModals} class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
					Stäng
				</button>
				<button class="px-4 py-2 bg-[#0D3B4F] text-white rounded-lg hover:bg-[#456882] transition-colors">
					Använd principen
				</button>
			</div>
		</div>
	</div>
{/if}