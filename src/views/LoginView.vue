<template>
  <div class="login-page">
    <nav class="navbar navbar-disabled">
      <div class="navbar-brand">
        <span class="navbar-item"><i class="fas fa-graduation-cap"></i> DegreeFlow</span>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <span class="navbar-item">Students</span>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <span class="button is-light">Logout</span>
          </div>
        </div>
      </div>
    </nav>

    <section class="section background-blur">
      <div class="container">
        <div class="box background-content">
          <h2 class="title is-4">Students</h2>
          <div class="box">
            <div class="columns is-vcentered">
              <div class="column">
                <strong>Stevens, John</strong>
                <p class="is-size-7">Computer Science</p>
              </div>
              <div class="column is-narrow">78 credits</div>
              <div class="column is-narrow">
                <button class="button is-small is-primary">View</button>
                <button class="button is-small is-light">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="login-modal">
      <div class="box login-card">
        <div class="has-text-centered mb-4">
          <i class="fas fa-graduation-cap fa-3x" style="color: var(--green)"></i>
          <h1 class="title is-3 mt-3">DegreeFlow</h1>
          <p class="subtitle is-6">Student Checksheet Management</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
              <input
                class="input"
                type="text"
                placeholder="Enter username"
                v-model="username"
                required
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left">
              <input
                class="input"
                type="password"
                placeholder="Enter password"
                v-model="password"
                required
              />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <div v-if="errorMessage" class="notification is-danger is-light">
            {{ errorMessage }}
          </div>

          <div class="field">
            <div class="control">
              <button
                type="submit"
                class="button is-primary is-fullwidth"
                :class="{ 'is-loading': isLoading }"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const LOGIN_ENDPOINT = 'https://checksheets.cscprof.com/auth/login'

const handleLogin = async () => {
  errorMessage.value = ''

  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('username', username.value)
    formData.append('password', password.value)

    const response = await axios.post(LOGIN_ENDPOINT, formData)

    const userData = response.data[0]

    console.log('Login response', userData)

    localStorage.setItem('authToken', userData.user_guid)
    localStorage.setItem('username', userData.username)
    localStorage.setItem('firstname', userData.firstname)
    localStorage.setItem('lastname', userData.lastname)
    router.push('/students')
  } catch (error) {
    console.error('Login error:', error)

    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Invalid username or password'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
}

.navbar-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.background-blur {
  filter: blur(4px);
  opacity: 0.3;
  pointer-events: none;
  user-select: none;
}

.background-content {
  background-color: whitesmoke;
  box-shadow: 0 2px 8px rgba(105, 98, 157, 0.4);
}

.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  pointer-events: none;
}

.login-card {
  max-width: 450px;
  width: 100%;
  pointer-events: auto;
  background-color: white;
  box-shadow: 0 8px 24px rgba(105, 98, 157, 0.6);
}

.button.is-primary {
  background-color: var(--green);
}

.button.is-primary:hover {
  background-color: #528a58;
}
</style>
