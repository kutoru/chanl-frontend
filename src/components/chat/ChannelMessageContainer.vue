<template>
  <div class="message-container">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message"
     >
      <div class="message-top">
        <div class="message-name">{{ message.userName }}</div>
        <div class="message-fill"></div>
        <div class="message-date">{{ message.sentAt }}</div>
      </div>
      <div class="message-text">{{ message.text }}</div>
    </div>
    <div v-if="messages.length === 0" class="no-messages">There are no messages in this channel</div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "@/types/Message"
import type { PropType } from "vue";
const props = defineProps({
  messages: { type: Object as PropType<Message[]>, required: true},
})
</script>

<style scoped>
.message-container {
  flex: 1 1 auto;
  min-height: 200px;
  background-color: rgb(25, 50, 50);
  margin: 0 10px 0 10px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);

  overflow-y: scroll;
  overflow-x: hidden;
  word-wrap: break-word;
  display: flex;
  flex-direction: column-reverse;

  scrollbar-width: none;
}
.message-container::-webkit-scrollbar {
  width: 0;
}
.no-messages {
  text-align: center;
  margin: auto;
  font-weight: bold;
}
.message {
  border: 0px rgb(15, 30, 25) solid;
  border-top-width: 2px;
}
.message-top {
  display: flex;
  flex-direction: row;
}
.message-name, .message-date {
  font-weight: bold;
  font-size: 15px;
  flex: 0 0 auto;
  margin: 2px 4px 0px 4px;
}
.message-text {
  font-size: 14px;
  margin: 5px 10px;
}
.message-fill {
  flex: 1 1 auto;
}
</style>
