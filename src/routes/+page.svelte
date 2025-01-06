<script lang="ts">
  import LocationForm from '$lib/components/LocationForm.svelte';
  import USMap from '$lib/components/USMap.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let locationType: 'current' | 'hometown' | 'hometownOnly' = 'current';

  let countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const targetDate = new Date('2025-02-03T00:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    countdown.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call
</script>

<div class="container mx-auto px-4 py-4 sm:py-8 min-h-screen">

  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
    <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">View the map</h2>

    <div class="inline-flex w-full sm:w-auto rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg justify-center">
      <button
        class="flex-1 sm:flex-initial px-4 py-2 rounded-l-lg transition-colors {locationType === 'current' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-700'}"
        on:click={() => locationType = 'current'}
      >
        Current Location
      </button>
      <button
        class="flex-1 sm:flex-initial px-4 py-2 transition-colors {locationType === 'hometown' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-700'}"
        on:click={() => locationType = 'hometown'}
      >
        Hometown Path
      </button>
      <button
        class="flex-1 sm:flex-initial px-4 py-2 rounded-r-lg transition-colors {locationType === 'hometownOnly' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-700'}"
        on:click={() => locationType = 'hometownOnly'}
      >
        Hometown Direct
      </button>
    </div>
  </div>

  <USMap 
    geojson={data.geojson} 
    locations={data.locations}
    bind:locationType
  />
  {#if data.user}
  {#if !data.hasSubmitted}
    <div class="my-8">
      
      <LocationForm />
    </div>
  {/if}
{:else}
  <div class=" text-center md:mt-12">
    <form action="?/oauth" method="post" class="text-center md:mt-12">
      <button 
        type="submit"
        class="inline-flex items-center px-6 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition-colors"
      >
        <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        Login with Discord
      </button>
    </form>
  </div>
{/if}

  <div class="flex flex-col items-center justify-center h-[25vh]">
    <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-2">COUNTDOWN TO ATX</h3>
    <h2 class="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
      {countdown.days.toString().padStart(2, '0')} : {countdown.hours.toString().padStart(2, '0')} : {countdown.minutes.toString().padStart(2, '0')} : {countdown.seconds.toString().padStart(2, '0')}
    </h2>
  </div>
</div>