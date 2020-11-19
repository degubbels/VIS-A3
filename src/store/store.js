import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2014,
    selectedStates: [],
    burglaryRates: [],
    medianIncome: [],
    colorScale: [
      ['#c6c2cb', '#73a7cb', '#2d5f7e'],
      ['#bb5864', '#6c4c64', '#2b2b3e'],
      ['#a1212c', '#5e1c2c', '#25101b']
    ]
  },
  mutations: {
    changeSelectedYear (state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
    }   
  },
  getters: {
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
    burglaryRateForState: (state) => (stateName) => {
      let el = state.burglaryRates.find((el) => el.State === stateName)
      if (el) {
        return el[state.selectedYear];
      } else {
        //console.log(`State not found: ${stateName}`);
        return 0;
      }
    },
    medianIncomeForState: (state) => (stateName) => {
      let el = state.medianIncome.find((el) => el.State === stateName);
      if (el) {
        console.log(`median income for ${stateName}: ${el[state.selectedYear]}`)
        return el[state.selectedYear];
      } else {
        //console.log(`State not found: ${stateName}`);
      return 0;
    }
    },
    colorForState: (state, getters) => (stateName) => {
      const burglaryRate = getters.burglaryRateForState(stateName);
      const medianIncome = getters.medianIncomeForState(stateName);
      //console.log(stateName + burglaryRate + medianIncome);

      const xScale = d3.scaleLinear().range([0,2]).domain([0,2000]);
      const yScale = d3.scaleLinear().range([0,2]).domain([0,80000]);


      const x = Math.round(xScale(burglaryRate));
      const y = Math.round(yScale(medianIncome));
      console.log(`${stateName}: ${x}, ${y}`);
      return state.colorScale[x][y];
    }
  },
  actions: {
    loadData({state}) {
      d3.csv('/usa_burglary_rates_1980-2014.csv').then((data) => { 
        state.burglaryRates = data;
      })

      d3.csv('/usa_median_income_1984_2014.csv').then((data) => { 
        state.medianIncome = data;
      })
    },
  }
})

export default store;
