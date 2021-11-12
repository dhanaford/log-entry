import ls from 'local-storage';

export default {
  data() {
    return {
      // reminders: []
    };
  },
  methods: {
    removeReminder(idx) {
      console.log('fired');
      let existingEntry = ls.get('log.entry.reminder');
      this.reminders.splice(idx, 1);
      existingEntry = this.reminders;
      ls.set('log.entry.reminder', existingEntry);
    }
  },
  onSelect(item) {
    console.log('fired');
    if (item) {
      this.editingItem = item;
    }
  }
};