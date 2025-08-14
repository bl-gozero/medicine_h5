<template>
  <view>
    <u--text
      suffixIcon="arrow-right"
      iconStyle="font-size: 10px;color: #9F9F9F"
      size="14"
      lineHeight="14"
      :color="value ? '#3D3D3D' : '#C0C4CC'"
      :text="displayText || '请选择'"
      @click="showPicker = true"
    ></u--text>

    <u-picker
      v-model="showPicker"
      mode="multi-column"
      :columns="columns"
      @change="onPickerChange"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </view>
  
  <!-- 示例 -->
  <!-- <region-picker v-model="regionText" @change="onRegionChange" /> -->
</template>

<script>
import { regionData } from '@/utils/region.js';

export default {
  name: 'RegionPicker',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPicker: false,
      columns: [[], [], []],
      tempIndex: [0, 0, 0],
      displayText: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.displayText = val;
        }
      }
    }
  },
  mounted() {
    this.initColumns();
  },
  methods: {
    initColumns() {
      const provinces = regionData.map(p => ({ label: p.label, value: p.value }));
      const cities = regionData[0].children.map(c => ({ label: c.label, value: c.value }));
      const areas = regionData[0].children[0].children.map(a => ({ label: a.label, value: a.value }));
      this.columns = [provinces, cities, areas];
    },
    onPickerChange(e) {
      const { columnIndex, index } = e;
      this.tempIndex[columnIndex] = index;

      if (columnIndex === 0) {
        const province = regionData[index];
        const cities = province.children.map(c => ({ label: c.label, value: c.value }));
        const areas = province.children[0]?.children?.map(a => ({ label: a.label, value: a.value })) || [];
        this.columns.splice(1, 1, cities);
        this.columns.splice(2, 1, areas);
        this.tempIndex[1] = 0;
        this.tempIndex[2] = 0;
      } else if (columnIndex === 1) {
        const province = regionData[this.tempIndex[0]];
        const city = province.children[index];
        const areas = city.children.map(a => ({ label: a.label, value: a.value }));
        this.columns.splice(2, 1, areas);
        this.tempIndex[2] = 0;
      }
    },
    onConfirm(e) {
      const [p, c, a] = e.value;
      const resultText = `${p.label} ${c.label} ${a.label}`;
      const resultValue = resultText;

      this.displayText = resultText;
      this.$emit('input', resultValue);
      this.$emit('change', {
        label: resultText,
        value: [p.value, c.value, a.value]
      });
      this.showPicker = false;
    }
  }
};
</script>
