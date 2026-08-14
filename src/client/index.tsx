import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { effortIndexOf, sliderEfforts } from './model.js'
import { reverseSampleAt } from './reverse-video.js'
import { styles } from './styles.js'

const TRANSPARENT_VIDEO_URL = '/plugins/dsh-liang-effort/liang-evolution.webm?v=76e807d1cc64'
const FALLBACK_VIDEO_URL = '/plugins/dsh-liang-effort/liang-evolution.mp4?v=4b40259a3ff4'
const STYLE_ID = 'dsh-liang-effort-styles'

interface Effort {
  description?: string
  id: string
  name: string
}

interface Reasoning {
  defaultEffort?: string
  efforts: readonly Effort[]
}

interface Model {
  description?: string
  id: string
  name: string
  reasoning?: Reasoning
}

interface ModelGroup {
  id: string
  models: readonly Model[]
  name: string
}

interface ModelSelection {
  model: string
  provider: string
  reasoningEffort?: string
}

interface DirectoryState {
  current: ModelSelection | null
  error: string | null
  groups: readonly ModelGroup[]
  status: 'idle' | 'loading' | 'ready' | 'selecting' | 'error'
}

interface SnapshotStore<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
}

interface LiangSelectProps {
  available: boolean
  directory: SnapshotStore<DirectoryState>
  load: () => void
  locked: boolean
  select: (selection: ModelSelection) => Promise<boolean>
}

interface ClientContext {
  effect(factory: () => (() => void) | void, label: string): void
  inject(dependencies: readonly string[], callback: (scope: ClientContext) => void): void
  modelDirectories: {
    directoryFor(sessionId: string): {
      load(): Promise<unknown>
      select(selection: ModelSelection): Promise<void>
      store: SnapshotStore<DirectoryState>
    }
  }
  sessions: {
    subagentAddress(sessionId: string): unknown
  }
  slots: {
    inject(name: string, callback: () => (() => void) | void): void
    register(
      options: {
        inject(sessionId: string): Omit<LiangSelectProps, 'locked'>
        name: string
        priority: number
        registrant: string
      },
      component: (props: LiangSelectProps) => JSX.Element | null,
    ): () => void
  }
}

function EvolutionPortrait({ level, label, visualIndex }: { level: number; label: string; visualIndex: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const initializedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [seeking, setSeeking] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video === null || !ready || !Number.isFinite(video.duration)) return
    const target = Math.min(video.duration - 1 / 30, (level / 30) * video.duration)
    if (!initializedRef.current) {
      initializedRef.current = true
      video.currentTime = target
      return
    }
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    video.pause()
    const start = video.currentTime
    const delta = target - start
    if (Math.abs(delta) < .02) return

    const motionDuration = Math.min(1_050, Math.max(620, Math.abs(delta) * 470))
    setSeeking(true)
    if (delta > 0) {
      // 浏览器原生解码并播放连续帧，升档不再是一次 seek 换图。
      video.playbackRate = Math.min(4, Math.max(.5, delta / (motionDuration / 1_000)))
      void video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
        animationRef.current = null
        video.currentTime = target
        setSeeking(false)
      })
      const stopAtTarget = () => {
        if (video.currentTime + 1 / 60 < target) {
          animationRef.current = requestAnimationFrame(stopAtTarget)
          return
        }
        video.pause()
        video.currentTime = target
        animationRef.current = null
        setSeeking(false)
      }
      animationRef.current = requestAnimationFrame(stopAtTarget)
    } else {
      // HTMLVideoElement 不支持负 playbackRate；以约 30fps 对同一 MP4
      // 反向取样，让降档也经过中间形态，而不是直接跳到目标帧。
      const startedAt = performance.now()
      let lastSampleAt = 0
      const reverseSample = (now: number) => {
        const sample = reverseSampleAt({
          duration: motionDuration,
          lastSampleAt,
          now,
          seeking: video.seeking,
          start,
          startedAt,
          target,
        })
        lastSampleAt = sample.lastSampleAt
        if (sample.time !== undefined) video.currentTime = sample.time
        if (!sample.complete) {
          animationRef.current = requestAnimationFrame(reverseSample)
          return
        }
        video.currentTime = target
        animationRef.current = null
        setSeeking(false)
      }
      animationRef.current = requestAnimationFrame(reverseSample)
    }

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      video.pause()
    }
  }, [level, ready])

  return (
    <div className={`dle-portrait-shell${seeking ? ' is-seeking' : ''}`} data-level={visualIndex}>
      <video
        ref={videoRef}
        className="dle-video"
        preload="auto"
        muted
        playsInline
        aria-label={`当前形态：${label}`}
        onLoadedMetadata={() => setReady(true)}
        onError={() => setReady(false)}
      >
        <source src={TRANSPARENT_VIDEO_URL} type="video/webm; codecs=vp9" />
        <source src={FALLBACK_VIDEO_URL} type="video/mp4" />
      </video>
      {!ready && <span className="dle-video-loading">LOADING</span>}
    </div>
  )
}

