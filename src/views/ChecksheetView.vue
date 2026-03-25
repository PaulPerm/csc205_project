<template>
  <div>
    <NavBar />

    <section class="section">
      <div class="container">
        <!-- Student Info Box -->
        <div class="box">
          <h2 class="title is-4">{{ student.name }} — {{ student.major }}</h2>
          <p class="subtitle is-6">Four-Year Academic Plan</p>

          <div class="tags">
            <span class="tag is-info">Enrolled</span>
            <span class="tag is-success">Completed</span>
            <span class="tag is-danger">Failed</span>
            <strong class="ml-auto">{{ creditsEarned }} / {{ totalCredits }} Credits Earned</strong>
          </div>

          <p class="mt-3"><strong>Overall Progress</strong></p>
          <progress class="progress" :value="creditsEarned" :max="totalCredits">
            {{ progressPercentage }}%
          </progress>

          <div class="buttons mt-3">
            <router-link :to="`/build/${studentId}`" class="button is-primary">
              Enter Build Mode
            </router-link>
            <button class="button is-light" @click="printChecksheet">Print</button>
            <router-link to="/students" class="button is-light"> Back to Students </router-link>
          </div>
        </div>

        <!-- Metrics Box -->
        <div class="box">
          <h3 class="title is-5">Metrics</h3>
          <div class="columns">
            <div class="column">
              <p class="heading">Completed</p>
              <p class="title">{{ metrics.completed }}</p>
            </div>
            <div class="column">
              <p class="heading">Enrolled</p>
              <p class="title">{{ metrics.enrolled }}</p>
            </div>
            <div class="column">
              <p class="heading">Remaining</p>
              <p class="title">{{ metrics.remaining }}</p>
            </div>
          </div>
        </div>

        <!-- Year Boxes -->
        <div v-for="year in years" :key="year.number" class="box">
          <h3 class="title is-5">Year {{ year.number }}</h3>
          <div class="columns">
            <!-- Fall Semester -->
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Fall Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ year.fall.totalCredits }} Credits
                </div>
              </div>

              <div v-for="course in year.fall.courses" :key="course.id" class="box">
                <div class="columns is-vcentered is-mobile">
                  <div class="column is-narrow">
                    <input
                      type="radio"
                      :name="`course-${course.id}`"
                      :checked="course.status === 'completed'"
                    />
                  </div>
                  <div class="column">
                    <strong>{{ course.code }}</strong>
                    <p class="is-size-7">{{ course.name }}</p>
                  </div>
                  <div class="column is-narrow">{{ course.credits }} cr</div>
                </div>
              </div>
            </div>

            <!-- Spring Semester -->
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Spring Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ year.spring.totalCredits }} Credits
                </div>
              </div>

              <div v-for="course in year.spring.courses" :key="course.id" class="box">
                <div class="columns is-vcentered is-mobile">
                  <div class="column is-narrow">
                    <input
                      type="radio"
                      :name="`course-${course.id}`"
                      :checked="course.status === 'completed'"
                    />
                  </div>
                  <div class="column">
                    <strong>{{ course.code }}</strong>
                    <p v-if="course.name" class="is-size-7">{{ course.name }}</p>
                  </div>
                  <div class="column is-narrow">{{ course.credits }} cr</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const studentId = route.params.id as string

// Mock student data (will be replaced with API calls later)
const student = ref({
  name: 'John Stevens',
  major: 'Computer Science: Data Science',
})

const totalCredits = ref(121)
const creditsEarned = ref(0)

const progressPercentage = computed(() =>
  Math.round((creditsEarned.value / totalCredits.value) * 100),
)

const metrics = computed(() => ({
  completed: creditsEarned.value,
  enrolled: 0,
  remaining: totalCredits.value - creditsEarned.value,
}))

