# happyhour README

This is the Visual Studio Code extension for automatic capitalization tracking via [happyhour](https://happyhour.rvapps.io).

## Installation

Download [happyhour-latest.vsix](https://github.com/healthline/happyhour-vscode-extension/blob/main/happyhour-latest.vsix) and move it to your VS Code extensions folder .vscode/extensions:

- macOS: ~/.vscode/extensions
- Linux: ~/.vscode/extensions
- Windows: %USERPROFILE%\.vscode\extensions

NOTE: this extension has only been tested on macOS. If you work on another platform, please let me know if it works or if you have issues (slack @danelson).

## Initialization

After installing, `command-shift-p` and run `Happyhour init`. You will be prompted for your happyhour API token from [https://happyhour.rvapps.io/api_tokens](https://happyhour.rvapps.io/api_tokens). The extension will then automatically send your capitalization time to happyhour (and from happyhour to Jira if you've added your Jira API token to happyhour).
