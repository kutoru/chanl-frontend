<template>
  <ActiveChat :channel-id="channelIdNumber"/>
</template>

<script setup lang="ts">
import ActiveChat from '@/components/ActiveChat.vue';
import router from '@/router';
import { onBeforeMount, ref, watch } from 'vue';

const props = defineProps({
  channelId: { type: String, required: true },
})

const channelIdNumber = ref<number>(NaN)

function parseChannelId() {
  channelIdNumber.value = parseInt(props.channelId)
  if (Number.isNaN(channelIdNumber.value) || channelIdNumber.value === 1) {
    router.push({ name: "global" })
  }
}

onBeforeMount(() => {
  parseChannelId()
})

watch(() => props.channelId, () => {
  parseChannelId()
})
</script>
