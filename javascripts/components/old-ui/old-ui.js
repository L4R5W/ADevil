"use strict";

Vue.component("old-ui", {
  components: {
    "big-crunch-button": {
      template: `<button class="o-tab-btn o-big-crunch-btn" onclick="bigCrunchResetRequest()">Big Crunch</button>`
    }
  },
  data() {
    return {
      bigCrunch: false,
      smallCrunch: false
    };
  },
  computed: {
    tab: () => Tabs.current,
    news() {
      return this.$viewModel.news;
    }
  },
  methods: {
    update() {
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      if (!this.canCrunch() || (player.break && challenge === undefined)) {
        this.bigCrunch = false;
        this.smallCrunch = false;
        return;
      }
      this.smallCrunch = true;
      const endOfChallenge = challenge !== undefined && !player.options.retryChallenge;
      this.bigCrunch = endOfChallenge || Time.thisInfinityRealTime.totalMinutes > 1;
    },
    canCrunch() {
      if (Enslaved.isRunning && NormalChallenge.isRunning &&
        !Enslaved.BROKEN_CHALLENGE_EXEMPTIONS.includes(NormalChallenge.current.id)) {
        return true;
      }
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      const goal = challenge === undefined ? Decimal.NUMBER_MAX_VALUE : challenge.goal;
      return player.thisInfinityMaxAM.gte(goal);
    }
  },
  template: `
    <div id="container" class="container c-old-ui l-old-ui">
      <link rel="stylesheet" type="text/css" href="stylesheets/old-ui.css">
      <template v-if="bigCrunch">
        <big-crunch-button class="l-old-ui__big-crunch-btn" />
        <div class="o-emptiness">
          The world has collapsed on itself due to excess of antimatter.
        </div>
      </template>
      <template v-else>
        <news-ticker class="l-old-ui__news-bar" v-if="news"/>
        <game-header class="l-old-ui__header" />
        <old-ui-tab-bar />
        <component v-if="tab.config.before" :is="tab.config.before" />
        <old-ui-subtab-bar />
        <big-crunch-button
          v-show="smallCrunch"
          class="l-old-ui__big-crunch-btn l-old-ui__big-crunch-btn--overlay"
        />
        <div class="l-old-ui-page l-old-ui__page">
          <slot />
        </div>
        <footer-links class="l-old-ui__footer" />
      </template>
    </div>
    `
});
