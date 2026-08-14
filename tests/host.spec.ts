import { describe, expect, it } from 'vitest'
import { parseByteRange } from '../src/index.js'

describe('视频 Range 解析', () => {
  it('接受完整请求与常见单段范围', () => {
    expect(parseByteRange(undefined, 100)).toBeNull()
    expect(parseByteRange('bytes=10-19', 100)).toEqual({ start: 10, end: 19 })
    expect(parseByteRange('bytes=90-', 100)).toEqual({ start: 90, end: 99 })
    expect(parseByteRange('bytes=-12', 100)).toEqual({ start: 88, end: 99 })
  })

  it('拒绝越界、倒序和多段范围', () => {
    expect(parseByteRange('bytes=100-', 100)).toBeUndefined()
    expect(parseByteRange('bytes=20-10', 100)).toBeUndefined()
    expect(parseByteRange('bytes=0-1,4-5', 100)).toBeUndefined()
  })
})
