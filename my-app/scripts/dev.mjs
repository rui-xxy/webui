import { spawn } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const clientDir = resolve(scriptsDir, '..')
const serverDir = resolve(clientDir, '..', 'apps', 'server')

function runProcess(args, options) {
  const spawnOptions = { stdio: 'inherit', env: process.env, ...options }

  if (process.platform === 'win32') {
    const comspec = process.env.ComSpec || 'cmd.exe'
    return spawn(comspec, ['/d', '/s', '/c', 'npm', ...args], spawnOptions)
  }

  return spawn('npm', args, spawnOptions)
}

const client = runProcess(['run', 'dev:client'], { cwd: clientDir })
const server = runProcess(['--prefix', serverDir, 'run', 'dev'], { cwd: clientDir })

const children = [client, server]
let shuttingDown = false

function killProcess(child) {
  if (!child || child.killed) return
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    return
  }
  child.kill('SIGTERM')
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    killProcess(child)
  }

  setTimeout(() => process.exit(exitCode), 250)
}

for (const child of children) {
  child.on('exit', (code) => {
    if (shuttingDown) return
    shutdown(typeof code === 'number' ? code : 0)
  })

  child.on('error', () => {
    if (shuttingDown) return
    shutdown(1)
  })
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
