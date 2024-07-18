<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ADevilIntroModal",
  components: {
    ModalWrapper,
    PrimaryButton,
  },
  computed: {
  },
  methods: {
    handleYesClick() {
      player.ADevil.modded = true;
    }
  }
};
</script>

<template>
  <ModalWrapper class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      Heyho!
    </div>
    <div>
      This mod does not add any content to the base game.
      <br>
      Blablabla more info goes here once I'm done.
      <br>
      <br>
      Have fun!
    </div>
    <div class="l-confirm-padding">
      <PrimaryButton
        @click="handleYesClick()"
      >
        Confirm
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.l-confirm-padding {
  margin: 1rem;
}
</style>
