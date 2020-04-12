"use strict";

Vue.component("autobuyers-tab", {
  data: () => ({
    hasContinuum: false
  }),
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
    }
  },
  template:
    `<div class="l-autobuyers-tab">
      <autobuyer-toggles class="l-autobuyers-tab__toggles" />
      <table style="width: 90rem;">
        <tbody>
          <reality-autobuyer-box />
          <eternity-autobuyer-box />
          <dimboost-autobuyer-box />
          <galaxy-autobuyer-box />
          <big-crunch-autobuyer-box />
          <template v-if="hasContinuum">
            Continuum makes Normal Dimension and tickspeed autobuyers obsolete, 
            as you now automatically have a certain amount of simulated Normal Dimension 
            and tickspeed purchases based on your antimatter.
          </template>
          <div v-else>
            <dimension-autobuyer-box v-for="tier in 8" :key="tier" :tier="tier"/>
          </div>
          <tickspeed-autobuyer-box />
          <sacrifice-autobuyer-box />
        </tbody>
      </table>
    </div>`
});
