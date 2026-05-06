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
            <span class="tag is-light" style="border: 2px solid #ddd">Scheduled</span>
            <span class="tag is-info" style="border: 2px solid #00d1b2">In Progress</span>
            <span class="tag is-success" style="border: 2px solid #48c774">Completed</span>
            <span class="tag is-danger" style="border: 2px solid #ff3860">Failed</span>
            <strong class="ml-auto">{{ creditsEarned }} / {{ totalCredits }} Credits Earned</strong>
          </div>

          <div class="buttons mt-3">
            <router-link :to="`/build/${studentId}`" class="button is-primary">
              Enter Build Mode
            </router-link>
            <router-link :to="`/print-schedule/${studentId}`" class="button is-primary">
              <i class="fas fa-print"></i> Print Schedule
            </router-link>

            <router-link to="/students" class="button is-light"> Back to Students </router-link>
          </div>
        </div>

        <div class="box" @click="metricsExpanded = !metricsExpanded" style="cursor: pointer">
          <div class="metrics-header">
            <h3 class="title is-5">
              Metrics
              <i
                :class="metricsExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                style="margin-left: 10px; font-size: 0.8rem"
              ></i>
            </h3>
          </div>

          <div v-if="metricsExpanded">
            <div class="columns">
              <div class="column">
                <p class="heading">Completed</p>
                <p class="title">{{ metrics.completed }}</p>
              </div>
              <div class="column">
                <p class="heading">In Progress</p>
                <p class="title">{{ metrics.inProgress }}</p>
              </div>
              <div class="column">
                <p class="heading">Scheduled</p>
                <p class="title">{{ metrics.scheduled }}</p>
              </div>
              <div class="column">
                <p class="heading">Remaining</p>
                <p class="title">{{ metrics.remaining }}</p>
              </div>
            </div>
            <p class="mt-3"><strong>Overall Progress</strong></p>
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progressChunk major"
                  :style="{ width: creditBreakdown.majorPercent + '%' }"
                ></div>
                <div
                  class="progressChunk minor"
                  :style="{ width: creditBreakdown.minorPercent + '%' }"
                ></div>
                <div
                  class="progressChunk core"
                  :style="{ width: creditBreakdown.corePercent + '%' }"
                ></div>
                <div
                  class="progressChunk elective"
                  :style="{ width: creditBreakdown.electivePercent + '%' }"
                ></div>
              </div>
              <div class="progress-label">{{ creditsEarned }} / {{ totalCredits }} Credits</div>
            </div>
            <div class="category-legend">
              <span class="legend-item">
                <span class="legend-color major"></span>
                Major: {{ creditBreakdown.major }} credits
              </span>
              <span class="legend-item">
                <span class="legend-color minor"></span>
                Minor: {{ creditBreakdown.minor }} credits
              </span>
              <span class="legend-item">
                <span class="legend-color core"></span>
                Core: {{ creditBreakdown.core }} credits
              </span>
              <span class="legend-item">
                <span class="legend-color elective"></span>
                Elective: {{ creditBreakdown.elective }} credits
              </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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
                :class="`status-${course.status}`"
                @click="toggleCourseStatus(course)"
                style="cursor: pointer"
              >
                <div class="columns is-vcentered is-mobile">
                  <div class="column">
                    <strong>{{ course.course.course_code }}</strong> -
                    {{ course.course.course_name }}
                    <span class="category-badge" :class="`category-${course.category}`">
                      {{ course.categoryLabel }}
                    </span>
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

const metricsExpanded = ref(true)
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

const majorCourses = ref([])
const minorCourses = ref([])
const coreCourses = ref([])

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

const getMajorCourses = async () => {
  if (!student.value || !student.value.majors[0]) {
    return
  }

  try {
    const response = await axios.get(
      `https://checksheets.cscprof.com/courses/major/${student.value.majors[0].major_id}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )
    majorCourses.value = response.data
  } catch (error) {
    console.error('Error fetching major courses:', error)
  }
}

const getMinorCourses = async () => {
  if (!student.value || !student.value.minors[0]) {
    return
  }

  try {
    const response = await axios.get(
      `https://checksheets.cscprof.com/courses/minor/${student.value.minors[0].minor_id}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )
    minorCourses.value = response.data
  } catch (error) {
    console.error('Error fetching minor courses:', error)
  }
}

const getCoreCourses = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/courses/core/prereqs', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
    coreCourses.value = response.data
  } catch (error) {
    console.error('Error fetching core courses:', error)
  }
}

