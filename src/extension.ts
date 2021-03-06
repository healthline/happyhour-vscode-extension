// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { watch, init } from './happyhour'

let watchDisposable: vscode.Disposable

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const initCommand = vscode.commands.registerCommand('happyhour.init', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('happyhour.init');
		init()
	})

	context.subscriptions.push(initCommand);
  watchDisposable = watch()
}

// this method is called when your extension is deactivated
export function deactivate() {
	watchDisposable.dispose()
}
