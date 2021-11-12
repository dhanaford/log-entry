<template>
  <div class="date">
    <md-field class="reminder">
      <md-button class="md-icon-button">
        <md-icon :class="{'is-today': reminderForDay.length}">notifications</md-icon>
        <md-tooltip md-direction="right">Set Reminder</md-tooltip>
      </md-button>
      <md-input
        v-model="reminderName"
        @keyup.enter="save"
        placeholder="Enter Reminder"
      ></md-input>
      <ul>
        <li
          v-for="(item, idx) in reminderForDay"
          :key="idx"
          :value="item">{{item.reminderName}}
          <span class="remove" @click="removeReminder(item.idx)">Xs</span>
        </li>
      </ul>
    </md-field>
  </div>
</template>

<script>
import ls from 'local-storage';
import localStorage from '@/mixins/localStorage.js';
export default {
  name: 'Reminder',
  mixins: [localStorage],
  props: ['date', 'showDialog'],
  data() {
    return {
      reminderName: null,
      reminders: []
    };
  },
  computed: {
    reminderForDay: {
      get() {
        return this.reminders.filter(val => {
          if (val) {
            return val.date === this.date;
          }
        });
      },
      set(val) {
        this.reminders = val;
      }
    }
  },
  mounted() {
    console.log('test1');
    this.getReminders();
    // let localStorage = ls.get('log.entry.reminder');
    // if (localStorage) {
    //   this.reminders = ls.get('log.entry.reminder');
    // }
  },
  methods: {
    getReminders() {
      let localStorage = ls.get('log.entry.reminder');
      if (localStorage) {
        this.reminders = ls.get('log.entry.reminder');
      }
    },
    save(evt) {
      let existingEntry = ls.get('log.entry.reminder');
      if (existingEntry === null) existingEntry = [];
      this.reminderName = evt.target.value;
      this.reminders.push({
        reminderName: this.reminderName,
        date: this.date
      });
      existingEntry = this.reminders;
      ls.set('log.entry.reminder', existingEntry);
      this.reminderName =  null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-field.reminder {
  float: left;
}
.date {
  display: flex;
  justify-content: right;
}
.is-today {
  color: red !important;
}

</style>