<script lang="ts">
	import { contentData } from '$lib/content-data.generated.js';

	// Get concepts data
	const concepts = contentData.concepts;
	
	// Group concepts by category if they have one
	const groupedConcepts = concepts.reduce((groups, concept) => {
		const category = concept.metadata.category || 'Allmänt';
		if (!groups[category]) {
			groups[category] = [];
		}
		groups[category].push(concept);
		return groups;
	}, {} as Record<string, typeof concepts>);
</script>

<svelte:head>
	<title>Begrepp - HERAM</title>
	<meta name="description" content="Begreppsmodell och definitioner för HERAM referensarkitekturer" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Begreppsmodell</h1>
		<p class="text-lg text-gray-600 max-w-3xl">
			Detta avsnitt innehåller alla begrepp och definitioner som används inom HERAM referensarkitekturer för att säkerställa gemensam förståelse och konsistent terminologi.
		</p>
	</header>

	<div class="space-y-8">
		{#each Object.entries(groupedConcepts) as [category, categoryConceptsArray]}
			<section class="space-y-4">
				<h2 class="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
					{category}
				</h2>
				<div class="grid gap-4">
					{#each categoryConceptsArray as concept}
						<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
							<div class="flex items-start justify-between mb-3">
								<h3 class="text-xl font-semibold text-gray-900">
									{concept.metadata.title || concept.slug}
								</h3>
								{#if concept.metadata.status === 'active'}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Aktiv
									</span>
								{/if}
							</div>
							<div class="text-gray-600">
								<div class="prose prose-sm max-w-none">
									{@html concept.htmlContent}
								</div>
								{#if concept.metadata.tags && concept.metadata.tags.length > 0}
									<div class="flex flex-wrap gap-1 mt-4">
										{#each concept.metadata.tags as tag}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
												{tag}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>