function Chevron() {
  return (
    <svg className="dle-chevron" viewBox="0 0 12 12" aria-hidden="true">
      <path d="m3.2 4.4 2.8 2.8 2.8-2.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  )
}

function LiangSelect({ available, directory, load, locked, select }: LiangSelectProps) {
  const state = useSyncExternalStore(directory.subscribe.bind(directory), directory.getSnapshot.bind(directory))
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(0)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelId = useId()

  const choices = useMemo(() => state.groups.flatMap(group => group.models.map(model => ({ group, model }))), [state.groups])
  const currentChoice = choices.find(choice => choice.group.id === state.current?.provider && choice.model.id === state.current.model)
  const reasoning = currentChoice?.model.reasoning
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort ?? reasoning?.efforts[0]?.id
  const effortChoices = useMemo(() => sliderEfforts(reasoning?.efforts ?? []), [reasoning])
  const committedIndex = effortIndexOf(effortChoices, effectiveEffort)
  const activeEffort = effortChoices[preview] ?? effortChoices[0]
  const busy = state.status === 'selecting'
  const modelLabel = currentChoice?.model.name ?? '选择模型'
  const committedEffort = effortChoices[committedIndex]
  const effortLabel = committedEffort?.label

  useEffect(() => setPreview(committedIndex), [committedIndex])
  useEffect(() => {
    if (!available) return
    load()
  }, [available, load])
  useEffect(() => {
    if (!open) return
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => document.removeEventListener('mousedown', closeOutside)
  }, [open])

  if (!available) return null

  const chooseEffort = async (effort: string, nextPreview?: number) => {
    if (state.current === null) return
    if (nextPreview !== undefined) setPreview(nextPreview)
    setSelectionError(null)
    const accepted = await select({ provider: state.current.provider, model: state.current.model, reasoningEffort: effort })
    if (!accepted) {
      setPreview(committedIndex)
      setSelectionError(directory.getSnapshot().error ?? 'DSH 未接受这次推理强度切换')
    }
  }

  const chooseModel = async (event: ChangeEvent<HTMLSelectElement>) => {
    const [provider = '', modelId = ''] = event.target.value.split('\u0000')
    const choice = choices.find(item => item.group.id === provider && item.model.id === modelId)
    if (choice === undefined) return
    const selection: ModelSelection = { provider, model: modelId }
    const initialEffort = choice.model.reasoning?.defaultEffort ?? choice.model.reasoning?.efforts[0]?.id
    if (initialEffort !== undefined) selection.reasoningEffort = initialEffort
    const accepted = await select(selection)
    if (!accepted) setSelectionError(directory.getSnapshot().error ?? 'DSH 未接受这次模型切换')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="dle-root" onKeyDown={onKeyDown}>
      <button
        type="button"
        className="dle-trigger"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        disabled={locked}
        title={`${modelLabel}${committedEffort === undefined ? '' : ` · ${committedEffort.label}(${committedEffort.id})`}`}
        onClick={() => {
          setOpen(value => !value)
          if (!open) load()
        }}
      >
        <span className="dle-trigger-model">{modelLabel}</span>
        {committedEffort !== undefined && (
          <span className="dle-trigger-effort">
            {committedEffort.label}<small>({committedEffort.id})</small>
          </span>
        )}
        <Chevron />
      </button>

      {open && (
        <section id={panelId} className="dle-panel" role="dialog" aria-label="模型与梁氏推理强度">
          <button type="button" className="dle-close" aria-label="关闭" onClick={() => setOpen(false)}>×</button>

          {activeEffort !== undefined ? (
            <div className="dle-instrument">
              <EvolutionPortrait level={activeEffort.level} label={activeEffort.label} visualIndex={preview} />
              <div className="dle-console">
                <span className="dle-ghost" aria-hidden="true">{activeEffort.label}</span>
                <span className="dle-visually-hidden" aria-live="polite">当前选择：{activeEffort.label}</span>
                <div className="dle-rail" style={{ '--dle-progress': `${effortChoices.length <= 1 ? 100 : (preview / (effortChoices.length - 1)) * 100}%` } as React.CSSProperties}>
                  <span className="dle-track-fill" aria-hidden="true" />
                  <input
                    className="dle-range"
                    type="range"
                    min="0"
                    max={Math.max(0, effortChoices.length - 1)}
                    step="1"
                    value={preview}
                    disabled={busy}
                    aria-label="DeepSeek 推理强度"
                    aria-valuetext={`${activeEffort.label}，协议值 ${activeEffort.id}，第 ${preview + 1} 档，共 ${effortChoices.length} 档`}
                    onChange={event => {
                      const next = Number(event.target.value)
                      const choice = effortChoices[next]
                      if (choice !== undefined) void chooseEffort(choice.id, next)
                    }}
                  />
                  <span className="dle-ticks" aria-hidden="true">
                    {effortChoices.map((choice, index) => <i key={choice.id} className={`dle-tick${index <= preview ? ' is-active' : ''}${index === preview ? ' is-current' : ''}`} />)}
                  </span>
                  <div className="dle-labels" style={{ gridTemplateColumns: `repeat(${effortChoices.length}, minmax(0, 1fr))` }} aria-hidden="true">
                    {effortChoices.map((choice, index) => (
                      <span key={choice.id} className={index === preview ? 'is-active' : ''} title={`${choice.label}(${choice.id})`}>
                        <b>{choice.label}</b>
                        <small>({choice.id})</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="dle-message">当前模型没有可调推理强度；上方模型选择仍然可用。</div>
          )}

          {(selectionError ?? (state.status === 'error' ? state.error : null)) !== null && (
            <div className="dle-message is-error" role="alert">{selectionError ?? state.error}</div>
          )}

          <footer className="dle-modelbar">
            <span className="dle-kicker">MODEL</span>
            <select
              className="dle-model-select"
              aria-label="选择模型"
              value={state.current === null ? '' : `${state.current.provider}\u0000${state.current.model}`}
              disabled={busy || choices.length === 0}
              onChange={chooseModel}
            >
              {state.current === null && <option value="">正在读取模型…</option>}
              {state.groups.map(group => (
                <optgroup key={group.id} label={group.name}>
                  {group.models.map(model => <option key={model.id} value={`${group.id}\u0000${model.id}`}>{model.name}</option>)}
                </optgroup>
              ))}
            </select>
          </footer>
        </section>
      )}
    </div>
  )
}

export const inject = ['slots', 'modelDirectories', 'sessions']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const existing = document.getElementById(STYLE_ID)
    if (existing !== null) return
    const element = document.createElement('style')
    element.id = STYLE_ID
    element.textContent = styles
    document.head.append(element)
    return () => element.remove()
  }, 'dsh-liang-effort: styles')

  ctx.inject(['slots', 'modelDirectories', 'sessions'], (scope) => {
    scope.slots.inject('conversation.input.model', () => scope.slots.register({
      name: 'conversation.input.model',
      priority: -100,
      registrant: 'dsh-liang-effort',
      inject: (sessionId) => {
        const directory = scope.modelDirectories.directoryFor(sessionId)
        const available = scope.sessions.subagentAddress(sessionId) === undefined
        return {
          available,
          directory: directory.store,
          load: () => {
            if (available) void directory.load().catch(() => undefined)
          },
          select: (selection) => available
            ? directory.select(selection).then(() => true, () => false)
            : Promise.resolve(false),
        }
      },
    }, LiangSelect))
  })
}
