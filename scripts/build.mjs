import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: true,
  legalComments: 'none',
})

await build({
  entryPoints: ['src/client/index.tsx'],
  outfile: 'lib/client.js',
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: ['chrome120', 'safari17'],
  external: ['react', 'react/jsx-runtime'],
  sourcemap: true,
  legalComments: 'none',
  banner: {
    js: `window.__ModuleLoader__.load({
  id: 'dsh-liang-effort',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;`,
  },
  footer: {
    js: `    return module.exports;
  },
});`,
  },
})
