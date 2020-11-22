<template>
  <div id="app">
    <h1>Comparing robbery rate and median income across US states</h1>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <YearSlider/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5">
          <BarChart/>
        </div>
        <div class="col-md-7">
          <ChoroplethMap/>
        </div>
        <div class="col-md-5">
          <scatterplot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from './components/BarChart.vue';
import ChoroplethMap from './components/ChoroplethMap.vue';
import Scatterplot from './components/Scatterplot.vue';
import YearSlider from './components/YearSlider.vue';

export default {
  name: 'App',
  components: {
    BarChart, ChoroplethMap, YearSlider,
    Scatterplot
  },
  mounted() {
    this.$store.dispatch('loadData');
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