const getCourseCategory = (courseId) => {
  if (majorCourses.value.length > 0) {
    const majorCourseIds = majorCourses.value[0].courses.map((c) => c.course_id)
    if (majorCourseIds.includes(courseId)) {
      return { category: 'major', categoryLabel: 'Major' }
    }
  }

  if (minorCourses.value.length > 0) {
    const minorCourseIds = minorCourses.value[0].courses.map((c) => c.course_id)
    if (minorCourseIds.includes(courseId)) {
      return { category: 'minor', categoryLabel: 'Minor' }
    }
  }

  for (let i = 0; i < coreCourses.value.length; i++) {
    if (coreCourses.value[i].course_id === courseId) {
      return { category: 'core', categoryLabel: 'Core' }
    }
  }

  return { category: 'elective', categoryLabel: 'Elective' }
}
const metrics = computed(() => {
  let completed = 0
  let inProgress = 0
  let scheduled = 0

  const allCourses = []
  for (let i = 0; i < transferCourses.value.length; i++) {
    allCourses.push(transferCourses.value[i])
  }
  for (let i = 0; i < year1Fall.value.length; i++) {
    allCourses.push(year1Fall.value[i])
  }
  for (let i = 0; i < year1Spring.value.length; i++) {
    allCourses.push(year1Spring.value[i])
  }
  for (let i = 0; i < year2Fall.value.length; i++) {
    allCourses.push(year2Fall.value[i])
  }
  for (let i = 0; i < year2Spring.value.length; i++) {
    allCourses.push(year2Spring.value[i])
  }
  for (let i = 0; i < year3Fall.value.length; i++) {
    allCourses.push(year3Fall.value[i])
  }
  for (let i = 0; i < year3Spring.value.length; i++) {
    allCourses.push(year3Spring.value[i])
  }
  for (let i = 0; i < year4Fall.value.length; i++) {
    allCourses.push(year4Fall.value[i])
  }
  for (let i = 0; i < year4Spring.value.length; i++) {
    allCourses.push(year4Spring.value[i])
  }

  for (let i = 0; i < allCourses.length; i++) {
    const course = allCourses[i]
    const credits = course.course.credits || 0
    const statusName = course.course_status.course_status

    if (statusName === 'Passed' || statusName === 'Transfer') {
      completed += credits
    } else if (statusName === 'In-Progress') {
      inProgress += credits
    } else if (statusName === 'Scheduled') {
      scheduled += credits
    }
  }

  return {
    completed: completed,
    inProgress: inProgress,
    scheduled: scheduled,
    remaining: totalCredits.value - completed,
  }
})

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

