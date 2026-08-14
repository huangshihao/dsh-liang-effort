import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('发布产物', () => {
  it('浏览器包使用 DSH 模块包装并外置 React', async () => {
    const bundle = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
    expect(bundle).toContain("id: 'dsh-liang-effort'")
    expect(bundle).toContain('require("react")')
    expect(bundle).toContain('conversation.input.model')
    expect(bundle).toContain('priority: -100')
    expect(bundle).toContain('playbackRate')
    expect(bundle).toContain('requestAnimationFrame')
    expect(bundle).toContain('dle-modelbar')
  })

  it('Host 包提供视频路由', async () => {
    const bundle = await readFile(new URL('../lib/index.js', import.meta.url), 'utf8')
    expect(bundle).toContain('/plugins/dsh-liang-effort/liang-evolution.mp4')
    expect(bundle).toContain('content-range')
  })
})
