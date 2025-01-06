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
    <div>
      <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">View the map</h2>
      <p class="text-lg bg-gradient-to-r ml-2 from-blue-500 to-purple-600 text-transparent bg-clip-text flex items-center">
        Make this better: 

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a 
          href="https://github.com/spencerby28/Gauntlet-Student-Map" 
          aria-label="View source code on GitHub"
          class="inline-flex items-center hover:opacity-80 text-blue-500 hover:text-purple-600 ml-1"
        >
          
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="inline mr-4">
            <path d="M4.0744 2.9938C4.13263 1.96371 4.37869 1.51577 5.08432 1.15606C5.84357 0.768899 7.04106 0.949072 8.45014 1.66261C9.05706 1.97009 9.11886 1.97635 10.1825 1.83998C11.5963 1.65865 13.4164 1.65929 14.7213 1.84164C15.7081 1.97954 15.7729 1.97265 16.3813 1.66453C18.3814 0.651679 19.9605 0.71795 20.5323 1.8387C20.8177 2.39812 20.8707 3.84971 20.6494 5.04695C20.5267 5.71069 20.5397 5.79356 20.8353 6.22912C22.915 9.29385 21.4165 14.2616 17.8528 16.1155C17.5801 16.2574 17.3503 16.3452 17.163 16.4167C16.5879 16.6363 16.4133 16.703 16.6247 17.7138C16.7265 18.2 16.8491 19.4088 16.8973 20.4002C16.9844 22.1922 16.9831 22.2047 16.6688 22.5703C16.241 23.0676 15.6244 23.076 15.2066 22.5902C14.9341 22.2734 14.9075 22.1238 14.9075 20.9015C14.9075 19.0952 14.7095 17.8946 14.2417 16.8658C13.6854 15.6415 14.0978 15.185 15.37 14.9114C17.1383 14.531 18.5194 13.4397 19.2892 11.8146C20.0211 10.2698 20.1314 8.13501 18.8082 6.83668C18.4319 6.3895 18.4057 5.98446 18.6744 4.76309C18.7748 4.3066 18.859 3.71768 18.8615 3.45425C18.8653 3.03823 18.8274 2.97541 18.5719 2.97541C18.4102 2.97541 17.7924 3.21062 17.1992 3.49805L16.2524 3.95695C16.1663 3.99866 16.07 4.0147 15.975 4.0038C13.5675 3.72746 11.2799 3.72319 8.86062 4.00488C8.76526 4.01598 8.66853 3.99994 8.58215 3.95802L7.63585 3.49882C7.04259 3.21087 6.42482 2.97541 6.26317 2.97541C5.88941 2.97541 5.88379 3.25135 6.22447 4.89078C6.43258 5.89203 6.57262 6.11513 5.97101 6.91572C5.06925 8.11576 4.844 9.60592 5.32757 11.1716C5.93704 13.1446 7.4295 14.4775 9.52773 14.9222C10.7926 15.1903 11.1232 15.5401 10.6402 16.9905C10.26 18.1319 10.0196 18.4261 9.46707 18.4261C8.72365 18.4261 8.25796 17.7821 8.51424 17.1082C8.62712 16.8112 8.59354 16.7795 7.89711 16.5255C5.77117 15.7504 4.14514 14.0131 3.40172 11.7223C2.82711 9.95184 3.07994 7.64739 4.00175 6.25453C4.31561 5.78028 4.32047 5.74006 4.174 4.83217C4.09113 4.31822 4.04631 3.49103 4.0744 2.9938Z" fill="currentColor"/>
            <path d="M3.33203 15.9454C3.02568 15.4859 2.40481 15.3617 1.94528 15.6681C1.48576 15.9744 1.36158 16.5953 1.66793 17.0548C1.8941 17.3941 2.16467 17.6728 2.39444 17.9025C2.4368 17.9449 2.47796 17.9858 2.51815 18.0257C2.71062 18.2169 2.88056 18.3857 3.05124 18.5861C3.42875 19.0292 3.80536 19.626 4.0194 20.6962C4.11474 21.1729 4.45739 21.4297 4.64725 21.5419C4.85315 21.6635 5.07812 21.7352 5.26325 21.7819C5.64196 21.8774 6.10169 21.927 6.53799 21.9559C7.01695 21.9877 7.53592 21.998 7.99999 22.0008C8.00033 22.5527 8.44791 23.0001 8.99998 23.0001C9.55227 23.0001 9.99998 22.5524 9.99998 22.0001V21.0001C9.99998 20.4478 9.55227 20.0001 8.99998 20.0001C8.90571 20.0001 8.80372 20.0004 8.69569 20.0008C8.10883 20.0026 7.34388 20.0049 6.67018 19.9603C6.34531 19.9388 6.07825 19.9083 5.88241 19.871C5.58083 18.6871 5.09362 17.8994 4.57373 17.2891C4.34391 17.0194 4.10593 16.7834 3.91236 16.5914C3.87612 16.5555 3.84144 16.5211 3.80865 16.4883C3.5853 16.265 3.4392 16.1062 3.33203 15.9454Z" fill="currentColor"/>
          </svg>
        </a>
      </p>
    </div>

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