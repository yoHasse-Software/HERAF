<script lang="ts">
	import { BookOpen, Brain, GitBranch, ArrowRight, Shield, FileText } from '@lucide/svelte';
	import { resolve, asset } from '$app/paths';
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	<!-- Hero Section -->
	<div class="text-center mb-16">
		<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
			<span class="text-gray-900">HERAF</span>
		</h1>
		<h2 class="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
			Higher Education Reference Architecture Framework
		</h2>

	</div>

	<!-- What is HERAF Section -->
	<div class="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
		<h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Vad är HERAF?</h3>
		<div>
					<p class="text-gray-700">
						Ramverket innehåller material som beskriver, visualiserar och vägleder i hur man skapar en referensarkitektur. På en övergripande nivå innehåller ramverket två huvudsakliga områden, vägledningen och HERAM.
Varje område innehåller även komponenter som hjälper under framtagningen. Följande konceptuella modell (figur c) visar relationerna mellan komponenterna i respektive område.
					</p>
		</div>
		
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div class="space-y-6">
				<div class="border-l-4 border-[#352F44] pl-6">
					<h4 class="text-xl font-semibold text-[#352F44] mb-3">Vägledningen</h4>
					<p class="text-gray-700">
						Vägledningen är det material som vägleder och hjälper användningen av ramverket samt skapandet av en referensarkitektur.
					</p>
				</div>
				
				<div class="border-l-4 border-[#0D3B4F] pl-6">
					<h4 class="text-xl font-semibold text-[#0D3B4F] mb-3">HERAM</h4>
					<p class="text-gray-700">
						HERAM utgör den teoretiska och strukturella grunden för hur referensarkitekturer i ramverket ska struktureras och beskrivas. 

					</p>
				</div>
			</div>
			
			<!-- Simple Framework Diagram -->
			<div class="bg-gray-50 p-8 rounded-lg">
				<div class="text-center">
					<div class="bg-white text-gray-900 border border-gray-300 py-6 px-6 rounded-lg">
						<div class="mb-4">
							<h5 class="font-semibold text-lg">HERAF</h5>
							<p class="text-sm text-gray-600">Ramverket</p>
						</div>
						<div class="text-gray-400 text-sm mb-4">innehåller</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
							<a href={resolve('/vagledning')} class="hover:underline">
								<img src={asset('/img/guidance_logo_w_text.png')} alt="Vägledningen" class="w-full max-w-48 mx-auto" />
							</a>
							<a href={resolve('/heram')} class="hover:underline">
								<img src={asset('/img/heram_logo_w_text.png')} alt="HERAM" class="w-full max-w-48 mx-auto" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Navigation Cards -->
	<div class="grid md:grid-cols-2 gap-8 mb-16">
		<!-- Vägledningen -->
		<a href={resolve('/vagledning')} class="group">
			<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#352F44] h-full">
				<div class="flex items-center justify-between mb-6">
					<div class="bg-[#352F44] p-3 rounded-lg">
						<BookOpen class="w-8 h-8 text-white" />
					</div>
					<ArrowRight class="w-6 h-6 text-gray-400 group-hover:text-[#352F44] transition-colors" />
				</div>
				<h3 class="text-2xl font-bold text-[#352F44] mb-4">Vägledningen</h3>
				<p class="text-gray-700 mb-4">
					Det levande dokumentet med interaktiv text, klickbara begrepp och integrerade processsteg.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li>• Navigationsmeny och ankarlänkar</li>
					<li>• Expanderbara avsnitt</li>
					<li>• Interaktiva definitioner</li>
					<li>• Processgrafik integrerad</li>
				</ul>
			</div>
		</a>

		<!-- HERAM -->
		<a href={resolve('/heram')} class="group">
			<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#0D3B4F] h-full">
				<div class="flex items-center justify-between mb-6">
					<div class="bg-[#0D3B4F] p-3 rounded-lg">
						<Brain class="w-8 h-8 text-white" />
					</div>
					<ArrowRight class="w-6 h-6 text-gray-400 group-hover:text-[#0D3B4F] transition-colors" />
				</div>
				<h3 class="text-2xl font-bold text-[#0D3B4F] mb-4">HERAM</h3>
				<p class="text-gray-700 mb-4">
					Den interaktiva modellen med klickbara konceptkartor och principer.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li>• Interaktiv konceptkarta</li>
					<li>• Klickbara relationer</li>
					<li>• Principer och riktlinjer</li>
					<li>• Visuell förståelse</li>
				</ul>
			</div>
		</a>
	</div>

	<!-- Governance and Concepts Section -->
	<div class="grid md:grid-cols-2 gap-8 mb-16">
		<!-- Styrning -->
		<a href={resolve('/styrning')} class="group">
			<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-500 h-full">
				<div class="flex items-center justify-between mb-6">
					<div class="bg-red-500 p-3 rounded-lg">
						<Shield class="w-8 h-8 text-white" />
					</div>
					<ArrowRight class="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
				</div>
				<h3 class="text-2xl font-bold text-red-500 mb-4">Styrning</h3>
				<p class="text-gray-700 mb-4">
					Principer, regler och riktlinjer som styr skapandet av referensarkitekturer.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li>• Övergripande principer</li>
					<li>• Tvingande regler</li>
					<li>• Vägledande riktlinjer</li>
					<li>• Spårbar struktur</li>
				</ul>
			</div>
		</a>

		<!-- Begrepp -->
		<a href={resolve('/begrepp')} class="group">
			<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500 h-full">
				<div class="flex items-center justify-between mb-6">
					<div class="bg-blue-500 p-3 rounded-lg">
						<FileText class="w-8 h-8 text-white" />
					</div>
					<ArrowRight class="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
				</div>
				<h3 class="text-2xl font-bold text-blue-500 mb-4">Begreppsmodell</h3>
				<p class="text-gray-700 mb-4">
					Definitioner och begrepp som används inom HERAM för gemensam förståelse.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li>• Strukturerade definitioner</li>
					<li>• Kategoriserade begrepp</li>
					<li>• Gemensam terminologi</li>
					<li>• Konsistent förståelse</li>
				</ul>
			</div>
		</a>
	</div>
</div>
