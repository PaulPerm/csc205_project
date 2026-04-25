<template>
  <div>
    <NavBar />

    <section class="section">
      <div class="container">
        <div class="box">
          <div class="columns is-vcentered">
            <div class="column">
              <h2 class="title is-4">{{ student.name }}</h2>
              <p class="subtitle is-6">
                {{ student.major || 'No major assigned' }}
                <span v-if="student.minor"> • {{ student.minor }}</span>
              </p>
            </div>
            <div class="column is-narrow">
              <router-link :to="`/checksheet/${studentId}`" class="button is-light">
                <i class="fas fa-eye"></i> View Mode
              </router-link>
              <button class="button is-primary" @click="saveChanges">
                <i class="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Major</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="student.major">
                      <option value="">Select major</option>
                      <option
                        v-for="major in majors"
                        :key="major.major_id"
                        :value="major.major_name"
                      >
                        {{ major.major_name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="field">
                <label class="label">Minor</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="student.minor">
                      <option value="">No minor</option>
                      <option
                        v-for="minor in minors"
                        :key="minor.minor_id"
                        :value="minor.minor_name"
                      >
                        {{ minor.minor_name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <h2 class="title is-5">Course Schedule</h2>

          <div class="mb-5">
            <h3 class="title is-6"><i class="fas fa-exchange-alt"></i> Transfer Credits</h3>
            <SemesterBox
              semesterName="Transfer Credits"
              :courses="transferCourses"
              @add-course="openCourseModal('Transfer', 0, 0)"
              @remove-course="removeCourse"
            />
          </div>

          <div class="mb-5">
            <h3 class="title is-5">Year 1</h3>
            <div class="columns">
              <div class="column">
                <SemesterBox
                  semesterName="Fall Semester"
                  :courses="year1Fall"
                  @add-course="openCourseModal('Fall', 1, 1)"
                  @remove-course="removeCourse"
                />
              </div>
              <div class="column">
                <SemesterBox
                  semesterName="Spring Semester"
                  :courses="year1Spring"
                  @add-course="openCourseModal('Spring', 2, 1)"
                  @remove-course="removeCourse"
                />
              </div>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="title is-5">Year 2</h3>
            <div class="columns">
              <div class="column">
                <SemesterBox
                  semesterName="Fall Semester"
                  :courses="year2Fall"
                  @add-course="openCourseModal('Fall', 1, 2)"
                  @remove-course="removeCourse"
                />
              </div>
              <div class="column">
                <SemesterBox
                  semesterName="Spring Semester"
                  :courses="year2Spring"
                  @add-course="openCourseModal('Spring', 2, 2)"
                  @remove-course="removeCourse"
                />
              </div>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="title is-5">Year 3</h3>
            <div class="columns">
              <div class="column">
                <SemesterBox
                  semesterName="Fall Semester"
                  :courses="year3Fall"
                  @add-course="openCourseModal('Fall', 1, 3)"
                  @remove-course="removeCourse"
                />
              </div>
              <div class="column">
                <SemesterBox
                  semesterName="Spring Semester"
                  :courses="year3Spring"
                  @add-course="openCourseModal('Spring', 2, 3)"
                  @remove-course="removeCourse"
                />
              </div>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="title is-5">Year 4</h3>
            <div class="columns">
              <div class="column">
                <SemesterBox
                  semesterName="Fall Semester"
                  :courses="year4Fall"
                  @add-course="openCourseModal('Fall', 1, 4)"
                  @remove-course="removeCourse"
                />
              </div>
              <div class="column">
                <SemesterBox
                  semesterName="Spring Semester"
                  :courses="year4Spring"
                  @add-course="openCourseModal('Spring', 2, 4)"
                  @remove-course="removeCourse"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CourseSelectionModal
      :isOpen="showModal"
      :semesterName="modalSemester"
      :courses="availableCourses"
      @close="showModal = false"
      @add-course="handleAddCourse"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import NavBar from '@/components/NavBar.vue'
import SemesterBox from '@/components/SemesterBox.vue'
import CourseSelectionModal from '@/components/CourseSelectionModal.vue'
import { parse } from 'node:path'

const route = useRoute()
const router = useRouter()
const studentId = route.params.id

const student = ref({
  name: '',
  major: '',
  minor: '',
})

const majors = ref([])
const minors = ref([])

const transferCourses = ref([])
const year1Fall = ref([])
const year1Spring = ref([])
const year2Fall = ref([])
const year2Spring = ref([])
const year3Fall = ref([])
const year3Spring = ref([])
const year4Fall = ref([])
const year4Spring = ref([])

const showModal = ref(false)
const modalSemester = ref('')
const availableCourses = ref([])
const currentSemesterData = ref(null)

const courseStatuses = ref([])

const majorCourses = ref([])
const minorCourses = ref([])
const coreCourses = ref([])

const getStudent = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/students', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
    const studentData = response.data.find((s) => s.student_id === parseInt(studentId))

    console.log('Student data:', studentData)

    if (studentData) {
      student.value = {
        name: `${studentData.lastname}, ${studentData.firstname}`,
        major: studentData.majors[0] ? studentData.majors[0].major_name : '',
        minor: studentData.minors[0] ? studentData.minors[0].minor_name : '',
        major_id: studentData.majors[0] ? studentData.majors[0].major_id : null,
        minor_id: studentData.minors[0] ? studentData.minors[0].minor_id : null,
      }

      console.log('Student major_id:', student.value.major_id)
      console.log('Student minor_id:', student.value.minor_id)
    }
  } catch (error) {
    console.error('Student Fetch error', error)
  }
}

const getSemesters = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/semesters', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })
    console.log('Semesters:', response.data)
  } catch (error) {
    console.error('Error fetching semesters', error)
  }
}

