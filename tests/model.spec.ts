import { describe, expect, it } from 'vitest'
import { effortIndexOf, sliderEfforts } from '../src/client/model.js'

describe('梁氏推理档位', () => {
  it('保留协议值并替换显示名称', () => {
    expect(sliderEfforts([
      { id: 'low', name: 'Low' },
      { id: 'high', name: 'High' },
      { id: 'max', name: 'Max' },
    ])).toEqual([
      { id: 'low', label: '牢梁', level: 6 },
      { id: 'high', label: '梁子', level: 12 },
      { id: 'max', label: '梁圣', level: 18 },
    ])
  })

  it('把五档 provider 的标准 effort 匹配为前五级梁阶', () => {
    expect(sliderEfforts([
      { id: 'off', name: 'Off' },
      { id: 'minimal', name: 'Minimal' },
      { id: 'low', name: 'Low' },
      { id: 'medium', name: 'Medium' },
      { id: 'high', name: 'High' },
    ])).toEqual([
      { id: 'off', label: '小难梁', level: 0 },
      { id: 'minimal', label: '牢梁', level: 6 },
      { id: 'low', label: '梁子', level: 12 },
      { id: 'medium', label: '梁圣', level: 18 },
      { id: 'high', label: '梁神', level: 24 },
    ])
  })

  it('把完整六档映射到小难梁至梁祖', () => {
    expect(sliderEfforts([
      { id: 'off', name: 'Off' },
      { id: 'minimal', name: 'Minimal' },
      { id: 'low', name: 'Low' },
      { id: 'medium', name: 'Medium' },
      { id: 'high', name: 'High' },
      { id: 'max', name: 'Max' },
    ]).map(effort => effort.label)).toEqual(['小难梁', '牢梁', '梁子', '梁圣', '梁神', '梁祖'])
  })

  it('把未知或未指定值安全显示为第一档', () => {
    const efforts = sliderEfforts([
      { id: 'low', name: 'Low' },
      { id: 'high', name: 'High' },
      { id: 'max', name: 'Max' },
    ])
    expect(effortIndexOf(efforts, 'high')).toBe(1)
    expect(effortIndexOf(efforts, undefined)).toBe(0)
    expect(effortIndexOf(efforts, 'future')).toBe(0)
  })
})
