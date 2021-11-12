<template>
  <div class="page-container md-layout-column">
    <md-field class="header-spacing">
      <md-input
        class='search-input'
        placeholder="Search news with any keyword"
        @keyup.enter="search"
        v-model="searchString"
      ></md-input>
    </md-field>
    <md-field v-if="!isProd">
      <label class='search-input' for="source">Source</label>
      <md-select class='search-input' @md-selected="changeSource($event)" v-model="selectedSource">
        <md-option
          v-for="(source, idx) in sources"
          :key="idx"
          :value="source.id"
        >{{source.name}}</md-option>
      </md-select>
    </md-field>
    <md-button
      :class="{'md-primary': categorySelected === category}"
      v-for="(category, idx) in categories"
      :key="idx"
      :value="category"
      @click="changeCategory(category)"
    >{{category}}
    </md-button>

    <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>

    <div class="archive">
      <article class="article"
        v-for="(article, idx) in articles"
        :key="idx"
        :value="article"
      >
        <a
          target="_blank"
          :href="article.url"
        >
          <img
            v-if="isProd"
            :src="article.image" />
          <img
            v-else
            :src="article.urlToImage" />
          <b>{{article.title}}</b> <br />
          <span class="author"
            v-if="article.author">by  {{ article.author }}<br /></span>

          <span v-if="isProd" class="date"> {{formatDate(article.published_at)}}</span>
          <span v-else class="date"> {{formatDate(article.publishedAt)}}</span>
        </a>
      </article>      
    </div>
    <div class="pagination">
      <md-button v-show="articles.length < 100" @click="handlePaginationChange(categorySelected)">More</md-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

let today = new Date();
today.setDate(today.getDate() - 1);
today = today.toISOString().split('T')[0];

const newsApiKey = process.env.VUE_APP_NEWS_API_KEY;
const newsProdApiKey = process.env.VUE_APP_NEWS_PROD_API_KEY;
const uris = {
  news: (isProd) ? 'http://api.mediastack.com/v1/news' : 'https://newsapi.org/v2'
};

export default {
  name: 'News',
  data() {
    return {
      articles: [],
      searchString: null,
      categories: [
        'general',
        'science',
        'technology',
        'health',
        'business',
        'entertainment'
      ],
      sources: [],
      categorySelected: 'general',
      pageSize: 20,
      offSet: 0,
      limit: 25,
      selectedSource: null,
      loading: true
    };
  },
  async mounted() {
    await this.fetchNews();
    (!isProd) ? await this.getSources() : '';
  },
  computed: {
    isProd() {
      return process.env.NODE_ENV === 'production';
    }
    // pagination() {
    //   return this.articles.map((val, idx) => idx);
    // }
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      const url = isProd ?
        `${uris.news}?languages=en&sort=published_desc&access_key=${newsProdApiKey}` :
        `${uris.news}/everything?q=Apple&from=${today}&sortBy=popularity&apiKey=${newsApiKey}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.status === 200) {
          this.articles = isProd ? response.data.data : response.data.articles;
        }
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },
    async getSources() {
      this.loading = true;
      const url = `${uris.news}/top-headlines/sources?apiKey=${newsApiKey}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.status === 200) {
          this.sources = response.data.sources;
        }
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },
    async changeSource(source) {
      this.loading = true;
      this.categorySelected = null;
      const url = `${uris.news}/top-headlines?sources=${source}&apiKey=${newsApiKey}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.status === 200) {
          this.articles = response.data.articles;
        }
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },
    async search() {
      this.loading = true;
      const url = isProd ?
        `${uris.news}?languages=en&sort=published_desc&keywords=${this.searchString}&access_key=${newsProdApiKey}` :
        `${uris.news}/everything?q=${this.searchString}&apiKey=${newsApiKey}`;
      try {
        const response =  await axios.get(url);
        if (response && response.data && response.status === 200) {
          this.articles = isProd ? response.data.data : response.data.articles;
        } else {
          console.log('error retrieving articles'); // TODO: add error screen
        }
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },
    formatDate(date) {
      const day = date.split('T')[0].split('-');
      return `${day[1]} / ${day[2]} / ${day[0]}`;
    },
    async changeCategory(category) {
      this.searchString = null;
      this.loading = true;
      this.selectedSource = null;
      this.categorySelected = category;
      const url = isProd ?
        `${uris.news}?languages=en&sort=published_desc&limit=${this.limit}&offset=${this.offSet}&categories=${category}&access_key=${newsProdApiKey}` :
        `${uris.news}/top-headlines?country=us&category=${category}&pageSize=${this.pageSize}&apiKey=${newsApiKey}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.status === 200) {
          this.articles = isProd ? response.data.data : response.data.articles;
        } else {
          console.log('error retrieving articles'); // TODO: add error screen
        }
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },
    async handlePaginationChange(category) {
      if (this.articles.length < 100) {
        this.offSet+=25;
        this.limit+=25;
        this.pageSize+=20;
      }
      await this.changeCategory(category);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-content {
  width: 40%;
  height: 200px;
  display: inline-table;
  /* justify-content: center;
  align-items: center; */
  margin: 1em;
}
.article-link {
  align-items: flex-end;
}
.article {
  text-align: left;
  padding: 1em;
  background: #fff;
  box-shadow:
    0 5px 10px rgba(0, 0, 0, 0.1),
    0 20px 20px rgba(0, 0, 0, 0.05);
}
.archive {
  /* Define the element as a grid container */
  display: grid;
  padding: 1em;
  /* Auto-fit as many items on a row as possible without going under 180px */
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  /* A little spacing between articles */
  grid-gap: 1em;
}

img {
  padding-bottom: .5em;
}

.author {
  font-style: italic;
  font-size: 11px;
  color: black;
}
.date {
  font-size: 11px;
  color: black;
}

/* Single column display for phones */
@media (max-width: 459px) {
  .archive {
    display: flex;
    flex-direction: column;
  }
}
.search-input {
  padding: 1em !important;
}
.pagination {
  display: inline-block;
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}

.pagination a.active {
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
}

.pagination a:hover:not(.active) {
  background-color: #ddd;
  border-radius: 5px;
}
.header-spacing {
  margin-top: 4em;
}
.md-progress-spinner {
  position: absolute;
  top: 25%;
  left: 50%;
}
</style>
