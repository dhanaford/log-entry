<template>
  <div class="footer">
    Copyright &#169; David Hanaford  {{ currentYear }}   | v.{{ version }}
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    msg: String,
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    version() {
      return '1.0.0';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  background-color: #1e1e1e;
  color: white;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 1em;
}
</style>
