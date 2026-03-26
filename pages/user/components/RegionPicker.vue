<template>
	<view>
		<view class="flex-between">
			<u--text
				size="14"
				lineHeight="14"
				:color="displayText ? '#3D3D3D' : '#9F9F9F'"
				:text="displayText || placeholder"
				@click="showPicker = true"
			/>
			<u-icon name="arrow-right" color="#7D7D7D" size="12" />
		</view>

		<u-picker
			:show="showPicker"
			mode="multi-column"
			keyName="label"
			:columns="columns"
			:confirmColor="$c.baseColor()"
			@change="onPickerChange"
			@confirm="onConfirm"
			@cancel="showPicker = false"
		/>
	</view>
</template>

<script>
import { regionData } from '@/utils/region.js';

export default {
	name: 'RegionPicker',
	props: {
		value: {
			type: String,
			default: ''
		},
		mode: {
			type: String,
			default: 'area' // province | city | area
		},
		placeholder: {
			type: String,
			default: '请填写省市区街道'
		}
	},
	data() {
		return {
			showPicker: false,
			columns: [],
			tempIndex: [0, 0, 0],
			displayText: ''
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.displayText = val || '';
			}
		}
	},
	mounted() {
		this.initColumns();
	},
	methods: {
		/* 初始化列 */
		initColumns() {
			const provinces = regionData.map(p => ({
				label: p.label,
				value: p.value
			}));

			const cities = regionData[0]?.children?.map(c => ({
				label: c.label,
				value: c.value
			})) || [];

			const areas = regionData[0]?.children?.[0]?.children?.map(a => ({
				label: a.label,
				value: a.value
			})) || [];

			if (this.mode === 'province') {
				this.columns = [provinces];
			} else if (this.mode === 'city') {
				this.columns = [provinces, cities];
			} else {
				this.columns = [provinces, cities, areas];
			}
		},

		/* 联动处理 */
		onPickerChange(e) {
			const { columnIndex, index } = e;
			this.tempIndex[columnIndex] = index;

			// 省变化
			if (columnIndex === 0) {
				const province = regionData[index];

				if (this.mode === 'province') return;

				const cities = province.children.map(c => ({
					label: c.label,
					value: c.value
				}));
				this.columns.splice(1, 1, cities);
				this.tempIndex[1] = 0;

				if (this.mode === 'area') {
					const areas = province.children[0]?.children?.map(a => ({
						label: a.label,
						value: a.value
					})) || [];
					this.columns.splice(2, 1, areas);
					this.tempIndex[2] = 0;
				}
			}

			// 市变化（仅 area）
			if (columnIndex === 1 && this.mode === 'area') {
				const province = regionData[this.tempIndex[0]];
				const city = province.children[index];
				const areas = city.children.map(a => ({
					label: a.label,
					value: a.value
				}));
				this.columns.splice(2, 1, areas);
				this.tempIndex[2] = 0;
			}
		},

		/* 确认选择 */
		onConfirm(e) {
			const selected = e.value;
			let labels = [];
			let values = [];

			if (this.mode === 'province') {
				labels = [selected[0].label];
				values = [selected[0].value];
			}

			if (this.mode === 'city') {
				labels = [selected[0].label, selected[1].label];
				values = [selected[0].value, selected[1].value];
			}

			if (this.mode === 'area') {
				labels = [
					selected[0].label,
					selected[1].label,
					selected[2].label
				];
				values = [
					selected[0].value,
					selected[1].value,
					selected[2].value
				];
			}

			const text = labels.join(' ');

			this.displayText = text;
			this.$emit('input', text);
			this.$emit('change', {
				label: text,
				value: values
			});
			this.showPicker = false;
		}
	}
};
</script>
