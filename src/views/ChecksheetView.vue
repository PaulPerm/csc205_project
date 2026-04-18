<template>
  <div>
    <NavBar />

    <section class="section">
      <div class="container">
        <div class="box">
          <h2 class="title is-4" v-if="student">
            {{ student.lastname }}, {{ student.firstname }} —
            {{ student.majors.length > 0 ? student.majors[0].major_name : 'No major assigned' }}
          </h2>
          <h2 class="title is-4" v-else>Loading...</h2>
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

        <div v-if="transferCourses.length > 0" class="box">
          <h3 class="title is-5"><i class="fas fa-exchange-alt"></i> Transfer Credits</h3>
          <div class="columns is-vcentered mb-2">
            <div class="column"><strong>Transfer Courses</strong></div>
            <div class="column is-narrow has-text-right">
              {{ calculateCredits(transferCourses) }} Credits
            </div>
          </div>

          <div
            v-for="course in transferCourses"
            :key="course.course_student_id"
            class="box course-card"
          >
            <div class="columns is-vcentered is-mobile">
              <div class="column">
                <strong>{{ course.course.course_code }}</strong> - {{ course.course.course_name }}
                <div class="is-size-7 has-text-grey mt-1">{{ course.course.credits }} credits</div>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <h3 class="title is-5">Year 1</h3>
          <div class="columns">
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Fall Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year1Fall) }} Credits
                </div>
              </div>

              <div v-if="year1Fall.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year1Fall"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Spring Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year1Spring) }} Credits
                </div>
              </div>

              <div v-if="year1Spring.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year1Spring"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <h3 class="title is-5">Year 2</h3>
          <div class="columns">
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Fall Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year2Fall) }} Credits
                </div>
              </div>

              <div v-if="year2Fall.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year2Fall"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Spring Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year2Spring) }} Credits
                </div>
              </div>

              <div v-if="year2Spring.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year2Spring"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <h3 class="title is-5">Year 3</h3>
          <div class="columns">
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Fall Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year3Fall) }} Credits
                </div>
              </div>

              <div v-if="year3Fall.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year3Fall"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Spring Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year3Spring) }} Credits
                </div>
              </div>

              <div v-if="year3Spring.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year3Spring"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <h3 class="title is-5">Year 4</h3>
          <div class="columns">
            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Fall Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year4Fall) }} Credits
                </div>
              </div>

              <div v-if="year4Fall.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year4Fall"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="columns is-vcentered mb-2">
                <div class="column"><strong>Spring Semester</strong></div>
                <div class="column is-narrow has-text-right">
                  {{ calculateCredits(year4Spring) }} Credits
                </div>
              </div>

              <div v-if="year4Spring.length === 0" class="has-text-grey has-text-centered py-4">
                No courses scheduled
              </div>
              <div
                v-for="course in year4Spring"
                :key="course.course_student_id"
                class="box course-card"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <div class="is-size-7 has-text-grey mt-1">
                      {{ course.course.credits }} credits
                    </div>
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const studentId = route.params.id

const student = ref(null)
const error = ref(null)

const transferCourses = ref([])
const year1Fall = ref([])
const year1Spring = ref([])
const year2Fall = ref([])
const year2Spring = ref([])
const year3Fall = ref([])
const year3Spring = ref([])
const year4Fall = ref([])
const year4Spring = ref([])

const totalCredits = ref(121)

const creditsEarned = computed(() => {
  let total = 0

  transferCourses.value.forEach((c) => (total += c.course.credits || 0))
  year1Fall.value.forEach((c) => (total += c.course.credits || 0))
  year1Spring.value.forEach((c) => (total += c.course.credits || 0))
  year2Fall.value.forEach((c) => (total += c.course.credits || 0))
  year2Spring.value.forEach((c) => (total += c.course.credits || 0))
  year3Fall.value.forEach((c) => (total += c.course.credits || 0))
  year3Spring.value.forEach((c) => (total += c.course.credits || 0))
  year4Fall.value.forEach((c) => (total += c.course.credits || 0))
  year4Spring.value.forEach((c) => (total += c.course.credits || 0))

  return total
})

const progressPercentage = computed(() =>
  Math.round((creditsEarned.value / totalCredits.value) * 100),
)

const metrics = computed(() => ({
  completed: creditsEarned.value,
  enrolled: 0,
  remaining: totalCredits.value - creditsEarned.value,
}))

const calculateCredits = (courses) => {
  let total = 0
  for (let i = 0; i < courses.length; i++) {
    total += courses[i].course.credits || 0
  }
  return total
}

async function getStudent() {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/students', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })

    const students = response.data
    student.value = students.find((s) => s.student_id === parseInt(studentId))

    console.log('Student data:', student.value)
  } catch (err) {
    error.value = err
    console.error('Error fetching student:', err)
  }
}

async function getStudentCourses() {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/studentcourses', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
      params: {
        student_id: studentId,
      },
    })

    console.log('Student courses:', response.data)
    console.log('First course:', response.data[0])
    // Clear all semester arrays first
    transferCourses.value = []
    year1Fall.value = []
    year1Spring.value = []
    year2Fall.value = []
    year2Spring.value = []
    year3Fall.value = []
    year3Spring.value = []
    year4Fall.value = []
    year4Spring.value = []

    // Organize courses into semesters
    for (let i = 0; i < response.data.length; i++) {
      const courseStudent = response.data[i]

      // Add status and category info for display
      courseStudent.status = 'scheduled'
      courseStudent.statusLabel = 'Scheduled'
      courseStudent.category = 'major'
      courseStudent.categoryLabel = 'Major'

      const year = courseStudent.year
      const semesterId = courseStudent.semester_id

      if (year === 1) {
        if (semesterId === 1) {
          year1Fall.value.push(courseStudent)
        } else {
          year1Spring.value.push(courseStudent)
        }
      } else if (year === 2) {
        if (semesterId === 1) {
          year2Fall.value.push(courseStudent)
        } else {
          year2Spring.value.push(courseStudent)
        }
      } else if (year === 3) {
        if (semesterId === 1) {
          year3Fall.value.push(courseStudent)
        } else {
          year3Spring.value.push(courseStudent)
        }
      } else if (year === 4) {
        if (semesterId === 1) {
          year4Fall.value.push(courseStudent)
        } else {
          year4Spring.value.push(courseStudent)
        }
      } else {
        transferCourses.value.push(courseStudent)
      }
    }
  } catch (err) {
    error.value = err
    console.error('Error fetching courses:', err)
  }
}
onMounted(() => {
  getStudent()
  getStudentCourses()
})

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

.course-card {
  background-color: white;
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
