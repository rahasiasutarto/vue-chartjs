import 'chart.js/auto'
import { Bubble } from '../src'
import * as bubbleChartConfig from '../sandboxes/bubble/src/chartConfig'

export default {
  title: 'BubbleChart',
  component: Bubble,
  parameters: {
    layout: 'centered'
  }
}

export function Default(args) {
  return {
    components: { Bubble },
    template: '<Bubble v-bind="args" />',
    setup() {
      return { args }
    }
  }
}

Default.args = {
  id: 'bar-chart',
  width: 400,
  height: 400,
  ...bubbleChartConfig
}
