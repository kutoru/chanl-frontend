<template>
  <div class="user-bar">
    <div v-for="i in [1, 2, 3, 4, 5]" :key="i">
      <div class="nav-bar-item" style="margin-bottom: 0;">
        Item {{ i }}
        <div class="tooltip">Tooltip {{ i }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.user-bar {
  background-color: rgb(35, 70, 70);
  top: 0;
  bottom: 0;
  width: 150px;
  height: 100vh;
  position: fixed;

  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  transition:
    left 200ms ease-in-out,
    box-shadow 200ms ease-out,
    text-shadow 200ms ease-out,
    height 100ms ease-out;

  display: flex;
  flex-flow: column;
}
.user-bar:hover {
  box-shadow: 0px 0px 5px 1px rgba(50, 200, 200, 0.5);
  left: 0;
}
.nav-bar-item {
  margin: 10px;
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
  left: 110%;
}
.nav-bar-item .tooltip::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -7px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent rgba(0, 0, 0, 0.5) transparent transparent;
}
.nav-bar-item:hover .tooltip {
  scale: 1;
}
.nav-bar-item .tooltip:hover {
  scale: 0;
}
</style>
