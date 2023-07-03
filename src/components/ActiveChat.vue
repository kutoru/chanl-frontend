<template>
  <div v-if="everythingLoaded && currentChannel && channel" class="channel-container">
    <!-- Maybe change this to a separate ChannelInfo component -->
    <div class="channel-info">
      <h2>Channel "{{ channel.name }}"</h2>
      <h3 v-if="isConnected">Status: Online</h3>
      <h3 v-else>Status: Offline</h3>
    </div>
    <!-- TODO: Change this to a separate ChannelMessage component -->
    <div class="message-container">
      <div v-for="message, index in receivedMessages" :key="index" class="message">
        <div>{{ message.id }}</div>
        <div>{{ message.userId }}</div>
        <div>{{ message.channelId }}</div>
        <div>{{ message.text }}</div>
        <div>{{ message.sentAt }}</div>
      </div>
    </div>
    <!-- TODO: Change this to a separate MessageInput component -->
      <div v-if="loggedIn" class="input">
        <input
          type="text"
          :placeholder="'Enter a message'"
          v-model="messageText"
        >
        <button @click.prevent="sendMessage">Send</button>
      </div>
      <div v-else class="input">Log in to send messages</div>
  </div>

  <h2 v-else-if="loadFailed">Either could not connect or could not load the necessary information</h2>
  <h2 v-else>Loading the channel...</h2>
</template>

<script setup lang="ts">
import type { Channel } from "@/types/Channel";
import type { CurrentChannel } from "@/types/CurrentChannel";
import type { Message } from "@/types/Message";
import { ref } from "vue";
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const props = defineProps({
  channelId: { type: Number, required: true },
})

const everythingLoaded = ref<boolean>(false)
const loadFailed = ref<boolean>(false)
const isConnected = ref<boolean>(false)
const channel = ref<Channel | undefined>()
const currentChannel = ref<CurrentChannel | undefined>()
const receivedMessages = ref<Message[]>([])
const messageText = ref<string>("")

const apiurl = "192.168.1.12:4000/api"
const userStore = useUserStore()
const { currentUser, loggedIn } = storeToRefs(userStore)

async function loadInfo() {

  // Loading and checking the necessary info

  currentChannel.value = await fetch(`http://${apiurl}/global`, {
    headers: { "User-ID": currentUser.value.id.toString() }
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Cannot get channel info")
      }
    })
    .then(data => {
      return data.currentChannel
    })
    .catch(error => {
      console.log(error)
      return undefined
    })

  if (!currentChannel.value) {
    loadFailed.value = true
    return
  }

  channel.value = currentChannel.value.channel
  if (!channel.value) {
    loadFailed.value = true
    return
  }

  // If the function got here, that means everything was loaded successfully

  everythingLoaded.value = true

  // Now trying to connect to the channel's websocket and setting up the event listeners

  const serverUrl = `ws://${apiurl}/connect-to-channel/${props.channelId}`
  const socket = new WebSocket(serverUrl);

  socket.addEventListener("open", () => {
    isConnected.value = true
  })

  socket.addEventListener("close", () => {
    isConnected.value = false
  })

  socket.addEventListener("message", function (event) {
    console.log("New messages from server")
    console.log(event)

    try {
      const messages: Message[] = JSON.parse(event.data)
      receivedMessages.value.concat(messages)
    } catch (error) {
      console.log("Could not parse the received messages")
    }
  })
}

async function sendMessage() {
  console.log("sendMessage")
  if (!channel.value || currentUser.value.id == 0) {
    return
  }

  let text = messageText.value.trim()
  messageText.value = ""
  if (text.length < 1 || text.length > 1024) {
    return
  }

  const newMessage: Message = {
    id: 0,
    userId: currentUser.value.id,
    channelId: channel.value.id,
    text: text,
    sentAt: "",
  }
  console.log(newMessage)
}

loadInfo()
</script>

<style scoped>
.channel-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background-color: rgb(11, 20, 17);
  margin-bottom: 5px;
}
.channel-info {
  flex: 0 0 auto;
  background-color: rgb(25, 50, 50);
  margin: 5px;
}
.message-container {
  flex: 1 1 auto;
  min-height: 200px;
  background-color: rgb(25, 50, 50);
  margin: 0 5px 0 5px;
}
.input {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;

  min-height: 50px;
  margin: 5px;
  background-color: rgb(25, 50, 50);
}
.input input {
  flex: 1 1 auto;
  height: 50px;
  text-indent: 5px;
}
.input button {
  flex: 0 0 auto;
  height: 50px;
  width: 50px;
}
</style>
