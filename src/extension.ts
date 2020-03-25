// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path';
import { resolve } from 'dns';

const jsonFile: ConfigurationFile = {
    groups: [
        {
            name: "First group",
            description: "First group of terminals and commands",
            terminals: [
                { name: "--1g-1c", path: ".", cmd: "echo first group first console!", num: 0 },
                { name: "--1g-2c", path: ".", cmd: "echo first group second console!", num: 0 }
            ]
        },
        {
            name: "Second group",
            description: "Second group of terminals and commands",
            terminals: [
                { name: "--2g-1c", path: ".", cmd: "echo Second group first console!", num: 0 },
                { name: "--2g-2c", path: ".", cmd: "echo Second group second console!", num: 0 }
            ]
        }
    ]
};
class ConfigurationFile {
	groups!: TerminalGroup[];
}

class TerminalGroup {
	name!: string;
	description!: string;
	terminals!: Terminal[]
}

class Terminal {
	name!: string;
	path!: string;
	cmd!: string;
	num!: number;
	trm?: vscode.Terminal;

	constructor(name: string, path: string, cmd: string) {
		this.name = name;
		this.path = path;
		this.cmd = cmd
	}
}

const conf_filename: string = 'LoadTerminal.json';
const conf_cnffolderPath: string = 'workspaceConfiguration';

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
			const rootSpaceFolders = vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[];
			var folderPath = vscode.workspace.rootPath as string;
			var confFolderPath = path.join(folderPath, conf_cnffolderPath)
			if (rootSpaceFolders?.length >= 2) {
				confFolderPath = path.join(folderPath, '..', conf_cnffolderPath);
			}
			if (!fs.existsSync(confFolderPath)) fs.mkdirSync(confFolderPath);
			if (confFolderPath) {
				vscode.window.showInformationMessage(`Load Terminals is working on!`);
				if (!fs.existsSync(path.join(confFolderPath, conf_filename))) {
					fs.writeFile(path.join(confFolderPath, conf_filename), JSON.stringify(jsonFile), err => {
						if (err) {
							vscode.window.showErrorMessage("Load terminal: Default configuration file could´t be created");
						} else {
							loadTerminals(confFolderPath);
						}

					});
				}
				else {
					loadTerminals(confFolderPath);
				}
			}
			else {
				vscode.window.showInformationMessage('Please open a folder before start');
			}

		});

	async function loadTerminals(folderPath: string) {
		let cnf = fs.readFileSync(path.join(folderPath, conf_filename), "utf8");
		let configuration: ConfigurationFile = JSON.parse(cnf);

		for(var i = 0; i <= configuration.groups.length; i++) {
			let group = configuration.groups[i];
			let fstTerm = await createTerminal(false, group.terminals[0]);
			for(var j = 1; j <= group.terminals.length-1; j++) {

				let terminal = group.terminals[j];
				let term = await createTerminal(true, terminal)
				
			};
		};
	}

	function delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function createTerminal(horizontal: boolean, terminal: Terminal): Promise<vscode.Terminal> {
		return new Promise<vscode.Terminal>(async resolve => {
			var command = "workbench.action.terminal.new";
			if (horizontal === true) {
				command = "workbench.action.terminal.split";
			}
			await vscode.commands.executeCommand(command).then(async () => {
				let listener = vscode.window.onDidOpenTerminal(async e => {
					e.show();
					await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: terminal.name }).then(async () => {
						e.sendText(`cd ${terminal.path}`, true);
						e.sendText(terminal.cmd, true);
						listener.dispose();
						resolve(e);
					});

				});
				
			});
		})
	}

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
