<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card" style="width: 700px">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <i class="fas fa-plus-circle"></i>
          Add Course to {{ semesterName }}
        </p>
        <button class="delete" @click="closeModal"></button>
      </header>

      <section class="modal-card-body">
        <div class="search-box">
          <div class="field">
            <div class="control has-icons-left">
              <input
                class="input"
                type="text"
                placeholder="Search courses..."
                v-model="searchText"
              />
              <span class="icon is-left">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Course Status</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="selectedStatus">
                  <option value="scheduled">Scheduled</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="transfer">Transfer</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="selectedStatus === 'completed' || selectedStatus === 'failed'" class="field">
            <label class="label">Grade (Optional)</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g., A, B+, C" v-model="grade" />
            </div>
          </div>
        </div>

        <div class="course-list">
          <div v-if="filteredCourses.length === 0" class="has-text-centered has-text-grey py-5">
            No courses found
          </div>

          <div
            v-for="course in filteredCourses"
            :key="course.course_id"
            class="course-item"
            :class="{ selected: selectedCourse && selectedCourse.course_id === course.course_id }"
            @click="selectCourse(course)"
          >
            <div class="columns is-mobile is-vcentered">
              <div class="column">
                <strong>{{ course.course_code }}</strong> - {{ course.course_name }}
                <span
                  v-if="course.category"
                  class="category-badge"
                  :class="`category-${course.category}`"
                >
                  {{ course.categoryLabel }}
                </span>
                <div class="is-size-7 has-text-grey mt-1">
                  {{ course.credits }} credits
                  <span v-if="course.prerequisites">• Prereq: {{ course.prerequisites }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-success" :disabled="!selectedCourse" @click="addCourse">
          <i class="fas fa-plus"></i> Add Course
        </button>
        <button class="button" @click="closeModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  semesterName: {
    type: String,
    default: '',
  },
  courses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'add-course'])

const searchText = ref('')
const selectedCourse = ref(null)
const selectedStatus = ref('scheduled')
const grade = ref('')

const filteredCourses = computed(() => {
  const result = []

  for (let i = 0; i < props.courses.length; i++) {
    const course = props.courses[i]

    if (searchText.value) {
      const search = searchText.value.toLowerCase()
      const courseCode = course.course_code || ''
      const courseName = course.course_name || ''
      const text = (courseCode + ' ' + courseName).toLowerCase()

      if (!text.includes(search)) {
        continue
      }
    }

    result.push(course)
  }

  return result
})

const selectCourse = (course) => {
  selectedCourse.value = course
}

const addCourse = () => {
  if (selectedCourse.value) {
    emit('add-course', {
      course: selectedCourse.value,
      status: selectedStatus.value,
      grade: grade.value,
    })
    closeModal()
  }
}

const closeModal = () => {
  emit('close')
  selectedCourse.value = null
  selectedStatus.value = 'scheduled'
  grade.value = ''
  searchText.value = ''
}
</script>

<style scoped>
.modal-card-body {
  max-height: 60vh;
  overflow-y: auto;
}

.search-box {
  position: sticky;
  top: 0;
  background: white;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  z-index: 10;
  margin: -20px -20px 15px -20px;
}

.course-list {
  padding: 0 20px;
}

.course-item {
  padding: 12px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.course-item:hover {
  border-color: var(--green);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-item.selected {
  background-color: #e8f5e9;
  border-color: var(--green);
}

.category-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 3px;
  margin-left: 8px;
}

.category-major {
  background-color: #3273dc;
  color: white;
}

.category-minor {
  background-color: #48c774;
  color: white;
}

.category-core {
  background-color: #ffdd57;
  color: #363636;
}

.category-elective {
  background-color: #b5b5b5;
  color: white;
}
</style>
