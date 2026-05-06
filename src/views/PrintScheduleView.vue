<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <h1 class="student-name" v-if="student">{{ student.lastname }}, {{ student.firstname }}</h1>
      <h2 class="major-name" v-if="student && student.majors.length > 0">
        {{ student.majors[0].major_name }}
      </h2>
      <p class="subtitle">Four-Year Course Schedule</p>
    </div>

    <div class="print-actions no-print">
      <button class="button is-primary" @click="printSchedule">
        <i class="fas fa-print"></i> Print Schedule
      </button>
      <router-link :to="`/checksheet/${studentId}`" class="button is-light">
        Back to Checksheet
      </router-link>
    </div>

    <div v-if="transferCourses.length > 0" class="semester-section">
      <h3 class="semester-title">Transfer Credits</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in transferCourses" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(transferCourses) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year1Fall.length > 0" class="semester-section">
      <h3 class="semester-title">Year 1 - Fall Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year1Fall" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year1Fall) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year1Spring.length > 0" class="semester-section">
      <h3 class="semester-title">Year 1 - Spring Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year1Spring" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year1Spring) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year2Fall.length > 0" class="semester-section">
      <h3 class="semester-title">Year 2 - Fall Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year2Fall" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year2Fall) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year2Spring.length > 0" class="semester-section">
      <h3 class="semester-title">Year 2 - Spring Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year2Spring" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year2Spring) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year3Fall.length > 0" class="semester-section">
      <h3 class="semester-title">Year 3 - Fall Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year3Fall" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year3Fall) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year3Spring.length > 0" class="semester-section">
      <h3 class="semester-title">Year 3 - Spring Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year3Spring" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year3Spring) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year4Fall.length > 0" class="semester-section">
      <h3 class="semester-title">Year 4 - Fall Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year4Fall" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year4Fall) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="year4Spring.length > 0" class="semester-section">
      <h3 class="semester-title">Year 4 - Spring Semester</h3>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in year4Spring" :key="course.course_student_id">
            <td>{{ course.course.course_code }}</td>
            <td>{{ course.course.course_name }}</td>
            <td>{{ course.course.credits }}</td>
            <td>{{ course.statusLabel }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Semester Total:</td>
            <td colspan="2" class="total-value">{{ calculateCredits(year4Spring) }} credits</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="overall-total">
      <strong>Overall Total Credits: {{ totalCredits }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const studentId = route.params.id

const student = ref(null)
const transferCourses = ref([])
const year1Fall = ref([])
const year1Spring = ref([])
const year2Fall = ref([])
const year2Spring = ref([])
const year3Fall = ref([])
const year3Spring = ref([])
const year4Fall = ref([])
const year4Spring = ref([])

const calculateCredits = (courses) => {
  let total = 0
  for (let i = 0; i < courses.length; i++) {
    total += courses[i].course.credits || 0
  }
  return total
}

const totalCredits = computed(() => {
  let total = 0
  total += calculateCredits(transferCourses.value)
  total += calculateCredits(year1Fall.value)
  total += calculateCredits(year1Spring.value)
  total += calculateCredits(year2Fall.value)
  total += calculateCredits(year2Spring.value)
  total += calculateCredits(year3Fall.value)
  total += calculateCredits(year3Spring.value)
  total += calculateCredits(year4Fall.value)
  total += calculateCredits(year4Spring.value)
  return total
})

const getStudent = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/students', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
    student.value = response.data.find((s) => s.student_id === parseInt(studentId))
  } catch (error) {
    console.error('Error fetching student:', error)
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

      // Map status
      const statusName = courseStudent.course_status.course_status
      let statusLabel = 'Scheduled'

      if (statusName === 'Passed') {
        statusLabel = 'Completed'
      } else if (statusName === 'In-Progress') {
        statusLabel = 'In Progress'
      } else if (statusName === 'Failed') {
        statusLabel = 'Failed'
      } else if (statusName === 'Transfer') {
        statusLabel = 'Transfer'
      }

      courseStudent.statusLabel = statusLabel

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
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

const printSchedule = () => {
  window.print()
}

onMounted(() => {
  getStudent()
  getStudentCourses()
})
</script>

<style scoped>
.schedule-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.schedule-header {
  text-align: center;
  margin-bottom: 30px;
}

.student-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.major-name {
  font-size: 18px;
  color: #666;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #999;
}

.print-actions {
  text-align: center;
  margin-bottom: 30px;
}

.print-actions .button {
  margin: 0 5px;
}

.semester-section {
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.semester-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.schedule-table th {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-weight: bold;
}

.schedule-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.schedule-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.total-label {
  text-align: right;
  font-weight: bold;
}

.total-value {
  font-weight: bold;
}

.overall-total {
  text-align: right;
  font-size: 18px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 3px solid #333;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .schedule-container {
    margin: 0;
    padding: 20px;
  }

  .semester-section {
    page-break-inside: avoid;
  }
}
</style>
