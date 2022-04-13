import {
  Chart as ChartJS,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController
} from 'chart.js'

import {
  chartCreate,
  chartDestroy,
  chartUpdate,
  getChartData,
  setChartLabels,
  setChartDatasets,
  compareData,
  templateError,
  ChartEmits
} from '../../src/utils'

export function generateChart(chartId, chartType, chartController) {
  let _chartRef = null

  return {
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => {}
      },
      datasetIdKey: {
        type: String,
        default: 'label'
      },
      chartId: {
        type: String,
        default: chartId
      },
      width: {
        type: Number,
        default: 400
      },
      height: {
        type: Number,
        default: 400
      },
      cssClasses: {
        type: String,
        default: ''
      },
      styles: {
        type: Object,
        default: () => {}
      },
      plugins: {
        type: Array,
        default: () => []
      }
    },
    created() {
      ChartJS.register(chartController)
    },
    mounted() {
      _chartRef = { current: null }

      if ('datasets' in this.chartData && this.chartData.datasets.length > 0) {
        chartCreate(this.renderChart, this.chartData, this.chartOptions)
        this.$emit(ChartEmits.ChartRendered)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        this.chartDataHandler(newValue, oldValue)
      }
    },
    methods: {
      renderChart(data, options) {
        if (_chartRef?.current !== null) {
          chartDestroy(_chartRef.current)
          this.$emit(ChartEmits.ChartDestroyed)
        }

        if (!this.$refs.canvas) {
          throw new Error(templateError)
        } else {
          const chartData = getChartData(data, this.datasetIdKey)

          const canvasEl2DContext = this.$refs.canvas.getContext('2d')

          if (canvasEl2DContext !== null) {
            _chartRef.current = new ChartJS(canvasEl2DContext, {
              type: chartType,
              data: chartData,
              options,
              plugins: this.plugins
            })
          }
        }
      },
      chartDataHandler(newValue, oldValue) {
        const newData = { ...newValue }
        const oldData = { ...oldValue }

        if (Object.keys(oldData).length > 0) {
          const isEqualLabelsAndDatasetsLength = compareData(newData, oldData)

          if (isEqualLabelsAndDatasetsLength && _chartRef?.current !== null) {
            setChartDatasets(_chartRef.current.data, newData, this.datasetIdKey)

            if (newData.labels !== undefined) {
              setChartLabels(_chartRef.current, newData.labels)
              this.$emit(ChartEmits.LabelsUpdated)
            }

            chartUpdate(_chartRef.current)
            this.$emit(ChartEmits.ChartUpdated)
          } else {
            if (_chartRef?.current !== null) {
              chartDestroy(_chartRef.current)
              this.$emit(ChartEmits.ChartDestroyed)
            }

            chartCreate(this.renderChart, this.chartData, this.chartOptions)
            this.$emit(ChartEmits.ChartRendered)
          }
        } else {
          if (_chartRef?.current !== null) {
            chartDestroy(_chartRef.current)
            this.$emit(ChartEmits.ChartDestroyed)
          }

          chartCreate(this.renderChart, this.chartData, this.chartOptions)
          this.$emit(ChartEmits.ChartRendered)
        }
      }
    },
    beforeDestroy() {
      if (_chartRef?.current !== null) {
        chartDestroy(_chartRef.current)
        this.$emit(ChartEmits.ChartDestroyed)
      }
    },
    render: function (createElement) {
      return createElement(
        'div',
        {
          style: this.styles,
          class: this.cssClasses
        },
        [
          createElement('canvas', {
            attrs: {
              id: this.chartId,
              width: this.width,
              height: this.height
            },
            ref: 'canvas'
          })
        ]
      )
    }
  }
}

export const Bar = /* #__PURE__ */ generateChart(
  'bar-chart',
  'bar',
  BarController
)

export const Doughnut = /* #__PURE__ */ generateChart(
  'doughnut-chart',
  'doughnut',
  DoughnutController
)

export const Line = /* #__PURE__ */ generateChart(
  'line-chart',
  'line',
  LineController
)

export const Pie = /* #__PURE__ */ generateChart(
  'pie-chart',
  'pie',
  PieController
)

export const PolarArea = /* #__PURE__ */ generateChart(
  'polar-chart',
  'polarArea',
  PolarAreaController
)

export const Radar = /* #__PURE__ */ generateChart(
  'radar-chart',
  'radar',
  RadarController
)

export const Bubble = /* #__PURE__ */ generateChart(
  'bubble-chart',
  'bubble',
  BubbleController
)

export const Scatter = /* #__PURE__ */ generateChart(
  'scatter-chart',
  'scatter',
  ScatterController
)

export default {
  Bar,
  Bubble,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
  generateChart
}
