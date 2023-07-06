<template>
  <div class="nav-bar">

    <div v-if="parentChannel && parentChannel.channel" class="parent-channel-container">
      <div class="nav-bar-info">
        Parent channel:
      </div>

      <RouterLink
        :to="getChannelRoute(parentChannel)"
        custom
        v-slot="{ navigate }"
      >
        <div class="nav-bar-item" role="link" @click="navigate">
          {{ formatChannelName(parentChannel.channel.name) }}
          <div class="tooltip">{{ formatChannelTooltip(parentChannel.channel.name) }}</div>
        </div>
      </RouterLink>
    </div>

    <div v-if="parentChannel && parentChannel.channel" style="margin-top: 10px;" class="nav-bar-separator"></div>

    <div v-if="childChannels.length > 0" class="child-channel-container">
      <div class="nav-bar-info">
        Child channels:
      </div>

      <RouterLink
        v-for="childChannel, index in childChannels"
        :key="index"
        :to="getChannelRoute(childChannel)"
        custom
        v-slot="{ navigate }"
      >
        <div v-if="childChannel && childChannel.channel && index < childChannels.length-1" class="nav-bar-item" role="link" @click="navigate">
          {{ formatChannelName(childChannel.channel.name) }}
          <div class="tooltip">{{ formatChannelTooltip(childChannel.channel.name) }}</div>
        </div>
        <div v-else-if="childChannel && childChannel.channel && index === childChannels.length-1" style="margin-bottom: 10px;" class="nav-bar-item" role="link" @click="navigate">
          {{ formatChannelName(childChannel.channel.name) }}
          <div class="tooltip">{{ formatChannelTooltip(childChannel.channel.name) }}</div>
        </div>
      </RouterLink>
    </div>

    <div v-else class="child-channel-container"></div>
    <div class="nav-bar-separator"></div>

    <RouterLink
      :to="{ name: 'global' }"
      custom
      v-slot="{ navigate }"
    >
      <div class="nav-bar-item" role="link" @click="navigate">
        Global
        <div class="tooltip">Go to global<br>channel</div>
      </div>
    </RouterLink>

    <RouterLink
      :to="{ name: 'about' }"
      custom
      v-slot="{ navigate }"
    >
      <div class="nav-bar-item" role="link" @click="navigate">
        About
        <div class="tooltip">About this<br>website</div>
      </div>
    </RouterLink>

    <RouterLink
      :to="{ name: 'login' }"
      custom
      v-slot="{ navigate }"
    >
      <div v-if="loggedIn" class="nav-bar-item" style="margin-bottom: 10px" role="link" @click="(e) => { logout(); navigate(e); }">
        Log Out
        <div class="tooltip">Log out of<br>your account</div>
      </div>
      <div v-else class="nav-bar-item" style="margin-bottom: 10px" role="link" @click="navigate">
        Log In
        <div class="tooltip">Log into<br>your account</div>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';
import type { CurrentChannel } from '@/types/CurrentChannel';

const userStore = useUserStore()
const { loggedIn } = storeToRefs(userStore)
const { logout } = userStore
const channelStore = useChannelStore()
const { parentChannel, childChannels } = storeToRefs(channelStore)

// trim the name if necessary
function formatChannelName(name: string) {
  return name
}

// trim the name and add newlines if necessary
function formatChannelTooltip(name: string) {
  return `Go to ${name}`
}

function getChannelRoute(channel: CurrentChannel) {
  return {
    name: "channel",
    params: { channelId: channel.channelId}
  }
}
</script>

<style scoped>

/* nav bar */

.nav-bar {
  background-color: rgb(35, 70, 70);
  top: 0;
  bottom: 0;
  width: 150px;
  height: 100vh;
  position: fixed;

  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  transition:
    right 200ms ease-in-out,
    box-shadow 200ms ease-out,
    text-shadow 200ms ease-out,
    height 100ms ease-out;

  display: flex;
  flex-flow: column;
}
.nav-bar:hover {
  box-shadow: 0px 0px 5px 1px rgba(50, 200, 200, 0.5);
  right: 0;
}

.nav-bar-info {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  user-select: none;
}

.nav-bar-separator {
  flex: 0 0 auto;
  margin: 0 10px;
  background-color: rgba(0, 0, 0, 0.25);
  height: 5px;
  border-radius: 5px;
}

/* parent channel container */

.parent-channel-container {
  flex: 0 0 auto;
}

/* child channel container */

.child-channel-container {
  flex: 1 1 auto;
  min-height: 125px;
  overflow-y: scroll;
  overflow-x: visible;

  scrollbar-width: none;
}
.child-channel-container::-webkit-scrollbar {
  width: 0;
}

/* nav bar item */

.nav-bar-item {
  margin: 10px;
  margin-bottom: 0;
  width: 130px;
  height: 50px;
  background-color: rgb(45, 90, 90);
  border-radius: 10px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  transition: all 200ms ease-out;
  cursor: pointer;
  user-select: none;
  font-size: 15px;
  font-weight: bold;
  flex: 0 0 auto;

  position: relative;

  /* centering text */
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.nav-bar-item:hover {
  box-shadow: 0px 0px 5px 1px rgba(50, 200, 200, 0.5);
  text-shadow: 0px 0px 10px rgb(60, 255, 255);
}
.nav-bar-item .tooltip {
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  border-radius: 5px;
  text-shadow: none;
  padding: 5px;
  white-space: pre;

  transition: all 100ms ease-out;
  scale: 0;

  position: absolute;
  z-index: 1;
  right: 110%;
}
.nav-bar-item .tooltip::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -7px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.5);
}
.nav-bar-item:hover .tooltip {
  scale: 1;
}
.nav-bar-item .tooltip:hover {
  scale: 0;
}
</style>
