<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-secondary">
      <md-button class="md-icon-button"
        @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">To Do</span>
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

export default {
  name: 'ToDo',
  data() {
    return {
      editingItem: {},
      showNavigation: false,
      selected: null,
      idx: 0,
      toDo: []
    };
  },
  computed: {
  },
  mounted() {
    this.getToDos();
  },
  methods: {
    remove(idx) {
      console.log(idx);
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .md-table table thead {
  display: none !important;
} */
.md-drawer.md-temporary.md-active {
  padding: 1em;
}
.remove {
  float:right;
  color: red;
  font-weight: bold;
}
</style>