const getStudentCourses = async () => {
  try {
    const response = await axios.get(
      `https://checksheets.cscprof.com/studentcourses/${studentId}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )

    console.log('Student courses:', response.data)
    console.log('First course:', response.data[0])

    transferCourses.value = []
    year1Fall.value = []
    year1Spring.value = []
    year2Fall.value = []
    year2Spring.value = []
    year3Fall.value = []
    year3Spring.value = []
    year4Fall.value = []
    year4Spring.value = []

    for (let i = 0; i < response.data.length; i++) {
      const courseStudent = response.data[i]

      const statusName = courseStudent.course_status.course_status

      let status = 'scheduled'
      let statusLabel = 'Scheduled'

      if (statusName === 'Passed') {
        status = 'completed'
        statusLabel = 'Completed'
      } else if (statusName === 'In-Progress') {
        status = 'inprogress'
        statusLabel = 'In Progress'
      } else if (statusName === 'Failed') {
        status = 'failed'
        statusLabel = 'Failed'
      } else if (statusName === 'Transfer') {
        status = 'transfer'
        statusLabel = 'Transfer'
      } else if (statusName === 'Scheduled') {
        status = 'scheduled'
        statusLabel = 'Scheduled'
      } else if (statusName === 'Audit') {
        status = 'audit'
        statusLabel = 'Audit'
      }

      courseStudent.status = status
      courseStudent.statusLabel = statusLabel

      const categoryData = getCourseCategory(courseStudent.course_id)
      courseStudent.category = categoryData.category
      courseStudent.categoryLabel = categoryData.categoryLabel

      const year = courseStudent.year
      const semesterId = courseStudent.semester_id

      if (year === 0 || semesterId === 0) {
        courseStudent.status = 'transfer'
        courseStudent.statusLabel = 'Transfer'
      }

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

onMounted(async () => {
  await getStudent()
  await getMajorCourses()
  await getMinorCourses()
  await getCoreCourses()
  getStudentCourses()
})

const creditBreakdown = computed(() => {
  let major = 0
  let minor = 0
  let core = 0
  let elective = 0

  const combined = []

  for (let i = 0; i < transferCourses.value.length; i++) {
    combined.push(transferCourses.value[i])
  }
  for (let i = 0; i < year1Fall.value.length; i++) {
    combined.push(year1Fall.value[i])
  }
  for (let i = 0; i < year1Spring.value.length; i++) {
    combined.push(year1Spring.value[i])
  }
  for (let i = 0; i < year2Fall.value.length; i++) {
    combined.push(year2Fall.value[i])
  }
  for (let i = 0; i < year2Spring.value.length; i++) {
    combined.push(year2Spring.value[i])
  }
  for (let i = 0; i < year3Fall.value.length; i++) {
    combined.push(year3Fall.value[i])
  }
  for (let i = 0; i < year3Spring.value.length; i++) {
    combined.push(year3Spring.value[i])
  }
  for (let i = 0; i < year4Fall.value.length; i++) {
    combined.push(year4Fall.value[i])
  }
  for (let i = 0; i < year4Spring.value.length; i++) {
    combined.push(year4Spring.value[i])
  }

  for (let i = 0; i < combined.length; i++) {
    const currentCourse = combined[i]
    const credits = currentCourse.course.credits || 0

    if (currentCourse.category === 'major') {
      major += credits
    } else if (currentCourse.category === 'minor') {
      minor += credits
    } else if (currentCourse.category === 'core') {
      core += credits
    } else if (currentCourse.category === 'elective') {
      elective += credits
    }
  }

  return {
    major: major,
    minor: minor,
    core: core,
    elective: elective,
    majorPercent: (major / totalCredits.value) * 100,
    minorPercent: (minor / totalCredits.value) * 100,
    corePercent: (core / totalCredits.value) * 100,
    electivePercent: (elective / totalCredits.value) * 100,
  }
})

const toggleCourseStatus = async (course) => {
  let newStatusId = 4

  if (course.course_status_id === 4) {
    newStatusId = 3
  } else if (course.course_status_id === 3) {
    newStatusId = 2
  } else if (course.course_status_id === 2) {
    newStatusId = 1
  } else {
    newStatusId = 4
  }

  try {
    await axios.put(
      'https://checksheets.cscprof.com/studentcourses',
      {
        course_student_id: course.course_student_id,
        student_id: course.student_id,
        course_id: course.course_id,
        semester_id: course.semester_id,
        year: course.year,
        course_status_id: newStatusId,
        grade: course.grade,
      },
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
          'Content-Type': 'application/json',
        },
      },
    )

    await getStudentCourses()
  } catch (error) {
    console.error('Error updating status:', error)
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
.progress-container {
  margin: 20px 0;
}

.progress-bar {
  display: flex;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progressChunk {
  height: 100%;
  transition: width 0.3s;
}

.progressChunk.major {
  background-color: #3273dc;
}

.progressChunk.minor {
  background-color: #48c774;
}

.progressChunk.core {
  background-color: #ffdd57;
}

.progressChunk.elective {
  background-color: #9b59b6;
}

.progress-label {
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}
.category-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  font-size: 0.9rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
}

.legend-color.major {
  background-color: #3273dc;
}

.legend-color.minor {
  background-color: #48c774;
}

.legend-color.core {
  background-color: #ffdd57;
}

.legend-color.elective {
  background-color: #9b59b6;
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
  background-color: #9b59b6;
  color: white;
}
.status-transfer {
  background-color: #e3f2fd; /* Light blue background */
}

.status-completed {
  background-color: #c8e6c9; /* Light green background */
}

.status-inprogress {
  background-color: #b3e5fc; /* Light cyan background */
}

.status-scheduled {
  background-color: white; /* White/default */
}

.status-failed {
  background-color: #ffcdd2; /* Light red background */
}
</style>
