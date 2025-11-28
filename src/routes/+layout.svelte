
<script lang="ts">

	import '../app.css';
	import favicon from '$lib/assets/favicon.webp';
	import { page } from '$app/state';
	import { Home, BookOpen, Brain } from '@lucide/svelte';
	import { createSidebarContext } from '$lib/sidebar-state.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	
	let { children } = $props();
	
	// Create sidebar context for the entire app
	const sidebar = createSidebarContext();
	
	// Mobile menu state
	let isMobileMenuOpen = $state(false);
	
	const navItems = [
		{ path: '/', label: 'Start', icon: Home, description: 'Portalen' },
		{ path: '/vagledning', label: 'Vägledning', icon: BookOpen, description: 'Levande dokument' },
		{ path: '/heram', label: 'HERAM', icon: Brain, description: 'Interaktiv modell' },
	];
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
	
	// Close mobile menu on Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isMobileMenuOpen) {
			closeMobileMenu();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

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
				<div class="flex items-center space-x-4">
					<a href="/" class="text-2xl font-bold text-gray-900">
						<span class="text-[#352F44]">HERAF</span>
					</a>
					<div class="hidden sm:block h-8 w-px bg-gray-300"></div>
					<img 
						src="/img/itcf-logga.png" 
						alt="ITCF Logotyp" 
						class="h-8 w-auto max-w-none object-contain"
						style="max-height: 32px;"
					/>
				</div>
				
				<!-- Navigation -->
				<nav class="hidden md:flex space-x-8">
					{#each navItems as item (item.path)}
					{@const IconComponent = item.icon}

						<a 
							href={item.path}
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
					<button 
						class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
						aria-label="Öppna navigation"
						title="Öppna navigation"
						onclick={toggleMobileMenu}
					>
						{#if isMobileMenuOpen}
							<!-- X icon when menu is open -->
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<!-- Hamburger icon when menu is closed -->
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</header>
	
	<!-- Mobile Navigation Menu -->
	{#if isMobileMenuOpen}
		<!-- Mobile menu overlay -->
		<div class="fixed inset-0  bg-opacity-50 z-40 md:hidden" 
			onclick={closeMobileMenu}
			onkeydown={(e) => e.key === 'Enter' && closeMobileMenu()}
			role="button" 
			tabindex="-1"
			aria-label="Stäng navigation">
		</div>
		
		<!-- Mobile menu panel -->
		<div class="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 md:hidden">
			<nav class="px-4 py-2">
				{#each navItems as item (item.path)}
					{@const IconComponent = item.icon}
					<a 
						href={item.path}
						class="flex items-center px-3 py-4 rounded-md text-sm font-medium transition-colors duration-200 border-b border-gray-100 last:border-b-0
							{page.url.pathname === item.path 
								? 'text-[#352F44] bg-[#352F44]/10' 
								: 'text-gray-600 hover:text-[#352F44] hover:bg-gray-100'}"
						onclick={closeMobileMenu}
					>
						<IconComponent class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">{item.label}</div>
							<div class="text-xs text-gray-500">{item.description}</div>
						</div>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
	
	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
	
	<!-- Sidebar Component -->
	<Sidebar />
	
	<!-- Footer -->
	<footer class="bg-gray-900 text-white mt-16">
		<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<!-- Development Notice in Footer -->
			<div class="border border-amber-600 bg-amber-900/20 rounded-lg p-4 mb-8">
				<div class="flex items-center">
					<svg class="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
					</svg>
					<div>
						<h4 class="text-sm font-medium text-amber-200">Beta-version</h4>
						<p class="text-sm text-gray-300 mt-1">HERAF befinner sig för närvarande i utvecklingsfas. Allt innehåll ska betraktas som preliminärt och kan komma att förändras.</p>
					</div>
				</div>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h3 class="text-lg font-semibold mb-4">HERAF</h3>
					<p class="text-gray-400">Higher Education Reference Architecture Framework</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">HERAM</h3>
					<p class="text-gray-400">Higher Education Reference Architecture Model</p>
				</div>
			</div>
		</div>
	</footer>
</div>
