<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="navbar-item"><i class="fas fa-graduation-cap"></i> DegreeFlow</span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/students">Students</router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown" :class="{ 'is-active': isDropdownOpen }">
          <a class="navbar-link" @click="toggleDropdown">
            {{ username }} <i class="fas fa-user ml-2"></i>
          </a>
          <div class="navbar-dropdown is-right">
            <a class="navbar-item" @click="openChangePassword">
              <i class="fas fa-key"></i> Change Password
            </a>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="logout"> <i class="fas fa-sign-out-alt"></i> Logout </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Change Password Modal -->
  <div class="modal" :class="{ 'is-active': showPasswordModal }">
    <div class="modal-background" @click="closePasswordModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Change Password</p>
        <button class="delete" @click="closePasswordModal"></button>
      </header>
      <section class="modal-card-body">
        <form @submit.prevent="handleChangePassword">
          <div class="field">
            <label class="label">Current Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                v-model="passwordForm.currentPassword"
                placeholder="Enter current password"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label">New Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                v-model="passwordForm.newPassword"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Confirm New Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                v-model="passwordForm.confirmPassword"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <div v-if="passwordError" class="notification is-danger is-light">
            {{ passwordError }}
          </div>

          <div v-if="passwordSuccess" class="notification is-success is-light">
            {{ passwordSuccess }}
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-primary"
          @click="handleChangePassword"
          :class="{ 'is-loading': isChangingPassword }"
        >
          Change Password
        </button>
        <button class="button" @click="closePasswordModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref(localStorage.getItem('username') || 'User')
const isDropdownOpen = ref(false)
const showPasswordModal = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const openChangePassword = () => {
  showPasswordModal.value = true
  closeDropdown()
  // Reset form
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  passwordError.value = ''
  passwordSuccess.value = ''
}

const closePasswordModal = () => {
  showPasswordModal.value = false
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  // Validation
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }

  isChangingPassword.value = true

  try {
    // Make API call
    const response = await axios.put(
      'https://checksheets.cscprof.com/auth/passwordreset',
      {
        password: passwordForm.value.newPassword,
      },
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Success:', response)
    passwordSuccess.value = 'Password changed successfully!'

    // Close modal after a brief delay
    setTimeout(() => {
      closePasswordModal()
    }, 1500)
  } catch (error) {
    console.log('Error response:', error.response)
    passwordError.value = 'Failed to change password. Please try again.'
    console.error('Change password error:', error)
  } finally {
    isChangingPassword.value = false
  }
}

const logout = async () => {
  try {
    await axios.post('https://checksheets.cscprof.com/auth/logout', null, {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('firstname')
    localStorage.removeItem('lastname')

    router.push('/login')
    closeDropdown()
  }
}

// // Close dropdown when clicking outside
// const handleClickOutside = (event: MouseEvent) => {
//   const dropdown = document.querySelector('.navbar-item.has-dropdown')
//   if (dropdown && !dropdown.contains(event.target as Node)) {
//     closeDropdown()
//   }
// }

// onMounted(() => {
//   document.addEventListener('click', handleClickOutside)
// })

// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside)
// })
</script>

<style scoped>
.navbar {
  background-color: var(--green);
  color: black !important;
}

.navbar-link,
.navbar-item {
  color: black !important;
}

.navbar-link:hover,
.navbar-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: black !important;
}

.navbar-dropdown {
  background-color: white;
  border-top: 2px solid var(--green);
}

.navbar-dropdown .navbar-item {
  color: #333 !important;
  padding: 0.75rem 1rem;
}

.navbar-dropdown .navbar-item:hover {
  background-color: #f5f5f5;
}

.button.is-primary {
  background-color: var(--green);
}

.button.is-primary:hover {
  background-color: #528a58;
}
</style>
