// src/index.ts
import { createReadStream, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
var VIDEO_PATH = "/plugins/dsh-liang-effort/liang-evolution.mp4";
var TRANSPARENT_VIDEO_PATH = "/plugins/dsh-liang-effort/liang-evolution.webm";
function parseByteRange(header, size) {
  if (header === void 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (match === null) return void 0;
  const [, rawStart = "", rawEnd = ""] = match;
  if (rawStart === "" && rawEnd === "") return void 0;
  if (rawStart === "") {
    const suffixLength = Number(rawEnd);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return void 0;
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }
  const start = Number(rawStart);
  const requestedEnd = rawEnd === "" ? size - 1 : Number(rawEnd);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= size || requestedEnd < start) {
    return void 0;
  }
  return { start, end: Math.min(requestedEnd, size - 1) };
}
var inject = ["webServer"];
function apply(ctx) {
  const videos = [
    { contentType: "video/webm", file: "../media/liang-evolution.webm", path: TRANSPARENT_VIDEO_PATH },
    { contentType: "video/mp4", file: "../media/liang-evolution.mp4", path: VIDEO_PATH }
  ];
  for (const video of videos) {
    const videoFile = fileURLToPath(new URL(video.file, import.meta.url));
    const size = statSync(videoFile).size;
    ctx.effect(() => ctx.webServer.register({
      kind: "exact",
      path: video.path,
      handler(request, response) {
        if (request.method !== "GET" && request.method !== "HEAD") {
          response.writeHead(405, { allow: "GET, HEAD" });
          response.end();
          return;
        }
        const range = parseByteRange(request.headers.range, size);
        if (range === void 0) {
          response.writeHead(416, { "content-range": `bytes */${size}` });
          response.end();
          return;
        }
        const commonHeaders = {
          "accept-ranges": "bytes",
          "cache-control": "public, max-age=31536000, immutable",
          "content-type": video.contentType
        };
        if (range === null) {
          response.writeHead(200, { ...commonHeaders, "content-length": size });
          if (request.method === "HEAD") response.end();
          else createReadStream(videoFile).pipe(response);
          return;
        }
        const length = range.end - range.start + 1;
        response.writeHead(206, {
          ...commonHeaders,
          "content-length": length,
          "content-range": `bytes ${range.start}-${range.end}/${size}`
        });
        if (request.method === "HEAD") response.end();
        else createReadStream(videoFile, range).pipe(response);
      }
    }), `dsh-liang-effort: evolution video ${video.contentType}`);
  }
}
export {
  TRANSPARENT_VIDEO_PATH,
  VIDEO_PATH,
  apply,
  inject,
  parseByteRange
};
//# sourceMappingURL=index.js.map