const getMajors = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/majors', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })

    console.log('Majors:', response.data)
    majors.value = response.data
  } catch (error) {
    console.error('Error fetching majors:', error)
  }
}

const getCourseStatuses = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/coursestatuses', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })

    console.log('Course statuses:', response.data)
    courseStatuses.value = response.data
  } catch (error) {
    console.error('error fetching course statuses', error)
  }
}

const getMajorCourses = async () => {
  if (!student.value.major_id) {
    console.log('No major assigned')
    return
  }

  try {
    const response = await axios.get(
      `https://checksheets.cscprof.com/courses/major/${student.value.major_id}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )

    console.log('Major courses:', response.data)
    majorCourses.value = response.data
  } catch (error) {
    console.error('Error fetching major courses:', error)
  }
}

const getMinorCourses = async () => {
  if (!student.value.minor_id) {
    console.log('No minor assigned')
    return
  }

  try {
    const response = await axios.get(
      `https://checksheets.cscprof.com/courses/minor/${student.value.minor_id}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )

    console.log('Minor courses:', response.data)
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

    console.log('Core courses:', response.data)
    coreCourses.value = response.data
  } catch (error) {
    console.error('Error fetching core courses:', error)
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

      courseStudent.course_code = courseStudent.course.course_code
      courseStudent.course_name = courseStudent.course.course_name
      courseStudent.credits = courseStudent.course.credits

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
    console.error('error fetching courses:', error)
  }
}

const getMinors = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/minors', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })

    console.log('Minors:', response.data)
    minors.value = response.data
  } catch (error) {
    console.error('Error fetching minors:', error)
  }
}

