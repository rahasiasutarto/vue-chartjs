import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScatterChart from './examples/ScatterChart'

describe('ScatterChart', () => {
  const Component = {
    template:
      '<div><ScatterChart :chartId="chartId" :plugins="plugins" /></div>',
    components: { ScatterChart },
    props: ['chartId', 'plugins']
  }

  it('should render a canvas', () => {
    const wrapper = mount(Component)

    const scatterChartEl = wrapper.find('#scatter-chart')
    expect(scatterChartEl.element.id).not.toBe('undefined')
    expect(scatterChartEl.exists()).toBe(true)

    const canvasEl = wrapper.find('canvas')
    expect(canvasEl.exists()).toBe(true)
  })

  it('should change id based on prop', () => {
    const wrapper = mount(Component, {
      props: { chartId: 'scatterchartprop' }
    })

    const scatterChartEl = wrapper.find('#scatterchartprop')
    expect(scatterChartEl.element.id).not.toBe('undefined')
    expect(scatterChartEl.exists()).toBe(true)
  })

  it('should add inline plugins based on prop', () => {
    const testPlugin = {
      id: 'test'
    }

    const wrapper = mount(Component, {
      props: { plugins: [testPlugin] }
    })

    expect(wrapper.props().plugins.length).toEqual(1)
  })
})
