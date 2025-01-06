<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Location } from '$lib/types/location';
  
  export let label: string;
  export let placeholder = 'Enter a city';
  export let value: string = '';
  
  const dispatch = createEventDispatcher<{
    locationSelected: Location;
  }>();
  
  let suggestions: Location[] = [];
  let showSuggestions = false;
  let inputElement: HTMLInputElement;
  
  async function searchCities(query: string) {
    if (query.length < 3) {
      suggestions = [];
      return;
    }
    
    try {
      const response = await fetch(`/api/geolocate?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      suggestions = data.predictions;
    } catch (error) {
      console.error('Failed to fetch city suggestions:', error);
      suggestions = [];
    }
  }
  
  async function getLocationWithCoords(location: Location): Promise<Location> {
    try {
      const response = await fetch(`/api/geolocate?query=${encodeURIComponent(location.city)}&coords=true`);
      const data = await response.json();
      const prediction = data.predictions[0];
      return prediction || location;
    } catch (error) {
      console.error('Failed to fetch coordinates:', error);
      return location;
    }
  }
  
  let searchTimeout: NodeJS.Timeout;
  
  function handleInput() {
    showSuggestions = true;
    // Debounce the search to avoid too many API calls
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchCities(value);
    }, 300);
  }
  
  async function selectLocation(location: Location) {
    value = `${location.city}, ${location.state}`;
    showSuggestions = false;
    
    // Get coordinates for the selected location
    const locationWithCoords = await getLocationWithCoords(location);
    dispatch('locationSelected', locationWithCoords);
  }
  
  function handleBlur() {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }
</script>

<div class="relative">
    <!--svelte-ignore a11y-label-has-associated-control-->
  <label class="block text-sm font-medium text-neutral-300 mb-1">
    {label}
  </label>
  
  <input
    bind:this={inputElement}
    type="text"
    {placeholder}
    bind:value
    on:input={handleInput}
    on:blur={handleBlur}
    class="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm text-white placeholder-neutral-400 focus:ring-blue-500 focus:border-blue-500"
  />
  
  {#if showSuggestions && suggestions.length > 0}
    <div class="absolute z-10 w-full mt-1 bg-neutral-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-neutral-700 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
      {#each suggestions as suggestion}
        <button
          type="button"
          class="w-full text-left px-4 py-2 text-neutral-200 hover:bg-neutral-700"
          on:click={() => selectLocation(suggestion)}
        >
          {suggestion.city}, {suggestion.state}
        </button>
      {/each}
    </div>
  {/if}
</div> 