const fetchAvailableCourses = async () => {
  try {
    const response = await axios.get('https://checksheets.cscprof.com/courses', {
      headers: {
        'x-token': localStorage.getItem('authToken') || '',
      },
    })

    console.log('All courses from /courses:', response.data)

    const availableCoursesFiltered = []
    const targetSemesterId = currentSemesterData.value.year

    for (let i = 0; i < response.data.length; i++) {
      const course = response.data[i]

      const prereqCheck = checkPrerequisites(course)
      let semesterOk = false

      if (targetSemesterId === 0) {
        semesterOk = true
      } else if (course.semester_id === 3) {
        semesterOk = true
      } else if (course.semester_id === targetSemesterId) {
        semesterOk = true
      } else if (targetSemesterId === 1 && (course.semester_id === 4 || course.semester_id === 5)) {
        semesterOk = true
      } else if (targetSemesterId === 2 && (course.semester_id === 6 || course.semester_id === 7)) {
        semesterOk = true
      }

      if (prereqCheck.canAdd && semesterOk) {
        availableCoursesFiltered.push(course)
      }
    }

    availableCourses.value = availableCoursesFiltered
    console.log('Filtered available courses:', availableCourses.value.length)
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

const openCourseModal = async (semester, year, yearNum) => {
  console.log('Opening modal for:', semester, year, yearNum)

  currentSemesterData.value = { semester, year, yearNum }

  if (semester === 'Transfer') {
    modalSemester.value = 'Transfer Credits'
  } else {
    modalSemester.value = `${semester} ${yearNum}`
  }

  await fetchAvailableCourses()

  showModal.value = true
}

const handleAddCourse = async (data) => {
  console.log('Adding course:', data)
  console.log('To semester:', currentSemesterData.value)

  const prereqCheck = checkPrerequisites(data.course)
  if (!prereqCheck.canAdd) {
    alert(
      `Cannot add ${data.course.course_code}. Missing prerequisites: ${prereqCheck.missingPrereqs.join(', ')}`,
    )
    return
  }

  try {
    let statusId = 4
    if (data.status === 'completed') {
      statusId = 2
    } else if (data.status === 'inprogress') {
      statusId = 3
    } else if (data.status === 'failed') {
      statusId = 1
    } else if (data.status === 'transfer') {
      statusId = 6
    } else if (data.status === 'scheduled') {
      statusId = 4
    }

    const response = await axios.post(
      'https://checksheets.cscprof.com/studentcourses',
      {
        student_id: parseInt(studentId),
        course_id: data.course.course_id,
        semester_id: currentSemesterData.value.year,
        year: currentSemesterData.value.yearNum,
        course_status_id: statusId,
        grade: data.grade || null,
      },
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('Course added!', response.data)

    await getStudentCourses()
    showModal.value = false
  } catch (error) {
    console.error('Error adding course', error)
    console.error('Error response:', error.response)
    console.error('Error data:', error.response && error.response.data)
    alert('Failed to add course')
  }
}

const checkPrerequisites = (course) => {
  if (!course.prereqs || course.prereqs.length === 0) {
    return { canAdd: true, missingPrereqs: [] }
  }

  const allStudentCourses = []

  for (let i = 0; i < transferCourses.value.length; i++) {
    allStudentCourses.push(transferCourses.value[i])
  }
  for (let i = 0; i < year1Fall.value.length; i++) {
    allStudentCourses.push(year1Fall.value[i])
  }
  for (let i = 0; i < year1Spring.value.length; i++) {
    allStudentCourses.push(year1Spring.value[i])
  }
  for (let i = 0; i < year2Fall.value.length; i++) {
    allStudentCourses.push(year2Fall.value[i])
  }
  for (let i = 0; i < year2Spring.value.length; i++) {
    allStudentCourses.push(year2Spring.value[i])
  }
  for (let i = 0; i < year3Fall.value.length; i++) {
    allStudentCourses.push(year3Fall.value[i])
  }
  for (let i = 0; i < year3Spring.value.length; i++) {
    allStudentCourses.push(year3Spring.value[i])
  }
  for (let i = 0; i < year4Fall.value.length; i++) {
    allStudentCourses.push(year4Fall.value[i])
  }
  for (let i = 0; i < year4Spring.value.length; i++) {
    allStudentCourses.push(year4Spring.value[i])
  }

  const studentCourseIds = []
  for (let i = 0; i < allStudentCourses.length; i++) {
    studentCourseIds.push(allStudentCourses[i].course_id)
  }

  const missingPrereqs = []
  for (let i = 0; i < course.prereqs.length; i++) {
    const prereq = course.prereqs[i]

    let hasPrereq = false
    for (let j = 0; j < studentCourseIds.length; j++) {
      if (studentCourseIds[j] === prereq.course_id) {
        hasPrereq = true
        break
      }
    }

    if (!hasPrereq) {
      missingPrereqs.push(prereq.course_code)
    }
  }

  return {
    canAdd: missingPrereqs.length === 0,
    missingPrereqs: missingPrereqs,
  }
}

const removeCourse = async (course) => {
  console.log('Removing course:', course)

  if (!confirm('Remove this course from the schedule?')) {
    return
  }

  try {
    const response = await axios.delete(
      `https://checksheets.cscprof.com/studentcourses/${course.course_student_id}`,
      {
        headers: {
          'x-token': localStorage.getItem('authToken') || '',
        },
      },
    )

    console.log('Remove response:', response.data)
    await getStudentCourses()
  } catch (error) {
    console.error('Error removing course:', error)
    console.error('Error data:', error.response && error.response.data)
  }
}

const saveChanges = async () => {
  try {
    const selectedMajor = majors.value.find((m) => m.major_name === student.value.major)
    const selectedMinor = minors.value.find((m) => m.minor_name === student.value.minor)

    console.log('Saving major:', selectedMajor)
    console.log('Saving minor:', selectedMinor)

    if (selectedMajor) {
      const majorResponse = await axios.post(
        'https://checksheets.cscprof.com/majorstudents',
        {
          student_id: parseInt(studentId),
          major_id: selectedMajor.major_id,
        },
        {
          headers: {
            'x-token': localStorage.getItem('authToken') || '',
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('Major saved:', majorResponse.data)
    }

    if (selectedMinor) {
      const minorResponse = await axios.post(
        'https://checksheets.cscprof.com/minorstudents',
        {
          student_id: parseInt(studentId),
          minor_id: selectedMinor.minor_id,
        },
        {
          headers: {
            'x-token': localStorage.getItem('authToken') || '',
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('Minor saved:', minorResponse.data)
    }

    alert('Major and minor saved successfully!')
    router.push(`/checksheet/${studentId}`)
  } catch (error) {
    console.error('Save error:', error)
    console.error('Error response:', error.response)
    console.error('Error data:', error.response && error.response.data)
    alert('Failed to save changes')
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

onMounted(async () => {
  await getStudent()
  await getMajorCourses()
  await getMinorCourses()
  await getCoreCourses()
  getStudentCourses()
  getSemesters()
  getMajors()
  getMinors()
  getCourseStatuses()
})
</script>

<style scoped>
.button.is-primary {
  background-color: var(--green);
}

.box {
  background-color: whitesmoke;
  box-shadow: 0 2px 8px rgba(105, 98, 157, 0.4);
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