// Mock course data structure
const years = ref([
  {
    number: 1,
    fall: {
      totalCredits: 14,
      courses: [
        {
          id: 'csc110-f1',
          code: 'CSC 110',
          name: 'Introduction to Computer Science',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'mat151-f1', code: 'MAT 151', name: 'Calculus I', credits: 4, status: 'scheduled' },
        {
          id: 'eng101-f1',
          code: 'ENG 101',
          name: 'English Composition I',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'gen101-f1',
          code: 'GEN 101',
          name: 'First Year Seminar',
          credits: 1,
          status: 'scheduled',
        },
        {
          id: 'bib101-f1',
          code: 'BIB 101',
          name: 'Old Testament Survey',
          credits: 3,
          status: 'scheduled',
        },
      ],
    },
    spring: {
      totalCredits: 17,
      courses: [
        {
          id: 'csc120-s1',
          code: 'CSC 120',
          name: 'Programming I',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'mat152-s1', code: 'MAT 152', name: 'Calculus II', credits: 4, status: 'scheduled' },
        {
          id: 'eng102-s1',
          code: 'ENG 102',
          name: 'English Composition II',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'phy211-s1', code: 'PHY 211', name: 'Physics I', credits: 4, status: 'scheduled' },
        {
          id: 'bib102-s1',
          code: 'BIB 102',
          name: 'New Testament Survey',
          credits: 3,
          status: 'scheduled',
        },
      ],
    },
  },
  {
    number: 2,
    fall: {
      totalCredits: 6,
      courses: [
        {
          id: 'csc205-f2',
          code: 'CSC 205',
          name: 'HCI Design & Programming',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc363-f2',
          code: 'CSC 363',
          name: 'Database Systems',
          credits: 3,
          status: 'scheduled',
        },
      ],
    },
    spring: {
      totalCredits: 7,
      courses: [
        {
          id: 'csc206-s2',
          code: 'CSC 206',
          name: 'Web Programming',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc251-s2',
          code: 'CSC 251',
          name: 'Networks & Security',
          credits: 4,
          status: 'scheduled',
        },
      ],
    },
  },
  {
    number: 3,
    fall: {
      totalCredits: 10,
      courses: [
        {
          id: 'hum303-f3',
          code: 'HUM 303',
          name: 'Perspectives: Faith',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc407-f3',
          code: 'CSC 407',
          name: 'Web Engineering',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc425-f3',
          code: 'CSC 425',
          name: 'Op Sys & Architecture',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'ped103-f3',
          code: 'PED 103',
          name: 'Physical Fitness',
          credits: 1,
          status: 'scheduled',
        },
      ],
    },
    spring: {
      totalCredits: 15,
      courses: [
        {
          id: 'bib300-s3',
          code: 'BIB 300',
          name: 'Foundations of Chr Thought',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc203-s3',
          code: 'CSC 203',
          name: 'Software Engineering',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'csc204-s3', code: 'CSC 204', name: 'Algorithms', credits: 3, status: 'scheduled' },
        {
          id: 'csc364-s3',
          code: 'CSC 364',
          name: 'Front-End Development',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc408-s3',
          code: 'CSC 408',
          name: 'Mobile & Cloud Applications',
          credits: 3,
          status: 'scheduled',
        },
      ],
    },
  },
  {
    number: 4,
    fall: {
      totalCredits: 12,
      courses: [
        {
          id: 'pol352-f4',
          code: 'POL 352',
          name: 'Great Issues in Politics',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc483-f4',
          code: 'CSC 483',
          name: 'Senior Software Project',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'elec1-f4', code: 'Elective', name: '', credits: 3, status: 'scheduled' },
        { id: 'elec2-f4', code: 'Elective', name: '', credits: 3, status: 'scheduled' },
      ],
    },
    spring: {
      totalCredits: 11,
      courses: [
        {
          id: 'csc311-s4',
          code: 'CSC 311',
          name: 'Cyber Ethics and Cyber Law',
          credits: 2,
          status: 'scheduled',
        },
        {
          id: 'csc484-s4',
          code: 'CSC 484',
          name: 'Senior Software Project',
          credits: 3,
          status: 'scheduled',
        },
        {
          id: 'csc441-s4',
          code: 'CSC 441',
          name: 'Project Management',
          credits: 3,
          status: 'scheduled',
        },
        { id: 'elec3-s4', code: 'Elective', name: '', credits: 3, status: 'scheduled' },
      ],
    },
  },
])

const printChecksheet = () => {
  window.print()
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

.progress {
  background-color: #e0e0e0;
}

.progress::-webkit-progress-value {
  background-color: var(--green);
}

.progress::-moz-progress-bar {
  background-color: var(--green);
}

.ml-auto {
  margin-left: auto;
}
</style>
