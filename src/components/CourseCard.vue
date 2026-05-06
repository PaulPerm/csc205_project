<template>
  <div class="scheduled-course" :class="`status-${course.status}`">
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <strong>{{ course.course_code }}</strong> - {{ course.course_name }}
        <span class="category-badge" :class="`category-${course.category}`">
          {{ course.categoryLabel }}
        </span>
        <div class="is-size-7 has-text-grey mt-1">
          {{ course.credits }} credits • {{ course.statusLabel }}
          <span v-if="course.grade"> • Grade: {{ course.grade }}</span>
        </div>
      </div>
      <div class="column is-narrow">
        <button class="button is-danger is-small" @click.stop="handleRemove">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['remove'])

const handleRemove = () => {
  emit('remove', props.course)
}
</script>
<style scoped>
.scheduled-course {
  background: white;
  padding: 12px;
  margin: 8px 0;
  border-radius: 4px;
  border-left: 4px solid #ddd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: #999;
  font-size: 0.9rem;
}

.remove-btn:hover {
  color: #ff3860;
}

.status-transfer {
  background-color: #e3f2fd !important;
  border-left-color: #3273dc;
}

.status-completed {
  background-color: #c8e6c9 !important;
  border-left-color: #48c774;
}

.status-inprogress {
  background-color: #b3e5fc !important;
  border-left-color: #00d1b2;
}

.status-scheduled {
  background-color: white !important;
  border-left-color: #ddd;
}

.status-failed {
  background-color: #ffcdd2 !important;
  border-left-color: #ff3860;
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
</style>
