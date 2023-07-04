<template>
  <div v-if="currentChannel && channel" class="channel-info">
    <h2>Channel "{{ channel.name }}"</h2>
    <span>Channel created at: {{ channel.createdAt }}; </span>
    <span>You joined at: {{ currentChannel.joinedAt }}; </span>
    <span>Channel type is: {{ channel.type }};</span><br>
    <span v-if="isConnected">Connection Status: <strong>Online</strong></span>
    <span v-else>Connection Status: <strong>Offline</strong></span>
  </div>
  <div v-else class="channel-info">Could not load channel info</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';

const props = defineProps({
  isConnected: { type: Boolean, required: true },
})

const channelStore = useChannelStore()
const { currentChannel, channel } = storeToRefs(channelStore)
</script>

<style scoped>
.channel-info {
  flex: 0 0 auto;
  background-color: rgb(25, 50, 50);
  margin: 10px;
  padding: 0 5px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
}
</style>
