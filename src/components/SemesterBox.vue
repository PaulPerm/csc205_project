<template>
  <div>
    <div class="level mb-2">
      <div class="level-left">
        <strong>{{ semesterName }}</strong>
      </div>
      <div class="level-right">
        <span class="tag">{{ totalCredits }} credits</span>
      </div>
    </div>

    <div
      class="semester-box"
      :class="{ 'has-courses': courses.length > 0 }"
      @click="handleAddCourse"
    >
      <div v-if="courses.length > 0">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
          @remove="handleRemoveCourse"
        />

        <div class="add-course-btn" @click.stop="handleAddCourse">
          <i class="fas fa-plus"></i> Add Course
        </div>
      </div>

      <div v-else class="add-prompt">
        <i class="fas fa-plus-circle"></i>
        <div>Click to add courses</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CourseCard from './CourseCard.vue'

const props = defineProps({
  semesterName: {
    type: String,
    required: true,
  },
  courses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-course', 'remove-course'])

const totalCredits = computed(() => {
  let total = 0
  for (let i = 0; i < props.courses.length; i++) {
    total += props.courses[i].credits || 0
  }
  return total
})

function handleAddCourse() {
  emit('add-course')
}

function handleRemoveCourse(course) {
  emit('remove-course', course)
}
</script>

<style scoped>
.semester-box {
  min-height: 180px;
  border: 2px dashed #ddd;
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.semester-box:hover {
  border-color: var(--green);
  background: #f5f5f5;
}

.semester-box.has-courses {
  border-style: solid;
  background: white;
  cursor: default;
}

.semester-box .add-prompt {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

.semester-box .add-prompt i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.add-course-btn {
  background: white;
  border: 2px dashed var(--green);
  color: var(--green);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-top: 8px;
  transition: all 0.2s;
}

.add-course-btn:hover {
  background: #e8f5e9;
  border-style: solid;
}
</style>
