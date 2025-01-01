<script setup>
const login = () => {
  console.log("/login")
  fetch("/api/login")
}
const user = () => {
  console.log("request")
  fetch("/api/users")
}
</script>

<template>
  <div>
    <button @click="login">Login</button>
    <button @click="user">Users</button>
  </div>
</template>
