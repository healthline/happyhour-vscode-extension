# happyhour README

This is the Visual Studio Code extension for automatic capitalization tracking via [happyhour](https://happyhour.rvapps.io).

## Installation

Download [happyhour-latest.vsix](https://github.com/healthline/happyhour-vscode-extension/blob/main/happyhour-latest.vsix).

Within VS Code:

1. Click the ellipses in the upper-right corner of the Extensions sidebar
2. Click `Install from VSIX…`
3. Select `happyhour-latest.vsix` from your downloads folder

## Initialization

After installing, `command-shift-p` and run `Happyhour init`. You will be prompted for your happyhour API token from [https://happyhour.rvapps.io/api_tokens](https://happyhour.rvapps.io/api_tokens). The extension will then automatically send your capitalization time to happyhour (and from happyhour to Jira if you've added your Jira API token to happyhour).
