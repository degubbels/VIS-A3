<template>
  <div class="vis-component" ref="chart">
    <!-- <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div> -->
    <svg id="map" class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg>
  </div>
</template>

<script>

import mapStatesUSA from '@/assets/us-states-geo.json';
import * as d3 from 'd3';

export default {
  name: 'ChoroplethMap',
  props: {
  },
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
    //
    this.drawMap();
  },
  methods: {
    drawMap() {
      const projection = d3.geoAlbersUsa().fitSize([this.svgWidth, this.svgHeight], mapStatesUSA);
      let path = d3.geoPath().projection(projection);

      //const el = d3.select('#map');
      d3.select('#map').selectAll('.path')
        .data(mapStatesUSA.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', (state) => this.$store.getters.colorForState(state.properties.name));
    }
  },
  computed: {
    burglaryRates: {
      get() {
        return this.$store.getters.burglaryRates;
      }
    },
    medianIncome: {
      get() {
        return this.$store.getters.medianIncome;
      }
    },
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      }
    }
  },
  watch: {
    selectedYear: function() {
      this.drawMap();
    }
  },
}
</script>

<style>
</style>
