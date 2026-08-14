import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('梁阶面板控件装饰', () => {
  it('当前滑块刻度不与圆钮重复显示', async () => {
    const source = await readFile(new URL('../src/client/index.tsx', import.meta.url), 'utf8')
    const styles = await readFile(new URL('../src/client/styles.ts', import.meta.url), 'utf8')

    expect(source).toContain('is-current')
    expect(styles).toContain('.dle-tick.is-current { opacity: 0; }')
  })

  it('模型选择只使用原生下拉箭头', async () => {
    const source = await readFile(new URL('../src/client/index.tsx', import.meta.url), 'utf8')
    const modelbar = source.match(/<footer className="dle-modelbar">([\s\S]*?)<\/footer>/)?.[1]

    expect(modelbar).toBeDefined()
    expect(modelbar).not.toContain('<Chevron />')
  })

  it('梁阶标签同时显示 provider 的真实 effort 值', async () => {
    const source = await readFile(new URL('../src/client/index.tsx', import.meta.url), 'utf8')

    expect(source).toContain('<b>{choice.label}</b>')
    expect(source).toContain('<small>({choice.id})</small>')
    expect(source).toContain('{committedEffort.label}<small>({committedEffort.id})</small>')
    expect(source).toContain('协议值 ${activeEffort.id}')
  })
})
