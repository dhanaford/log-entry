<template>
  <div id="app">
    <Top :reminders="reminders" @clicked="handleNav"></Top>
    <News v-if="menuSelected === 'news'"></News>
    <div v-if="menuSelected === 'log'" class="md-layout md-gutter md-alignment-center">
      <div class="md-layout-item md-large-size-95 md-xlarge-size-95">
        <SplashLogin :md-active.sync="showSplash"></SplashLogin>
        <md-dialog-alert
          :md-active.sync="errorDialog"
          md-title="Error"
          :md-content="errorMessage"
        />

        <md-card-header>
          <span class="md-display-2">{{ today }}</span>
        </md-card-header>

        <md-card-content
          class="forecast"
          v-if="foreCast[0]">
          {{ foreCast[0].foreCast }}
        </md-card-content>

        <!-- List filters --->
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="year">Year</label>
              <md-select
                @md-selected="getMonth($event)"
                v-model="year"
              >
                <md-option value="2022">2023</md-option>
                <md-option value="2022">2022</md-option>
                <md-option value="2021">2021</md-option>
                <md-option value="2020">2020</md-option>
                <md-option value="2019">2019</md-option>
                <md-option value="2018">2018</md-option>
                <md-option value="2017">2017</md-option>
                <md-option value="2016">2016</md-option>
                <md-option value="2015">2015</md-option>
                <md-option value="2014">2014</md-option>
                <md-option value="2013">2013</md-option>
                <md-option value="2012">2012</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>Month</label>
              <md-select
                @md-selected="getMonth($event)"
                v-model="month"
              >
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
          <md-input
            @input="search"
            v-model="searchString"
            placeholder="Search Log"
          ></md-input>
        </md-field>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
          </div>
        </div>
      </div>
    </div>

    <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>

    <div v-if="menuSelected === 'log'" class="md-layout md-gutter md-alignment-center">
      <div class="md-layout-item md-large-size-95 md-xlarge-size-95">
        <span class="md-display-2 calendar-month">{{ currentMonth }}</span>
        <md-table
          v-model="calendarData"
          md-card
          @md-selected="onSelect"
        >
          <md-table-row
            @click="showDialog = true"
            slot="md-table-row"
            slot-scope="{ item }"
            :class="{ 'today': item.db_date.split('T')[0] === currentDateFormatted}"
            md-selectable="single"
          >
            <md-table-cell
              :class="{ 'weekend': item.weekend_flag === 't'}"
              md-label="Day"
              md-sort-by="day"
              md-numeric
            >{{ item.day }}
            </md-table-cell>
            <md-table-cell
              md-label="Day Name"
              md-sort-by="day_name"
            >{{ item.day_name }}
            </md-table-cell>
            <md-table-cell
              md-label="Weather"
              md-sort-by="weather"
            >{{ item.weather }}
            </md-table-cell>
            <md-table-cell
              md-label="Event"
              md-sort-by="event"
            >{{ item.event }}
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>

    <!-- Entry dialog -->
    <md-dialog :md-active.sync="showDialog">
      <Reminder :currentDate="currentDateFormatted" :date="selected.db_date"></Reminder>
      <md-field>
        <label>Select Forecast</label>
        <md-select
          @md-selected="populateWeather($event)"
          v-model="selectedForeCast"
        >
          <md-option
            v-for="(period, index) in foreCast"
            :key="index" :value="period.foreCast"
          >{{period.timePeriod}}
          </md-option>
        </md-select>
      </md-field>
      <md-field>
        <md-input
          v-model="selected.weather"
          placeholder="Weather">
        </md-input>
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
        <md-button
          class="md-primary"
          @click="save"
        >Save
        </md-button>
      </md-dialog-actions>
    </md-dialog>
    <Footer></Footer>
  </div>
</template>

<script>
import axios from 'axios';
import ls from 'local-storage';
import Footer from './components/Footer.vue';
import SplashLogin from './components/SplashLogin.vue';
import Top from './components/Top.vue';
import Reminder from './components/Reminder.vue';
import News from './components/News.vue';

/* weather api details */
// Get coordinates: https://api.weather.gov/points/{latitude},{longitude}
// Boston 42.360081, -71.058884
// https://api.weather.gov/points/42.360081,-71.058884

// Forecast
// https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast
// https://api.weather.gov/gridpoints/BOX/70,76/forecast

let today = new Date();
let currentMonth = today.getMonth() + 1;
let currentYear = today.getFullYear();

const isProd = process.env.NODE_ENV === 'production';

const uris = {
  api: `https://0yekpx9bsj.execute-api.us-east-1.amazonaws.com/${isProd ? 'prod' : 'dev'}/log-entry`,
  weather: 'https://api.weather.gov/gridpoints/BOX/70,76/forecast'
};

