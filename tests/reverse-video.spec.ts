import { describe, expect, it } from 'vitest'
import { reverseSampleAt } from '../src/client/reverse-video.js'

describe('反向视频取样', () => {
  it('上一帧仍在解码时不覆盖待呈现的 seek', () => {
    const sample = reverseSampleAt({
      duration: 800,
      lastSampleAt: 100,
      now: 160,
      seeking: true,
      start: 4,
      startedAt: 0,
      target: 2,
    })

    expect(sample.time).toBeUndefined()
    expect(sample.lastSampleAt).toBe(100)
    expect(sample.complete).toBe(false)
  })

  it('解码空闲时按缓动曲线返回中间帧', () => {
    const sample = reverseSampleAt({
      duration: 800,
      lastSampleAt: 100,
      now: 400,
      seeking: false,
      start: 4,
      startedAt: 0,
      target: 2,
    })

    expect(sample.time).toBe(3)
    expect(sample.lastSampleAt).toBe(400)
    expect(sample.complete).toBe(false)
  })

  it('动画到时但目标前一帧尚未解码时继续等待', () => {
    const sample = reverseSampleAt({
      duration: 800,
      lastSampleAt: 760,
      now: 900,
      seeking: true,
      start: 4,
      startedAt: 0,
      target: 2,
    })

    expect(sample).toEqual({ complete: false, lastSampleAt: 760 })
  })
})
