<template>
  <div>
    <md-dialog style="text-align: center" v-if="!authenticated" :md-click-outside-to-close="false" :md-active.sync="showDialog">
      <div v-if="isProd">
        <md-dialog-title>Welcome to the Log Entry app!</md-dialog-title>
        <p>I came up with the idea for this app after entering my daily activities into a google doc for over 10 years. I wanted a better way to maintain my data and to be able to filter and search with corresponding dates.
          <br/>
          <br/>
          Detailed information, events, to-do's, reminders and current weather can be entered into each day accordingly for personal use. Locally, the project retrieves my personal data from a database where I have my entries stored. I have written a script to backfill data from google docs to a the database. Here, the data is saved to local storage for demo-purposes, although calendar data is retrieved from the same database.
          <br />
          <br />
          Feel free to have a look around, add some data, and fiddle with some search features. Enjoy!
          <br />
          <br />
          More information and code-base: <a href="https://github.com/dhanaford/log-entry" target="_blank">https://github.com/dhanaford/log-entry</a>
        </p>
        <md-dialog-actions>
          <md-button 
            class="md-primary" 
            @click="authenticated = true"
          >Close
          </md-button>
        </md-dialog-actions>
      </div>
      <div v-else>
        <md-field :md-toggle-password="false">
          <label>Enter Password to Login</label>
          <md-input
            @keyup.enter="logIn"
            v-model="password"
            type="password"
          ></md-input>
          <span class="md-helper-text">If you are not David Hanaford, please leave :)</span>
        </md-field>
      </div>
    </md-dialog>
  </div>
</template>

<script>

const isProd = process.env.NODE_ENV === 'production';

export default {
  name: 'Splash',
  props: {
    msg: String
  },
  data() {
    return {
      showDialog: true,
      isProd: isProd,
      authenticated: false,
      password: null
    };
  },
  mounted() {
    let password = this.$session.get('password');
    if (password === process.env.VUE_APP_PASSWORD) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
  },
  methods: {
    logIn() {
      if (this.password === process.env.VUE_APP_PASSWORD) {
        this.$session.set('password', process.env.VUE_APP_PASSWORD);
        this.authenticated = true;
        this.showDialog = false;
      } else {
        this.showDialog = true;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
