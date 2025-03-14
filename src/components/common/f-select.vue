<template>
  <el-select v-model="formValue" :clearable="clearable" :placeholder="placeholder" :multiple="multiple" @change="change"
    @focus="focus" :disabled="disabled" :filterable="filterable">
    <el-option v-for="item in dicData" :key="item[prop.value]" :label="item[prop.label]" :value="item[prop.value]">
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import common from '@/api/common'

interface Props<T = any> {
  modelValue?: string
  dic?: T
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  prop?: T
  placeholder?: string
  dicUrl?: string
  filterable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  dic: [],
  multiple: false,
  clearable: false,
  disabled: false,
  filterable: true,
  prop: () => {
    return {
      label: 'label',
      value: 'value'
    }
  },
  placeholder: '',
  dicUrl: ''
})
const emit = defineEmits(['change', 'focus', 'update:modelValue'])

const dicData: any = ref()
watch(
  () => props.dic,
  async () => {
    if (props.dicUrl) {
      const res = await common(props.dicUrl)
      dicData.value = res.data.data
    } else {
      dicData.value = props.dic
    }
  },
  { immediate: true }
)
const change = (val: string) => {
  emit('change', val)
}
const focus = (val: string) => {
  emit('focus', val)
}
const formValue = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  }
})
</script>

<style></style>
