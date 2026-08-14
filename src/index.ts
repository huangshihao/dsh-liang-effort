import { createReadStream, statSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'

export const VIDEO_PATH = '/plugins/dsh-liang-effort/liang-evolution.mp4'
export const TRANSPARENT_VIDEO_PATH = '/plugins/dsh-liang-effort/liang-evolution.webm'

interface ByteRange {
  end: number
  start: number
}

interface WebServerLike {
  register(route: {
    kind: 'exact'
    path: string
    handler: (request: IncomingMessage, response: ServerResponse) => void
  }): () => void
}

interface PluginContext {
  effect(factory: () => () => void, label: string): void
  webServer: WebServerLike
}

/** 解析单段 HTTP bytes Range；无 Range 返回 null，无效 Range 返回 undefined。 */
export function parseByteRange(header: string | undefined, size: number): ByteRange | null | undefined {
  if (header === undefined) return null
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (match === null) return undefined
  const [, rawStart = '', rawEnd = ''] = match
  if (rawStart === '' && rawEnd === '') return undefined

  if (rawStart === '') {
    const suffixLength = Number(rawEnd)
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return undefined
    return { start: Math.max(0, size - suffixLength), end: size - 1 }
  }

  const start = Number(rawStart)
  const requestedEnd = rawEnd === '' ? size - 1 : Number(rawEnd)
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= size || requestedEnd < start) {
    return undefined
  }
  return { start, end: Math.min(requestedEnd, size - 1) }
}

/** DSH Host 插件：以支持 seek 的 Range 响应提供演化视频。 */
export const inject = ['webServer']

export function apply(ctx: PluginContext): void {
  const videos = [
    { contentType: 'video/webm', file: '../media/liang-evolution.webm', path: TRANSPARENT_VIDEO_PATH },
    { contentType: 'video/mp4', file: '../media/liang-evolution.mp4', path: VIDEO_PATH },
  ] as const

  for (const video of videos) {
    const videoFile = fileURLToPath(new URL(video.file, import.meta.url))
    const size = statSync(videoFile).size
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: video.path,
      handler(request, response) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.writeHead(405, { allow: 'GET, HEAD' })
          response.end()
          return
        }

        const range = parseByteRange(request.headers.range, size)
        if (range === undefined) {
          response.writeHead(416, { 'content-range': `bytes */${size}` })
          response.end()
          return
        }

        const commonHeaders = {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=31536000, immutable',
          'content-type': video.contentType,
        }
        if (range === null) {
          response.writeHead(200, { ...commonHeaders, 'content-length': size })
          if (request.method === 'HEAD') response.end()
          else createReadStream(videoFile).pipe(response)
          return
        }

        const length = range.end - range.start + 1
        response.writeHead(206, {
          ...commonHeaders,
          'content-length': length,
          'content-range': `bytes ${range.start}-${range.end}/${size}`,
        })
        if (request.method === 'HEAD') response.end()
        else createReadStream(videoFile, range).pipe(response)
      },
    }), `dsh-liang-effort: evolution video ${video.contentType}`)
  }
}
