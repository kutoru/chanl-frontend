<template>
  <div v-if="everythingLoaded && currentChannel && channel" class="channel-container">
    <ChannelInfoContainer :is-connected="isConnected" />
    <ChannelMessageContainer :messages="receivedMessages" />
    <ChannelInputContainer :is-connected="isConnected" @submit-message-text="(msg) => sendMessage(msg)" />
  </div>

  <h2 style="margin: 20px;" v-else-if="loadFailed">Either could not connect or could not load the necessary information</h2>
  <h2 style="margin: 20px;" v-else>Loading the channel...</h2>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";
import ChannelInfoContainer from "@/components/chat/ChannelInfoContainer.vue";
import ChannelMessageContainer from "@/components/chat/ChannelMessageContainer.vue";
import ChannelInputContainer from "@/components/chat/ChannelInputContainer.vue";
import type { Message } from "@/types/Message";

const props = defineProps({
  channelId: { type: Number, required: true },
})

const everythingLoaded = ref<boolean>(false)
const loadFailed = ref<boolean>(false)
const isConnected = ref<boolean>(false)
const receivedMessages = ref<Message[]>([])

const apiurl = "192.168.1.12:4000/api"
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const channelStore = useChannelStore()
const { currentChannel, channel } = storeToRefs(channelStore)
const { loadChannel } = channelStore

async function loadInfo() {

  // Loading and checking the necessary info

  const _ = await loadChannel(props.channelId, currentUser.value.id)

  if (!currentChannel.value) {
    loadFailed.value = true
    return
  }

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
      for (let i = messages.length - 1; i >= 0; i--) {
        receivedMessages.value.unshift(messages[i])
      }
    } catch (error) {
      console.log("Could not parse the received messages")
      console.log(error)
    }
  })
}

function sendMessage(text: string) {
  if (!channel.value || currentUser.value.id == 0) {
    return
  }

  const newMessage: Message = {
    id: 0,
    userId: currentUser.value.id,
    channelId: channel.value.id,
    text: text,
    sentAt: "2023.05.26 15:36:07",
    userName: currentUser.value.name,
  }
  receivedMessages.value.unshift(newMessage)
}

loadInfo()

// test
// for (let i = 1; i <= 15; i++) {
//   receivedMessages.value.unshift({ id: i, userId: 1, channelId: 1, text: "This is a message text", sentAt: "2023.05.26 15:36:07", userName: "Cool_user_1234" })
// }
</script>

<style scoped>
.channel-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  /* background-color: rgb(15, 30, 25); */
  /* margin: 5px 0 5px 0; */
  overflow: hidden;
}
</style>
