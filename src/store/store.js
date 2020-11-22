import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const bRRound = 200;
const mIRound = 10000;

const store = new Vuex.Store({
  state: {
    loaded: false,
    selectedYear: 2014,
    selectedStates: [],
    burglaryRates: [],
    medianIncome: [],
    colorScale: [
      ['#c6c2cb', '#73a7cb', '#2d5f7e'],
      ['#bb5864', '#6c4c64', '#2b2b3e'],
      ['#a1212c', '#5e1c2c', '#25101b']
    ],
    highlightedState: '',
    highlightState: false
  },
  mutations: {
    changeSelectedYear (state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
    },
    setSelectedStates(state, vals) {
      state.selectedStates = vals;
    },
    setHighlightedState(state, val) {
      state.highlightedState = val;
      state.highlightState = true;
    },
    removeStateHighlight(state) {
      state.highlightState = false;
    }
  },
  getters: {
    loaded: (state) => state.loaded,
    selectedYear: (state) => state.selectedYear,
    selectedStates: (state) => state.selectedStates,
    burglaryRates (state) {
      let result = [];
      for (let i = 0; i < state.burglaryRates.length; i++) {
        if (state.selectedYear in state.burglaryRates[i]) {
          result.push({
            state: state.burglaryRates[i].State,
            value: +state.burglaryRates[i][state.selectedYear]
          })
        }
      }

      // console.log(`burgl range: [${}, ${d3.max(result.map((el) => el.value))}]`);
      return result;
    },
    medianIncome (state) {
      let result = [];
      for (let i = 0; i < state.medianIncome.length; i++) {
        if (state.selectedYear in state.medianIncome[i]) {
          result.push({
            state: state.medianIncome[i].State,
            value: state.medianIncome[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    combined (state) {
      let result = [];
      for (let i = 0; i < state.medianIncome.length; i++) {
        if (state.selectedYear in state.medianIncome[i]) {
          result.push({
            state: state.medianIncome[i].State,
            bR: state.burglaryRates[i][state.selectedYear],
            mI: state.medianIncome[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    burglaryRateRange(state, getters) {
      const data = getters.burglaryRates;

      let min = d3.min(data.map((el) => el.value));
      let max = d3.max(data.map((el) => el.value));

      // Round to outer 200
      min = Math.floor(min / bRRound) * bRRound;
      max = Math.ceil(max / bRRound) * bRRound;

      return [min, max];
    },
    medianIncomeRange(state, getters) {
      const data = getters.medianIncome;

      let min = d3.min(data.map((el) => el.value));
      let max = d3.max(data.map((el) => el.value));

      // Round to outer
      min = Math.floor(min / mIRound) * mIRound;
      max = Math.ceil(max / mIRound) * mIRound;

      return [min, max];
    },
    burglaryRateForState: (state) => (stateName) => {
      let el = state.burglaryRates.find((el) => el.State === stateName)
      if (el) {
        return el[state.selectedYear];
      } else {
        // console.log(`State not found: ${stateName}`);
        return 0;
      }
    },
    medianIncomeForState: (state) => (stateName) => {
      let el = state.medianIncome.find((el) => el.State === stateName);
      if (el) {
        // console.log(`median income for ${stateName}: ${el[state.selectedYear]}`)
        return el[state.selectedYear];
      } else {
        // console.log(`State not found: ${stateName}`);
        return 0;
      }
    },
    colorForState: (state, getters) => (stateName) => {
      const burglaryRate = getters.burglaryRateForState(stateName);
      const medianIncome = getters.medianIncomeForState(stateName);

      // Todo get contextual range
      const xScale = d3.scaleLinear().range([0,3]).domain(getters.burglaryRateRange);
      const yScale = d3.scaleLinear().range([0,3]).domain(getters.medianIncomeRange);
      // console.log(`${stateName}: ${burglaryRate}, ${medianIncome}`);
      // console.log(`${stateName}: ${xScale(burglaryRate)}, ${yScale(medianIncome)}`);
      const x = Math.floor(xScale(burglaryRate));
      const y = Math.floor(yScale(medianIncome));
      // console.log(`${stateName}: ${x}, ${y}`);
      return state.colorScale[x][y];
    },
    colorScale: (state) => state.colorScale,
    highlightState: (state) => state.highlightState,
    highlightedState: (state) => state.highlightedState
  },
  actions: {
    async loadData({state}) {

      // Wait for both datasets to be loaded
      await Promise.all([
        d3.csv('/usa_burglary_rates_1980-2014.csv').then((data) => { 
          state.burglaryRates = data;
        }),
        d3.csv('/usa_median_income_1984_2014.csv').then((data) => { 
          state.medianIncome = data;
        })
      ]);

      state.loaded = true;
    },
  }
})

export default store;
