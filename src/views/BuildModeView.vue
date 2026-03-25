<template>
  <div>
    <NavBar />

    <section class="section">
      <div class="container">
        <!-- Header Box -->
        <div class="box">
          <h2 class="title is-4">{{ student.name }}</h2>
          <p class="subtitle is-6">Edit and Create Academic Plan</p>
        </div>

        <!-- Edit Form Box -->
        <div class="box">
          <div class="field">
            <label class="label">Major</label>
            <div class="control">
              <div class="select">
                <select v-model="student.major">
                  <option>Computer Science</option>
                  <option>Cybersecurity</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Minor</label>
            <div class="control">
              <div class="select">
                <select v-model="student.minor">
                  <option>Data Science</option>
                  <option>Software Development</option>
                </select>
              </div>
            </div>
          </div>

          <br />

          <router-link :to="`/checksheet/${studentId}`" class="button is-light">
            ← Back to Checksheet
          </router-link>
          <button class="button is-primary" @click="saveChanges">Save</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const studentId = route.params.id as string

// Mock student data (will be replaced with API calls later)
const student = ref({
  name: 'Stevens, John',
  major: 'Computer Science',
  minor: 'Data Science',
})

const saveChanges = () => {
  // Add save logic here later (API call)
  console.log('Saving changes:', student.value)

  // Navigate back to checksheet after saving
  router.push(`/checksheet/${studentId}`)
}
</script>

<style scoped>
.button.is-primary {
  background-color: var(--green);
}

.box {
  background-color: whitesmoke;
  box-shadow: 0 2px 8px rgba(105, 98, 157, 0.4);
}
</style>
