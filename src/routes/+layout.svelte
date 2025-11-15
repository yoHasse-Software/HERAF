
<script lang="ts">

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { Home, BookOpen, Brain, GitBranch } from '@lucide/svelte';
	import { createSidebarContext } from '$lib/sidebar-state.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import { resolve } from '$app/paths';
	
	let { children } = $props();
	
	// Create sidebar context for the entire app
	const sidebar = createSidebarContext();
	
	const navItems = [
		{ path: '/', label: 'Start', icon: Home, description: 'Portalen' },
		{ path: '/vagledning', label: 'Vägledning', icon: BookOpen, description: 'Levande dokument' },
		{ path: '/heram', label: 'HERAM', icon: Brain, description: 'Interaktiv modell' },
		// { path: '/process', label: 'Processen', icon: GitBranch, description: 'Skapa referensarkitektur' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>HERAF - Higher Education Reference Architecture Framework</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header Navigation -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo/Brand -->
				<div class="flex items-center">
					<a href={resolve('/' as any)} class="text-2xl font-bold text-gray-900">
						<span class="text-[#352F44]">HERAF</span>
					</a>
				</div>
				
				<!-- Navigation -->
				<nav class="hidden md:flex space-x-8">
					{#each navItems as item}
					{@const IconComponent = item.icon}

						<a 
							href={resolve(item.path as any)}
							class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
								{page.url.pathname === item.path 
									? 'text-[#352F44] bg-[#352F44]/10' 
									: 'text-gray-600 hover:text-[#352F44] hover:bg-gray-100'}"
						>
							<IconComponent class="w-4 h-4 mr-2" />
							<div class="text-left">
								<div class="font-medium">{item.label}</div>
								<div class="text-xs text-gray-500">{item.description}</div>
							</div>
						</a>
					{/each}
				</nav>
				
				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>
	
	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
	
	<!-- Sidebar Component -->
	<Sidebar />
	
	<!-- Footer -->
	<footer class="bg-gray-900 text-white mt-16">
		<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<h3 class="text-lg font-semibold mb-4">HERAF</h3>
					<p class="text-gray-400">Higher Education Reference Architecture Framework</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">HERAM</h3>
					<p class="text-gray-400">Higher Education Reference Architecture Model</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">Kontakt</h3>
					<p class="text-gray-400">För högskolor och universitet</p>
				</div>
			</div>
		</div>
	</footer>
</div>
