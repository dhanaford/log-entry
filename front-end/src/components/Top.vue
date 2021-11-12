<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-secondary">
      <md-button class="md-icon-button"
        @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <md-button @click="handleNav('log')">Log</md-button>
      <md-button @click="handleNav('news')">News</md-button>
      <div class="md-toolbar-section-end">
        <md-menu
          md-size="big"
          md-direction="top-start"
          :md-active.sync="toggleCard"
        >
          <md-badge
            :class="{'hide-notification': !reminders.length}"
            :md-content="reminders.length"
            md-dense
          >
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon>notifications</md-icon>
            </md-button>
          </md-badge>

          <md-menu-content>
            <div class="reminder">
              <div
                v-for="(reminder, idx) in reminders"
                :key="idx" :value="reminder"
                :class="[{'due-today': formatDate(reminder) === currentDateFormatted}, {'is-past-due': formatDate(reminder) < currentDateFormatted}]"
              >
                {{ reminder.reminderName }} - {{ formatDate(reminder).split('-')[1]}} / {{formatDate(reminder).split('-')[2]}}
                <span v-if="formatDate(reminder) === currentDateFormatted"></span>
                <span class="remove"
                  @click="removeReminder(idx)"
                >X</span>
              </div>
            </div>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>
    <md-drawer
      :md-active.sync="showNavigation" 
      md-swipeable
    >
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">To Do</span>
        <md-field>
          <md-input
            placeholder="Enter To-Do"
            @keyup.enter="add"
            v-model="editingItem.name"
          >{{editingItem.name}}
          </md-input>
        </md-field>
      </md-toolbar>
      <md-table
        v-model="toDo"
        md-card
        @md-selected="onSelect"
      >
        <md-table-row
          v-if="item.name"
          slot="md-table-row"
          slot-scope="{ item }"
          :class="getClass(item)"
          md-selectable="single"
        >
          <md-table-cell
            :v-for="(item, idx) in toDo"
            :index="idx"
            :value="item"
          >{{ item.name }}
            <span class="remove"
              @click="remove(item.idx)"
            >X</span>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </md-drawer>
  </div>
</template>

<script>
import ls from 'local-storage';
import localStorage from '@/mixins/localStorage.js';

export default {
  name: 'ToDo',
  mixins: [localStorage],
  props: ['reminders', 'today'],
  data() {
    return {
      editingItem: {},
      showNavigation: false,
      selected: null,
      idx: 0,
      toDo: [],
      toggleCard: false,
      newsSelected: false
    };
  },
  mounted() {
    this.getToDos();
  },
  computed: {
    currentDateFormatted() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    remove(idx) {
      let indexOfTodoToDelete = this.toDo.findIndex((todoInArray) => todoInArray.idx === idx);
      this.toDo.splice(indexOfTodoToDelete, 1);
      ls.set('log.entry.todo', this.toDo);
    },
    getToDos() {
      let localStorage = ls.get('log.entry.todo');
      if (localStorage) {
        this.toDo = ls.get('log.entry.todo');
      }
    },
    add() {
      let existingEntry = ls.get('log.entry');
      if (existingEntry === null) existingEntry = [];
      this.toDo.push({
        name: this.editingItem.name,
        completed: false,
        idx: Math.random() // Hack for UI :/
      });
      existingEntry = this.toDo;
      ls.set('log.entry.todo', existingEntry);
      this.editingItem = {};
    },
    getClass: ({ id }) => ({
      'md-primary': id === 2,
      'md-accent': id === 3
    }),
    onSelect(item) {
      if (item) {
        this.editingItem = item;
      }
    },
    formatDate(reminder) {
      reminder = reminder.date.split('T')[0];
      return reminder;
    },
    handleNav(event) {
      this.$emit('clicked', event);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-drawer.md-temporary.md-active {
  padding: 1em;
}
.reminder div {
  height: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  padding-top: 2px;
}
.due-today {
  color: #448aff;
}
.is-past-due {
  color: red;
}
.md-menu-content-container {
  width: 800px;
}
</style>
