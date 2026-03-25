<template>
  <router-view />
</template>

<script setup lang="ts">
// Your app logic here
</script>

<style>
:root {
  --green: #629d69;
  --purple: #69629d;
  --orange: #9d6962;
  color-scheme: light;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: black;
}

body {
  font-family: Georgia, serif;
  padding: 24px;
  min-height: 100vh;
  background-color: azure;
  color: #333;
}
</style>
