import * as vscode from 'vscode';
import axios, { Axios, AxiosError } from 'axios'
import { exec, ExecFileException } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import os from 'os'
import throttle from 'lodash.throttle'
import * as YAML from 'yaml'
import findConfig from 'find-config'

const CONFIG_FILE = path.join(os.homedir(), '.happyhour')
const HOST = 'https://happyhour.rvapps.io'
const API_URL = `${HOST}/api/v1/work_stream_entries`
const THROTTLE_SECONDS = 10
let notify_after_successful_track: Boolean = false
const outputChannel = vscode.window.createOutputChannel('happyhour')

const throttledTrack = throttle(track, THROTTLE_SECONDS * 1000)
export const watch = () => vscode.workspace.onDidSaveTextDocument(throttledTrack)

export const init = async () => {
  const yamlData = await readConfig()

  const promptOptions = {
    prompt: 'Happyhour Api Key',
    placeHolder: `Enter your api key from ${HOST}`,
    value: yamlData.apiToken,
    ignoreFocusOut: true,
    // validateInput: Utils.apiKeyInvalid.bind(this),
  };

  const val = await vscode.window.showInputBox(promptOptions)
  if (val) {
    yamlData.apiToken = val.trim()
    await writeConfig(YAML.stringify({ api_token: yamlData.apiToken }))
  }
}

async function track(document: vscode.TextDocument) {
  const url = API_URL
  const yamlData = await readConfig()
  if (!yamlData.apiToken) {
    notify_after_successful_track = true
    vscode.window.showErrorMessage(`Visit ${HOST}/api_tokens for your happyhour API token, then run \`Happyhour init\`.`)
    return
  }
  const branch = await gitBranch(document.fileName)
  if (!branch) return
  const headers = { Authorization: `Bearer ${yamlData.apiToken}` }
  const data = { branch }

  try {
    await axios.post(url, data, { headers: headers })
    outputChannel.appendLine(`tracked: ${branch}`)

    if (notify_after_successful_track) {
      notify_after_successful_track = false
      vscode.window.showInformationMessage(`Happyhour successfully tracked: ${branch}`)
    }

  } catch(err) {
    const error: AxiosError = err as AxiosError

    if (error.response) {
      notify_after_successful_track = true
      if (error.response.status === 401) {
        const message = `Invalid happyhour API token. Visit ${HOST}/api_tokens for a new token, then run \`Happyhour init\`.`
        outputChannel.appendLine(message)
        vscode.window.showErrorMessage(message)
      } else {
        const message = `Happyhour error: status ${error.response.status}`
        outputChannel.appendLine(message)
        vscode.window.showErrorMessage(message)
      }
    } else {
      notify_after_successful_track = true
      const message = `Happyhour error. Are you able to reach ${HOST} in a browser?`
      outputChannel.appendLine(message)
      vscode.window.showErrorMessage(message)
    }
  }
}

async function gitBranch(modifiedFilePath: string) {
  const path = findGitRoot(modifiedFilePath)
  if (!path) return

  return await new Promise((resolve, reject) => {
    exec(`git -C ${path} rev-parse --abbrev-ref HEAD`, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        vscode.window.showErrorMessage(error.message);
        return
      }

      if (stderr) {
        vscode.window.showErrorMessage(stderr);
        return
      }

      resolve(stdout.trim())
    })
  })
}

function findGitRoot(file: string) {
  const gitPath = findConfig('.git', { cwd: file, home: false })
  if (!gitPath) return console.log(`Couldn't find .git for ${file}`)
  // if (!gitPath) return vscode.window.showErrorMessage(`Couldn't find .git for ${file}`)
  return gitPath.replace('.git', '')
}

// async functions:

async function readConfig(): Promise<{ apiToken: string | undefined }> {
  return await new Promise((resolve, reject) => {
    fs.readFile(CONFIG_FILE, { encoding: 'utf8' }, (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        resolve({ apiToken: undefined })
      } else {
        const { api_token } = YAML.parse(data)
        resolve({ apiToken: api_token })
      }
    })
  })
}

async function writeConfig(string: string) {
  return await new Promise((resolve, reject) => {
    fs.writeFile(CONFIG_FILE, string, { encoding: 'utf8' }, () => {
      resolve(null)
    })
  })
}
