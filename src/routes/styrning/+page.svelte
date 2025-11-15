<script lang="ts">
	import { contentData } from '$lib/content-data.generated.js';
	import { onMount } from 'svelte';

	let activeTab = 'principles';

	// Get governance data
	const governance = contentData.governance;
</script>

<svelte:head>
	<title>Styrning - HERAM</title>
	<meta name="description" content="Principer, regler och riktlinjer för HERAM referensarkitekturer" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Styrning</h1>
		<p class="text-lg text-gray-600 max-w-3xl">
			Detta avsnitt innehåller alla principer, regler och riktlinjer som styr hur HERAM referensarkitekturer ska skapas och användas.
		</p>
	</header>

	<!-- Tab Navigation -->
	<div class="border-b border-gray-200 mb-8">
		<nav class="-mb-px flex space-x-8">
			<button
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'principles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'principles'}
			>
				Principer ({governance.principles.length})
			</button>
			<button
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'rules' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'rules'}
			>
				Regler ({governance.rules.length})
			</button>
			<button
				class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'guidelines' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'guidelines'}
			>
				Riktlinjer ({governance.guidelines.length})
			</button>
		</nav>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'principles'}
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">Principer</h2>
			<p class="text-gray-600 mb-6">
				Principer är övergripande, normerande vägledare som uttrycker strategiska intentioner och långsiktiga mål.
			</p>
			<div class="grid gap-6">
				{#each governance.principles as principle}
					<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
						<div class="flex items-start justify-between mb-3">
							<h3 class="text-lg font-semibold text-gray-900">
								{principle.metadata.id}: {principle.metadata.principle}
							</h3>
							<div class="flex gap-2">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{principle.metadata.category || 'Allmän'}
								</span>
								{#if principle.metadata.status === 'active'}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Aktiv
									</span>
								{/if}
							</div>
						</div>
						<div class="text-gray-600 space-y-3">
							<div class="prose prose-sm max-w-none">
								{@html principle.htmlContent}
							</div>
							{#if principle.metadata.tags && principle.metadata.tags.length > 0}
								<div class="flex flex-wrap gap-1 pt-2">
									{#each principle.metadata.tags as tag}
										<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if activeTab === 'rules'}
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">Regler</h2>
			<p class="text-gray-600 mb-6">
				Regler är tvingande riktlinjer som definierar vad som måste följas för att säkerställa att verksamheten agerar i enlighet med styrande principer och lagkrav.
			</p>
			<div class="grid gap-6">
				{#each governance.rules as rule}
					<div class="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
						<div class="flex items-start justify-between mb-3">
							<h3 class="text-lg font-semibold text-gray-900">
								{rule.metadata.id}: {rule.metadata.rule}
							</h3>
							<div class="flex gap-2">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
									{rule.metadata.category || 'Allmän'}
								</span>
								{#if rule.metadata.status === 'active'}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Aktiv
									</span>
								{/if}
							</div>
						</div>
						<div class="text-gray-600 space-y-3">
							<div class="prose prose-sm max-w-none">
								{@html rule.htmlContent}
							</div>
							{#if rule.metadata.tags && rule.metadata.tags.length > 0}
								<div class="flex flex-wrap gap-1 pt-2">
									{#each rule.metadata.tags as tag}
										<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if activeTab === 'guidelines'}
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">Riktlinjer</h2>
			<p class="text-gray-600 mb-6">
				Riktlinjer är konkretiseringar av principer som beskriver hur principer bör tillämpas i praktiken.
			</p>
			<div class="grid gap-6">
				{#each governance.guidelines as guideline}
					<div class="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
						<div class="flex items-start justify-between mb-3">
							<h3 class="text-lg font-semibold text-gray-900">
								{guideline.metadata.id}: {guideline.metadata.guideline}
							</h3>
							<div class="flex gap-2">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
									{guideline.metadata.category || 'Allmän'}
								</span>
								{#if guideline.metadata.status === 'active'}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Aktiv
									</span>
								{/if}
							</div>
						</div>
						<div class="text-gray-600 space-y-3">
							<div class="prose prose-sm max-w-none">
								{@html guideline.htmlContent}
							</div>
							{#if guideline.metadata.tags && guideline.metadata.tags.length > 0}
								<div class="flex flex-wrap gap-1 pt-2">
									{#each guideline.metadata.tags as tag}
										<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>