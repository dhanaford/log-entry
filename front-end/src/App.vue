<template>
  <div id="app">
    <div class="md-layout md-gutter md-alignment-center">
      <div class="md-layout-item md-medium-size-95">
        <md-card>
          <md-card-header>
            <span class="md-display-2">{{ today }}</span>
          </md-card-header>
          <md-card-content>
            {{ foreCast }}
          </md-card-content>
        </md-card>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="year">Year</label>
              <md-select @md-selected="getMonth($event)" v-model="year">
                <md-option value="2022">2023</md-option>
                <md-option value="2022">2022</md-option>
                <md-option value="2021">2021</md-option>
                <md-option value="2020">2020</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label for="month">Month</label>
              <md-select @md-selected="getMonth($event)" v-model="month">
                <md-option value="01">January</md-option>
                <md-option value="02">February</md-option>
                <md-option value="03">March</md-option>
                <md-option value="04">April</md-option>
                <md-option value="05">May</md-option>
                <md-option value="06">June</md-option>
                <md-option value="07">July</md-option>
                <md-option value="08">August</md-option>
                <md-option value="09">September</md-option>
                <md-option value="10">October</md-option>
                <md-option value="11">November</md-option>
                <md-option value="12">December</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <md-field>
          <label>Search for anything</label>
          <md-input @input="getMonth" v-model="searchString" placeholder="Search Log"></md-input>
        </md-field>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
          </div>
        </div>
      </div>
    </div>

    <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>

    <div class="md-layout md-gutter md-alignment-center">
      <div class="md-layout-item md-medium-size-95">
        <md-table v-model="calendarData" md-card @md-selected="onSelect">
          <md-table-toolbar>
            <h1 class="md-title">{{ currentMonth }}</h1>
          </md-table-toolbar>
          
          <md-table-row @click="showDialog = true" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
            <md-table-cell :class="{ 'weekend': item.weekend_flag === 't'}" md-label="Day" md-sort-by="day" md-numeric>{{ item.day }}</md-table-cell>
            <md-table-cell md-label="Day Name" md-sort-by="day_name">{{ item.day_name }}</md-table-cell>
            <md-table-cell md-label="Weather" md-sort-by="weather">{{ item.weather }}</md-table-cell>

            <md-table-cell md-label="Event" md-sort-by="event">{{ item.event }}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-field>
        <label>Weather</label>
        <md-input
          v-model="selected.weather"
          placeholder="Weather">
        </md-input>
        <md-button
          class="md-primary"
          @click="populateWeather"
        >Populate weather
        </md-button>
      </md-field>
      <md-field>
        <label>Detail</label>
        <md-textarea
          v-model="selected.event"
          placeholder="Detail"
        >
        </md-textarea>
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" @click="save">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
import axios from 'axios';
// Get coordinates: https://api.weather.gov/points/{latitude},{longitude}
// Boston 42.360081, -71.058884
// https://api.weather.gov/points/42.360081,-71.058884

// Forecast
// https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast
// https://api.weather.gov/gridpoints/BOX/70,76/forecast

let today = new Date();
let currentMonth = today.getMonth() + 1;
let currentYear = today.getFullYear();

const uris = {
  api: 'https://0yekpx9bsj.execute-api.us-east-1.amazonaws.com/prod/log-entry',
  weather: 'https://api.weather.gov/gridpoints/BOX/70,76/forecast'
};

export default {
  name: 'App',
  data() {
    return {
      foreCast: null,
      selected: {},
      showDialog: false,
      calendarData: [],
      selectedDate: null,
      searchString: null,
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      loading: true
    };
  },
  computed: {
    currentMonth() {
      return today.getMonth() + 1;
    },
    year: {
      get() {
        return this.selectedYear;
      },
      set(val) {
        this.selectedYear = val;
      }
    },
    month: {
      get() {
        return this.selectedMonth;
      },
      set(val) {
        this.selectedMonth = val;
      }
    },
    today() {
      let day = today.toISOString().split('T')[0].split('-');
      return `${day[1]} / ${day[2]} / ${day[0]}`;
    }
  },
  async mounted() {
    await this.getForecast();
    await this.getMonth();
    this.loading = false;
  },
  methods: {
    populateWeather() {
      this.selected.weather = this.foreCast;
    },
    onSelect(item) {
      this.selected = item;
    },
    save() {
      this.showDialog = false;
      let params = {
        id: this.selected.id,
        weather: this.selected.weather,
        event: this.selected.event
      };
      let response = axios.post(uris.api, {params: params});
      if (response) {
      } else {
        console.log('Error loading data');
      }
    },
    getClass: ({ day }) => ({
      'md-primary': day === 2,
      'md-accent': day === 3,
    }),
    async getMonth() {
      this.loading = true;
      let params = {
        month: this.month,
        year: this.year,
        searchString: this.searchString,
      };
      let response = await axios.get(uris.api, {params: params});
      if (response && response.data) {
        this.calendarData = response.data.result;
        this.loading = false;
      } else {
        console.log('Error loading data');
      }
    },
    async getForecast() {
      let result = await axios.get(uris.weather);
      if (result && result.data) {
        this.foreCast = result.data.properties.periods[0].detailedForecast;
      } else {
        console.log('error loading weather'); //TODO: Implement error messages
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 1em;
}
.md-table + .md-table {
   margin-top: 16px
}
.md-card {
  margin-bottom: 1em;
}
.md-table table {
  text-align: left;
}
.weekend {
  background-color:grey;
}
.md-dialog /deep/.md-dialog-container {
    max-width: 768px;
  }
.md-dialog-container {
  padding: 1em;
}

.md-dialog-container {
  transform: none !important;
  width: 700px;
}

</style>
