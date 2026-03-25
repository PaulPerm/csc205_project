<template>
  <div>
    <NavBar />

    <section class="section">
      <div class="container">
        <!-- Header -->
        <div class="columns is-vcentered mb-4">
          <div class="column">
            <h2 class="title is-4">Students</h2>
          </div>
          <div class="column is-narrow">
            <button class="button is-primary" @click="openAddStudentModal">
              <i class="fas fa-plus"></i> Add Student
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div class="columns mb-4">
          <div class="column">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Search students..."
                v-model="searchText"
              />
            </div>
          </div>
          <div class="column is-narrow">
            <div class="select">
              <select v-model="sortBy">
                <option value="name">Sort by: Name</option>
                <option value="major">Sort by: Major</option>
                <option value="credits">Sort by: Credits</option>
              </select>
            </div>
          </div>
          <div class="column is-narrow">
            <div class="field">
              <input
                id="switchInactive"
                type="checkbox"
                class="switch is-rounded"
                v-model="showInactive"
              />
              <label for="switchInactive">Show Inactive</label>
            </div>
          </div>
        </div>

        <!-- Student List -->
        <div v-for="student in filteredStudents" :key="student.student_id" class="box">
          <div class="columns is-vcentered">
            <div class="column">
              <strong>{{ student.lastname }}, {{ student.firstname }}</strong>
              <p class="is-size-7">
                {{ student.majors.length > 0 ? student.majors[0] : 'No major assigned' }}
              </p>
            </div>
            <div class="column is-narrow">{{ student.credits.length }} credits</div>
            <div class="column is-narrow">
              <router-link
                :to="`/checksheet/${student.student_id}`"
                class="button is-small is-primary"
              >
                View
              </router-link>
              <router-link :to="`/build/${student.student_id}`" class="button is-small is-light">
                Edit
              </router-link>
              <button
                class="button is-small is-danger"
                @click="removeStudent(student.student_id, student.is_active)"
              >
                {{ student.is_active === 1 ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="modal" :class="{ 'is-active': showAddStudentModal }">
      <div class="modal-background" @click="closeAddStudentModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Student</p>
          <button class="delete" @click="closeAddStudentModal"></button>
        </header>
        <section class="modal-card-body">
          <form @submit.prevent="handleAddStudent">
            <div class="field">
              <label class="label">First Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="newStudent.firstname"
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Last Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="newStudent.lastname"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <!-- <div class="field">
              <label class="label">Major</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="newStudent.major" required>
                    <option value="">Select major</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Minor (Optional)</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="newStudent.minor">
                    <option value="">No minor</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>
            </div> -->

            <div v-if="addStudentError" class="notification is-danger is-light">
              {{ addStudentError }}
            </div>

            <div v-if="addStudentSuccess" class="notification is-success is-light">
              {{ addStudentSuccess }}
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-primary"
            @click="handleAddStudent"
            :class="{ 'is-loading': isAddingStudent }"
          >
            Add Student
          </button>
          <button class="button" @click="closeAddStudentModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const searchText = ref('')
const sortBy = ref('name')
const showInactive = ref(false)

const students = ref(null)
const error = ref(null)
const endpoint = 'https://checksheets.cscprof.com/students'

const showAddStudentModal = ref(false)
const isAddingStudent = ref(false)
const addStudentError = ref('')
const addStudentSuccess = ref('')

const newStudent = ref({
  firstname: '',
  lastname: '',
  email: '',
})
async function getStudents() {
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
    students.value = response.data
  } catch (err) {
    error.value = err
    console.error('Error fetching', err)
  }
}

onMounted(() => {
  getStudents()
})

const removeStudent = async (studentId, currentStatus) => {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1
    const response = await axios.put(
      'https://checksheets.cscprof.com/students',
      {
        student_id: studentId,
        is_active: newStatus,
      },
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('Student status changed', response.data)
    await getStudents()
  } catch (error) {
    console.error('Error on updating status', error)
  }
}

const filteredStudents = computed(() => {
  if (!students.value) {
    return []
  }

  let result = students.value

  if (searchText.value) {
    result = result.filter((student) => {
      let searchInfo = student.firstname + ' ' + student.lastname + ' '
      if (student.majors.length > 0) {
        searchInfo = searchInfo + student.majors[0]
      }
      searchInfo = searchInfo.toLowerCase()
      const searchInput = searchText.value.toLowerCase()

      return searchInfo.includes(searchInput)
    })
  }
  if (!showInactive.value) {
    result = result.filter((student) => {
      return student.is_active === 1
    })
  } else {
    result = result.filter((student) => {
      return student.is_active === 0
    })
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => {
      const nameA = a.lastname + ', ' + a.firstname
      const nameB = b.lastname + ', ' + b.firstname
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
  } else if (sortBy.value === 'major') {
    result.sort((a, b) => {
      let majorA = ''
      let majorB = ''
      if (a.majors.length > 0) {
        majorA = a.majors[0]
      }
      if (b.majors.length > 0) {
        majorB = b.majors[0]
      }
      if (majorA < majorB) {
        return -1
      }
      if (majorA > majorB) {
        return 1
      }
      return 0
    })
  } else if (sortBy.value === 'credits') {
    result.sort((a, b) => {
      return b.credits.length - a.credits.length
    })
  }
  return result
})
const openAddStudentModal = () => {
  showAddStudentModal.value = true
  newStudent.value = {
    firstname: '',
    lastname: '',
    email: '',
  }
  addStudentError.value = ''
  addStudentSuccess.value = ''
}
const closeAddStudentModal = () => {
  showAddStudentModal.value = false
}
const handleAddStudent = async () => {
  addStudentError.value = ''
  addStudentSuccess.value = ''

  if (!newStudent.value.firstname || !newStudent.value.lastname) {
    addStudentError.value = 'Please fill out all required information'
    return
  }
  isAddingStudent.value = true
  try {
    const response = await axios.post(
      'https://checksheets.cscprof.com/students',
      {
        firstname: newStudent.value.firstname,
        lastname: newStudent.value.lastname,
        preferred_name: newStudent.value.firstname,
        email:
          '${newStudent.value.firstname.charAt(0).toLowerCase()}${newStudent.value.lastname.substring(0, 6).toLowerCase()}@geneva.edu',
        math_proficient: 0,
        reading_proficient: 0,
        foreign_language: 0,
        matriculation_year: 2000,
        is_active: 1,
      },
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('Student created:', response.data)
    addStudentSuccess.value = 'Student added successfully!'

    await getStudents()

    setTimeout(() => {
      closeAddStudentModal()
    }, 750)
  } catch (error) {
    addStudentError.value = 'Failed to add student.'
    console.error('Add student error:', error)
  } finally {
    isAddingStudent.value = false
  }
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
