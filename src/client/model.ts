export const LIANG_EFFORTS = [
  { id: 'off', label: '牢梁', level: 6 },
  { id: 'high', label: '梁子', level: 12 },
  { id: 'max', label: '梁圣', level: 18 },
] as const

export type LiangEffortId = typeof LIANG_EFFORTS[number]['id']

export interface ProviderEffort {
  id: string
  name: string
}

export interface SliderEffort {
  id: string
  label: string
  level: number
}

const LIANG_STAGES = ['小难梁', '牢梁', '梁子', '梁圣', '梁神', '梁祖'] as const

const SEMANTIC_STAGE = new Map([
  ['off', 0],
  ['none', 0],
  ['disabled', 0],
  ['minimal', 1],
  ['min', 1],
  ['low', 2],
  ['medium', 3],
  ['med', 3],
  ['high', 4],
  ['max', 5],
  ['maximum', 5],
  ['xhigh', 5],
  ['ultra', 5],
])

function automaticStage(effort: ProviderEffort, index: number, count: number): number {
  const id = effort.id.trim().toLowerCase().replaceAll(/[_\s-]+/g, '')
  const name = effort.name.trim().toLowerCase().replaceAll(/[_\s-]+/g, '')
  const semantic = SEMANTIC_STAGE.get(id) ?? SEMANTIC_STAGE.get(name)
  if (semantic !== undefined) return semantic
  if (count <= 1) return 2
  return Math.round((index / (count - 1)) * (LIANG_STAGES.length - 1))
}

/**
 * 把任意 provider 的 effort 列表变成滑轨：三档固定使用梁氏别名；
 * 其他数量按标准 effort 语义匹配六级梁阶，未知名称按顺序均匀匹配。
 */
export function sliderEfforts(efforts: readonly ProviderEffort[]): readonly SliderEffort[] {
  if (efforts.length === 3) {
    return efforts.map((effort, index) => ({
      id: effort.id,
      label: LIANG_EFFORTS[index]?.label ?? effort.name,
      level: LIANG_EFFORTS[index]?.level ?? 15,
    }))
  }
  return efforts.map((effort, index) => ({
    id: effort.id,
    label: LIANG_STAGES[automaticStage(effort, index, efforts.length)] ?? effort.name,
    level: automaticStage(effort, index, efforts.length) * 6,
  }))
}

/** 将协议值映射为当前滑轨索引，未知值回落到第一档。 */
export function effortIndexOf(efforts: readonly SliderEffort[], effort: string | undefined): number {
  const index = efforts.findIndex(choice => choice.id === effort)
  return index === -1 ? 0 : index
}
