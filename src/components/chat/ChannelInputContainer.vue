<template>
  <div class="input-area">
    <div v-if="loggedIn && isConnected && currentChannel && currentChannel.canWrite" class="input-container">
      <label class="channel-input-wrapper">
        <textarea
          class="channel-input"
          spellcheck="false"
          :placeholder="'Enter a message'"
          v-model="messageText"
          @keydown.enter.shift.exact.prevent
          @keyup.enter.shift.exact="emitSubmit()"
        />
      </label>
      <button
        class="channel-input-button"
        @mousedown="saveActiveElement()"
        @click.prevent="emitSubmit()"
      >Send</button>
    </div>

    <div v-else-if="!isConnected && channel" class="input-blocked">Not connected</div>
    <div v-else-if="loggedIn && isConnected && currentChannel && !currentChannel.canWrite" class="input-blocked">You don't have write permissions for this channel</div>
    <div v-else-if="!loggedIn && isConnected && channel" class="input-blocked">Log in to send messages</div>
    <div v-else class="input-blocked">Something went wrong</div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';

const userStore = useAuthStore()
const { loggedIn } = storeToRefs(userStore)
const channelStore = useChannelStore()
const { currentChannel, channel } = storeToRefs(channelStore)

const messageText = ref<string>("")
let activeElement: Element | null = null
let textField: HTMLTextAreaElement | null = null

const props = defineProps({
  isConnected: { type: Boolean, required: true },
})

const emit = defineEmits<{
  submitMessageText: [messageText: string],
}>()

function saveActiveElement() {
  activeElement = document.activeElement
}

function emitSubmit() {
  textField = document.querySelector<HTMLTextAreaElement>("textarea[class=channel-input]")
  if (activeElement === textField) {
    textField?.focus()
  }

  if (!props.isConnected) {
    return
  }

  const text = messageText.value.trim()
  messageText.value = ""
  if (text.length < 1 || text.length > 1024) {
    return
  }

  emit('submitMessageText', text)
}

watch(messageText, (newValue, oldValue) => {
  if (newValue.length > 1024) {
    messageText.value = newValue.slice(0, 1024)
  }
})
</script>

<style scoped>
.input-area {
  flex: 0 0 auto;
  display: flex;

  min-height: 50px;
  margin: 10px;
  background-color: rgb(25, 50, 50);
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
}
.input-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
}
.channel-input-wrapper {
  flex: 1 1 auto;
  display: flex;
  padding: 5px;
  cursor: text;
  background-color: rgb(35, 70, 70);
}
.channel-input {
  height: 40px;
  width: 100%;
  resize: none;
  background-color: rgb(35, 70, 70);
  font-size: 17px;

  scrollbar-width: none;
}
.channel-input::-webkit-scrollbar {
  width: 0;
}
.channel-input-button {
  flex: 0 0 auto;
  height: 50px;
  width: 50px;
  background-color: rgb(45, 90, 90);
  transition: background-color 50ms;
}
/* .channel-input-button:hover {
  background-color: rgb(35, 70, 70);
} */
.channel-input-button:active {
  background-color: rgb(25, 50, 50);
}
.input-blocked {
  margin: auto;
  text-align: center;
}
</style>
