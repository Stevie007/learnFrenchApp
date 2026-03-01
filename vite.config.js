import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const projectRoot = process.cwd()
  const localEnvPath = path.resolve(projectRoot, '.env.local')
  const prodEnvPath = path.resolve(projectRoot, '.env.prod')
  const envSourcePath = fs.existsSync(prodEnvPath)
    ? prodEnvPath
    : (fs.existsSync(localEnvPath) ? localEnvPath : null)
  const envSourceLabel = envSourcePath ? path.basename(envSourcePath) : 'none'
  const fileEnvVars = envSourcePath ? loadEnvFile(envSourcePath) : {}
  const resolvedEnvVars = {
    ...fileEnvVars,
    ...Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [key, value ?? '']),
    ),
  }

  if (mode !== 'production') {
    console.info(`[vite] Env source: ${envSourceLabel}; process.env overrides .env* values`)
  }

  return {
    plugins: [react()],
    envFile: false,
    define: {
      ...Object.fromEntries(
        Object.entries(resolvedEnvVars)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
      ),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.DEV': JSON.stringify(mode !== 'production'),
      'import.meta.env.PROD': JSON.stringify(mode === 'production'),
      'import.meta.env.SSR': JSON.stringify(false),
    },
  }
})

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  return raw.split(/\r?\n/).reduce((accumulator, line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      return accumulator
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex <= 0) {
      return accumulator
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    accumulator[key] = value
    return accumulator
  }, {})
}