const weatherApi = axios.create({
  baseURL: 'https://api.weather.gov/gridpoints/BOX/70,76/forecast',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  components: {
    Footer,
    SplashLogin,
    Top,
    Reminder,
    News
  },
  name: 'App',
  data() {
    return {
      foreCast: [],
      selected: {},
      showDialog: false,
      showSplash: true,
      calendarData: [],
      searchString: null,
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      loading: true,
      localStorage: null,
      errorMessage: null,
      errorDialog: false,
      selectedForeCast: null,
      reminders: [],
      newsSelected: false,
      menuSelected: 'log'
    };
  },
  computed: {
    currentMonth() {
      return this.calendarData.map(val => val.month_name)[0];
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
    currentDateFormatted() {
      return new Date().toISOString().split('T')[0];
    },
    today() {
      let day = today.toISOString().split('T')[0].split('-');
      return `${day[1]} / ${day[2]} / ${day[0]}`;
    }
  },
  async mounted() {
    await this.getForecast();
    await this.getMonth();
    if (isProd) await this.getLocalStorageEvents();
    await this.getLocalStorageReminders();
    // let response = await axios.get(uris.news);
    // console.log(response.data.articles);
    this.loading = false;
  },
  methods: {
    async getLocalStorageReminders() {
      let localStorage = ls.get('log.entry.reminder');
      if (localStorage) {
        this.reminders = ls.get('log.entry.reminder');
      }
    },
    populateWeather() {
      this.selected.weather = this.selectedForeCast;
    },
    onSelect(item) {
      if (item) {
        this.selected = item;
      }
    },
    search(event) {
      if (isProd) {
        this.searchList(event); // search feature for prod
        if (!event) {
          this.getMonth();
        }
      } else {
        this.getMonth(); // getMonth handles search for dev
      }
    },
    save() {
      this.showDialog = false;
      let params = {
        id: this.selected.id,
        weather: this.selected.weather,
        event: this.selected.event
      };
      if (isProd) {
        // save to local storage
        let existingEntry = ls.get('log.entry');
        if (existingEntry === null) existingEntry = [];
        existingEntry.push(params);
        ls.set('log.entry', existingEntry);
      } else {
        try {
          let response = axios.post(uris.api, {params: params});
          if (response) {
          } else {
            this.errorDialog = true;
            this.errorMessage = 'Error saving data';
          }
        } catch(e) {
          throw new Error(e);
        }
      }
    },
    getLocalStorageEvents() {
      let localStorage = ls.get('log.entry');
      if (localStorage) {
        this.localStorage = (ls.get('log.entry'));
      }
      if (localStorage) {
        for (let property of this.calendarData) {
          for (let val of this.localStorage) {
            if (property.id === val.id) {
              property.event = val.event;
              property.weather = val.weather;
            }
          }
        }
      }  
    },
    searchList() {
      this.calendarData = this.calendarData.filter(str => {
        return (str.event && str.weather) ? str.event.indexOf(this.searchString) !== -1 || str.weather.indexOf(this.searchString) !== -1  : str.event || str.weather;
      });
    },
    handleNav(evt) {
      this.menuSelected = evt;
    },
    async getMonth() {
      this.loading = true;
      let params = {
        month: this.month,
        year: this.year,
        searchString: this.searchString
      };
      let response = await axios.get(uris.api, {params: params});
      if (response && response.data) {
        this.calendarData = response.data.result;
        if (isProd) this.getLocalStorageEvents();
        this.loading = false;
      } else {
        this.errorDialog = true;
        this.errorMessage = 'Error loading data';
      }
    },
    async getForecast() {
      try {
        let result = await weatherApi.get(uris.weather);
        if (result && result.data) {
          this.foreCast = result.data.properties.periods.map(val => {
            return {
              timePeriod: val.name,
              foreCast: val.detailedForecast
            };
          });
        } else {
          this.errorDialog = true;
          this.errorMessage = 'Error loading weather forecast';
        }
      } catch(e) {
        console.log(e);
        throw new Error(e);
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
  padding: 0 0em;
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
.md-dialog {
  z-index: 9 !important;
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
.md-table {
  margin-top: 1em;
}
.today {
  background-color: #616161;
  border: 2px solid #448aff;
}
.is-today {
  color: red !important;
}
.forecast {
  color: white;
}
.hide-notification .md-badge.md-theme-default {
  display: none;
}
.remove {
  float:right;
  color: red;
  font-weight: bold;
  padding-left: .5em;
}
.reminder {
  padding: 1em;
  cursor: pointer;
}

</style>
