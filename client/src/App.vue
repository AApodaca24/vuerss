<template>
  <v-app id="inspire">
    <v-navigation-drawer clipped fixed v-model="drawer" app>
      <v-list dense>
        <v-subheader>Menu</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item @click="allFeeds">
            <v-list-item-icon>
              <v-icon> dashboard </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> All Feeds </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="addFeed">
            <v-list-item-icon>
              <v-icon> add </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Add </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(feed, index) in feeds"
            :key="index"
            :value="feed == selectedFeed"
          >
            <v-list-item-icon @click="filterFeed(feed)">
              <v-icon :color="feed.color"> bookmark </v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="filterFeed(feed)">
              <v-list-item-title>{{ feed.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        >myRSS
        <v-icon color="orange darken-3" class="pb-1">rss_feed</v-icon>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <div>
              <v-container fluid grid-list-lg>
                <v-layout row wrap>
                  <v-flex xs12 v-for="(item, index) in items" :key="index">
                    <v-card>
                      <v-card-title primary-title>
                        <div class="headline">{{ item.title }}</div>
                      </v-card-title>
                      <v-card-text v-html="item.contentSnippet"> </v-card-text>
                      <v-card-actions>
                        <v-btn text target="_new" :href="item.link"
                          >See link</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn icon @click="show = !show">
                          <v-icon>{{
                            show ? 'mdi-chevron-up' : 'mdi-chevron-down'
                          }}</v-icon>
                        </v-btn>
                      </v-card-actions>
                      <v-expand-transition>
                        <div v-show="show">
                          <v-divider></v-divider>

                          <v-card-text v-html="item.content"> </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
          </v-col>
        </v-row>
        <v-dialog v-model="addFeedDialog" max-width="500px">
          <v-card>
            <v-card-title>Add Feed</v-card-title>
            <v-card-text>
              Add the RSS URL for a feed below, or the URL for the site and I'll
              try to auto-discover the RSS feed.
              <v-text-field
                v-model="addURL"
                label="URL"
                :error="urlError"
                :rules="urlRules"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.stop="addFeedAction">Add</v-btn>
              <v-btn color="primary" text @click.stop="addFeedDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';

const colors = [
  'indigo',
  'blue',
  'cyan',
  'light-blue',
  'teal',
  'light-green',
  'blue-grey',
];

export default {
  name: 'App',
  data: () => ({
    //
    drawer: true,
    showIntro: false,
    addFeedDialog: false,
    addURL: '',
    urlError: false,
    urlRules: [],
    feeds: [],
    allItems: [],
    selectedFeed: null,
    error: false,
    errorMsg: '',
    show: false,
  }),
  computed: {
    items() {
      if (this.allItems.length === 0) return [];
      // filter
      let items = [];
      if (this.selectedFeed) {
        console.log('filtered');
        items = this.allItems.filter(
          item => item.feedPk == this.selectedFeed.feedUrl,
        );
      } else {
        items = this.allItems;
      }
      items = items.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

      return items;
    },
  },
  created() {
    this.$vuetify.theme.dark = true;
    this.restoreFeeds();
  },
  methods: {
    allFeeds() {
      this.selectedFeed = null;
    },
    storeFeeds() {
      console.log('calling storeFeeds');
      localStorage.setItem('feeds', JSON.stringify(this.feeds));
    },
    addFeed() {
      console.log('Add Feed');
      this.addFeedDialog = true;
    },
    async addFeedAction() {
      try {
        this.urlError = false;
        this.urlRules = [];
        // first, see if new
        if (this.feeds.findIndex(feed => feed.rsslink === this.addURL) >= 0) {
          this.urlError = true;
          this.urlRules = ['URL already exists.'];
        } else {
          const { data } = await axios.post('http://localhost:3000/rss', {
            url: this.addURL,
          });
          const feed = data.items;
          data.color = colors[this.feeds.length % (colors.length - 1)];
          feed.forEach(f => {
            console.log(this.addURL);
            f.feedPk = this.addURL;
            f.feedColor = data.color;
            this.allItems.push(f);
          });
          delete data.items;
          data.feedUrl = this.addURL;
          this.feeds.push(data);
          this.addFeedDialog = false;
          this.storeFeeds();
        }
      } catch (error) {
        console.log(error);
        this.error = true;
        this.errorMsg = error.message;
      }
    },

    filterFeed(feed) {
      this.selectedFeed = feed;
    },
    loadFeed(feed) {
      axios
        .post('http://localhost:3000/rss', { url: feed })
        .then(res => {
          res.data.items.forEach(item => {
            item.feedPk = feed.feedUrl;
            item.feedTitle = feed.title;
            item.feedColor = feed.color;
            this.allItems.push(item);
          });

          this.addFeedDialog = false;

          // persist the feed, but not the items
          this.storeFeeds();
        })
        .catch(error => {
          this.error = true;
          this.errorMsg = error.message;
        });
    },
    restoreFeeds() {
      const feeds = localStorage.getItem('feeds');
      if (feeds) {
        this.feeds = JSON.parse(feeds);
        this.feeds.forEach((feed, idx) => {
          feed.color = colors[idx % (colors.length - 1)];
          this.loadFeed(feed);
        });
      }
    },
  },
};
</script>
