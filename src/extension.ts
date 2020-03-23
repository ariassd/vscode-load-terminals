// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path';
import { WSAEADDRNOTAVAIL } from 'constants';


const jsonFile: Terminal[] = [
	{ name: '--cmd', path: '.', cmd: 'echo Auto load first terminal is OK!'},
	{ name: '--cmd2', path: '.', cmd: 'echo Auto load second terminal is OK!'},
];

class Terminal {
	name!: string;
	path!: string;
	cmd!: string;
	trm?: vscode.Terminal;

	constructor(name: string, path: string, cmd: string) {
		this.name = name;
		this.path = path;
		this.cmd = cmd
	}
}

const conf_filename: string = 'LoadTerminal.json';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Terminal Loader" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'extension.loadTerminals', 
		() => {
			// The code you place here will be executed every time your command is executed
			const folderPath = vscode.workspace.rootPath;

			if (folderPath) {
				console.log('You are working on ' ,folderPath);
				vscode.window.showInformationMessage(`Load Terminals is working on ${folderPath}!`);

				
				if (!fs.existsSync(path.join(folderPath, conf_filename))) {
					fs.writeFile(path.join(folderPath, conf_filename), JSON.stringify(jsonFile), err => {
						console.log('err', err)
						if (err) {
							vscode.window.showErrorMessage("Load terminal: Default configuration file could´t be created");		
						} else {
							loadTerminals(folderPath);
						}
							
					});
				} 
				else {
					loadTerminals(folderPath);
				}
			}
			else {
				vscode.window.showInformationMessage('Please open a folder before start');
			}
			
		});

	async function loadTerminals(folderPath: string) {
		let cnf = fs.readFileSync(path.join(folderPath, conf_filename), "utf8");
		let cnfJson: Terminal[] = JSON.parse(cnf);

		await vscode.commands.executeCommand('workbench.action.terminal.new').then(async ()=> {
			await delay(100);
			let fstTerminal = vscode.window.terminals[0];
			fstTerminal.show(true);
			var i = 0;
			var $wait: true;
			if (cnfJson.length >= 2) {
				for(i = 1; i < cnfJson.length; i++) {
					await vscode.commands.executeCommand("workbench.action.terminal.split",);
				}
			}

			await delay(100);

			for(i = 0; i < cnfJson.length; i++) {
				await delay(100);
				let element = cnfJson[i];
				let term = vscode.window.terminals[i]
				term.show();
				await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', {name: element.name});
				term.sendText(`cd ${element.path}`, true);
				term.sendText(element.cmd, true);
			}

		});

	}

	function delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
