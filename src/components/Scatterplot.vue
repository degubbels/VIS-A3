<template>
  <div class="vis-component" ref="chart" id="scatterplot-component">
    <!-- <div class="placeholder">
      <b>Here comes the scatterplot</b>.
      <p>Burglary rates for the selected year: {{ burglaryRates }}</p>
    </div> -->
    <svg id="plot" class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg>
    <div class="scatterTooltip" v-show="showScatterTooltip" ref="scatterTooltip">
      {{scatterTooltipMsg}}
    </div>
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
      scatterTooltipMsg: '',
      showScatterTooltip: false
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
        .attr('id', (d) => `circle-${d.state.replace(' ', '_')}`)
        .attr('class', 'circle')
        .attr("r", 6)
        .attr("cx", d => this.xScale(d.bR))
        .attr("cy", d => this.yScale(d.mI))
        .on('mouseover', (d) => {

          this.scatterTooltipMsg = d.state;
          this.showScatterTooltip = true;
          const pos = d3.mouse(d3.select('#scatterplot-component').node());
          this.$refs['scatterTooltip'].style.left = `${pos[0] + 20}px`;
          this.$refs['scatterTooltip'].style.top = `${pos[1] - 25}px`;
        })
        .on('mouseout', () => {
          this.showScatterTooltip = false;
        });
    },
    highlightCircle(state) {
      d3.select(`#circle-${state.replace(' ', '_')}`)
        .classed('circle-highlight', true)
        .raise();
    },
    removeCircleHighlight(state) {
      d3.select(`#circle-${state.replace(' ', '_')}`)
        .classed('circle-highlight', false);
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
    },
    highlightState: {
      get() {
        return this.$store.getters.highlightState;
      }
    },
    highlightedState: {
      get() {
        return this.$store.getters.highlightedState;
      }
    },
  },
  watch: {
    loaded: function() {
      this.draw();
    },
    selectedYear: function() {
      this.draw();

      if (this.highlightState) {
        this.highlightCircle(this.highlightedState);
      }
    },
    highlightedState: function(newVal, oldVal) {

      if (oldVal) {
        this.removeCircleHighlight(oldVal)
      }
      this.highlightCircle(newVal);
    },
    highlightState: function(newVal) {
      if (newVal === false) {
        this.removeCircleHighlight(this.highlightedState);
      } else {
        this.highlightCircle(this.highlightedState);
      }
    }
  },
}
</script>
<style>
#plot {
  overflow: visible;
  margin: 80px;
}

.circle {
  fill: transparent;
  stroke: black;
  stroke-width: 2;
}

@keyframes blink {
  /* 0%   { stroke-width: 2%; } */
  50%  { stroke-width: 6px; }
  /* 100% { stroke-width: 100%; } */
}

.circle-highlight {
  fill: yellow;
  opacity: 0.8;

  animation: blink 0.6s;
}

.scatterTooltip {
  display: inline-block;
  position: absolute;
  z-index: 100;

  background-color: rgba(255,255,255,0.7);
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
