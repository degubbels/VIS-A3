<template>
  <div class="vis-component" ref="chart">
    <!-- <div class="placeholder">
      <b>Here comes the scatterplot</b>.
      <p>Burglary rates for the selected year: {{ burglaryRates }}</p>
    </div> -->
    <svg id="plot" class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Scatterplot',
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
  },
  methods: {
    draw() {
      d3.select('#plot').selectAll('*').remove();
      this.drawBackground();
      this.drawXAxis();
      this.drawYAxis();
      this.drawPlot();
    },
    drawBackground() {
      d3.select('#plot')
        .append('g').selectAll('rect')
        .data(this.colorScale).enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${(this.svgWidth / 3) * i}, 0)`)
        .selectAll('rect')
        .data((d) => d.slice().reverse()).enter()
        .append('rect')
        .attr('y', (d,i) => (this.svgHeight / 3) * i)
        .attr('width', this.svgWidth / 3)
        .attr('height', this.svgHeight / 3)
        .attr('fill', (d) => d)
        .attr('opacity', 0.8);
    },
    drawXAxis() {
      d3.select('#plot').append('g')
        .attr('transform', `translate( 0, ${this.svgHeight})`)
        .call(d3.axisBottom(this.xScale))
        .selectAll('text')
        .attr('y', 10)
        .attr('x', 0)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle');

      d3.select('#plot').append('text')
        .text("Burglary Rate (per 100.000 people)")
        .style("text-anchor", 'middle')
        .attr('x', this.svgWidth /2)
        .attr('y', this.svgHeight + 40)
    },
    drawYAxis() {
      d3.select('#plot').append('g')
        //.attr('transform', `translate( 0, ${this.svgHeight})`)
        .call(d3.axisLeft(this.yScale))
        .selectAll('text')
        .attr('y', 0)
        .attr('x', -10)
        .attr('dx', '.35em')
        .style('text-anchor', 'end');

        d3.select('#plot').append('text')
          .text("Median Household Income (in $)")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("x", -(this.svgHeight / 2))
          .attr("y", -50);
    },
    drawPlot() {
      d3.select('#plot')
        .append('g').selectAll('circle')
        .data(this.combined)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr("r", 6)
        .attr("cx", d => this.xScale(d.bR))
        .attr("cy", d => this.yScale(d.mI))
        .on('click', (d) => console.log(d));
        // .on('click', (d) => console.log(`${d.state}: mI=${d.mI}, bR=${d.bR}`));
    }
  },
  computed: {
    xScale: {
      get() {
        return d3.scaleLinear().range([0, this.svgWidth]).domain(this.burglaryRateRange);
      }
    },
    yScale: {
      get() {
        return d3.scaleLinear().range([this.svgHeight, 0]).domain(this.medianIncomeRange);  
      }
    },
    burglaryRateRange: {
      get() {
        return this.$store.getters.burglaryRateRange;
      }
    },
    medianIncomeRange: {
      get() {
        return this.$store.getters.medianIncomeRange;
      }
    },
    combined: {
      get() {
        return this.$store.getters.combined;
      }
    },
    colorScale: {
      get() {
        return this.$store.getters.colorScale;
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      }
    },
    loaded: {
      get() {
        return this.$store.getters.loaded;
      }
    }
  },
  watch: {
    loaded: function() {
      this.draw();
    },
    selectedYear: function() {
      this.draw();
    }
  },
}
</script>
<style>
#plot {
  overflow: visible;
  margin: 80px;
}

.dot {
  fill: none;
  stroke: black;
  stroke-width: 2;
}
</style>
