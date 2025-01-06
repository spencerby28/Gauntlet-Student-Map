<script lang="ts">
  import { geoAlbersUsa } from 'd3-geo';
  import { feature } from 'topojson-client';
  import { Chart, GeoPath, Svg, GeoPoint, Tooltip } from 'layerchart';
  import type { LocationEntry, Location } from '$lib/types/location';
  import type { Topology, GeometryCollection } from 'topojson-specification';
  import type {FeatureCollection } from 'geojson';

  export let geojson: Topology;
  export let locations: LocationEntry[] = [];
  export let locationType: 'current' | 'hometown' | 'hometownOnly' = 'current';

  const STATE_CODES: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };

  const states = feature(geojson, geojson.objects.states) as FeatureCollection;
  const AUSTIN: [number, number] = [-97.7431, 30.2672];

  $: selectedLocation = (loc: LocationEntry): Location => 
    locationType === 'current' ? loc.currentLocation : loc.hometown;

  $: links = locations.map(loc => {
    const location = selectedLocation(loc);
    return {
      source: location.coordinates,
      target: locationType === 'current' ? AUSTIN : 
             locationType === 'hometownOnly' ? AUSTIN :
             loc.currentLocation.coordinates,
      state: location.state,
      currentLocation: locationType === 'hometown' ? loc.currentLocation : null
    };
  });

  $: stateCounts = states.features.reduce((acc, feature) => {
    const stateName = feature.properties?.name;
    if (!stateName) return acc;
    
    // Count locations based on the selected mode
    const count = locations.filter(loc => {
      if (locationType === 'hometown') {
        // For hometown path, count both hometown and current locations
        return STATE_CODES[loc.hometown.state] === stateName || STATE_CODES[loc.currentLocation.state] === stateName;
      } else {
        // For other modes, only count the selected location type
        return STATE_CODES[selectedLocation(loc).state] === stateName;
      }
    }).length;
    
    acc[stateName] = count;
    return acc;
  }, {} as Record<string, number>);

  $: linkGeojson = links.map(link => {
    if (locationType === 'current' || locationType === 'hometownOnly' || !link.currentLocation) {
      return {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [link.source, link.target]
        },
        properties: {}
      };
    } else {
      return {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            link.source,
            link.target,
            AUSTIN
          ]
        },
        properties: {}
      };
    }
  });
</script>

<div class="h-[600px]">
  <Chart
    geo={{
      projection: geoAlbersUsa,
      fitGeojson: states,
    }}
    let:tooltip
  >
    <Svg>
      <defs>
        <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ff6b6b" />
          <stop offset="100%" stop-color="#4834d4" />
        </linearGradient>
      </defs>

      <g class="states">
        {#each states.features as feature}
          <GeoPath
            geojson={feature}
            class="fill-neutral-800 stroke-neutral-700 hover:fill-neutral-700"
            {tooltip}
          />
        {/each}
      </g>
      
      {#each linkGeojson as path (locationType + path.geometry.coordinates.join(','))}
        <GeoPath 
          geojson={path}
          class="stroke-[url(#lineGradient)] stroke-[3px] fill-none"
        />
      {/each}

      {#each links as link (locationType + link.source.join(','))}
        <GeoPoint
          lat={link.source[1]}
          long={link.source[0]}
          r={6}
          class="fill-[url(#lineGradient)]"
        />
      {/each}
      
      <GeoPoint
        lat={AUSTIN[1]}
        long={AUSTIN[0]}
        r={12}
        class="fill-blue-500"
      >
        <image
          href="/images/guantlet.png"
          width="20"
          height="20"
          x="-10"
          y="-10"
        />
      </GeoPoint>
    </Svg>

    <Tooltip.Root let:data classes={{ root: "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg py-2 px-3 pointer-events-none absolute" }}>
      <Tooltip.Header>{data.properties.name}</Tooltip.Header>
      <Tooltip.Separator classes={{ root: "bg-white/20" }} />
      <Tooltip.List>
        <Tooltip.Item
          label="Count:"
          value={stateCounts[data.properties.name] || 0}
          format="integer"
          valueAlign="right"
          classes={{ 
            root: "flex justify-between items-center gap-4",
            label: "text-white/80",
            value: "font-medium"
          }}
        />
      </Tooltip.List>
    </Tooltip.Root>
  </Chart>
</div> 