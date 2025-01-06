<script lang="ts">
  import { enhance } from '$app/forms';
  import CityInput from './CityInput.svelte';
  import type { Location, NewLocationEntry } from '$lib/types/location';
  
  let currentLocation: Location | null = null;
  let hometown: Location | null = null;
  
  function handleCurrentLocationSelect(event: CustomEvent<Location>) {
    currentLocation = event.detail;
  }
  
  function handleHometownSelect(event: CustomEvent<Location>) {
    hometown = event.detail;
  }
  
  function isFormValid(): boolean {
    return !!currentLocation && !!hometown;
  }
</script>



<form
  method="POST"
  action="?/addLocation"
  class="max-w-2xl mx-auto p-6 bg-neutral-800 rounded-lg shadow border border-neutral-700"
  use:enhance
>
<div class="mb-6">
  <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-center md:text-left">Add Your Location</h1>
  <p class="text-xs text-neutral-400 text-center md:text-left">(US only, for now..)</p>
</div>

  <div class="space-y-4 mb-6">
    <CityInput
      label="Current Location"
      placeholder="Where do you currently live?"
      on:locationSelected={handleCurrentLocationSelect}
    />
    
    <CityInput
      label="Hometown"
      placeholder="Where are you originally from?"
      on:locationSelected={handleHometownSelect}
    />
  </div>
  
  <input type="hidden" name="currentLocation" value={JSON.stringify(currentLocation)} />
  <input type="hidden" name="hometown" value={JSON.stringify(hometown)} />
  
  <button
    type="submit"
    disabled={!isFormValid()}
    class="w-full flex justify-center py-2 px-4 border border-neutral-700 rounded-md shadow-sm text-sm font-medium text-white bg-neutral-700 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    Save Location Information
  </button>
</form>