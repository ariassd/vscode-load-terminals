// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Terminal, TerminalGroup } from "./Terminal";
import { ConfigurationFile } from "./ConfigurationFile";
var packageJson: any = require("../package.json");

const jsonFile: ConfigurationFile = {
  version: packageJson.version,
  groups: [
    {
      name: "First group: Sample",
      description: "First group of terminals and commands",
      enabled: true,
      terminals: [
        { name: "--1g-1c", path: ".", cmd: "echo first group first console!", num: 0 },
        { name: "--1g-2c", path: ".", cmd: "echo first group second console!", num: 0 },
      ],
    },
    {
      name: "Second group: Sample",
      description: "Second group of terminals and commands",
      enabled: true,
      terminals: [
        { name: "--2g-1c", path: ".", cmd: "echo Second group first console!", num: 0 },
        { name: "--2g-2c", path: ".", cmd: "echo Second group second console!", num: 0 },
      ],
    },
  ],
};

const conf_filename: string = "LoadTerminal.json";
const wsSettingsSection: string = "terminalLoader";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Terminal Loader" is now active!');

  let dispLoadTerminals = vscode.commands.registerCommand("extension.loadTerminals", () => executeCommand({ groups: ["groups"] }));

  let dispLoadTrmGroups = vscode.commands.registerCommand("extension.loadTrmGroups", async () => {
    const inputData = await vscode.window.showInputBox({
      placeHolder: "groups,groups-a,groups-b",
    });
    executeCommand({ groups: inputData?.split(",") || [] });
  });

  async function executeCommand(options: { groups: string[] }) {
    const tLoaderSettings = vscode.workspace.getConfiguration(wsSettingsSection);
    let conf_folderPath: string = "workspaceConfiguration";

    if (tLoaderSettings.has("config")) {
      const settings: any = JSON.parse(JSON.stringify(tLoaderSettings.get("config")));
      conf_folderPath = settings.directory || conf_folderPath;
    }

    const rootSpaceFolders = vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[];
    var folderPath = vscode.workspace.rootPath as string;
    var confFolderPath = path.join(folderPath, conf_folderPath);

    if (!folderPath) {
      vscode.window.showErrorMessage("No folder is open");
    }

    if (rootSpaceFolders?.length >= 2) {
      confFolderPath = path.join(folderPath, "..", conf_folderPath);
    }
    if (!fs.existsSync(confFolderPath)) fs.mkdirSync(confFolderPath);
    if (confFolderPath) {
      vscode.window.showInformationMessage(`Load Terminals is working on!`);
      if (!fs.existsSync(path.join(confFolderPath, conf_filename))) {
        fs.writeFile(path.join(confFolderPath, conf_filename), JSON.stringify(jsonFile), async (err) => {
          if (err) {
            vscode.window.showErrorMessage("Load terminal: Default configuration file could´t be created");
          } else {
            vscode.window.showInformationMessage(`Configuration file was created at ${path.join(confFolderPath, conf_filename)}`);
            for (const group of options.groups) {
              await loadTerminals(confFolderPath, group.trim());
            }
          }
        });
      } else {
        for (const group of options.groups) {
          await loadTerminals(confFolderPath, group.trim());
        }
      }
    } else {
      vscode.window.showInformationMessage("Please open a folder before start");
    }
  }

  async function loadTerminals(folderPath: string, groups: string) {
    let cnf = fs.readFileSync(path.join(folderPath, conf_filename), "utf8");
    let configuration: ConfigurationFile = JSON.parse(cnf);
    // @ts-ignore
    const groupToRun: TerminalGroup[] = configuration[groups];
    if (!groupToRun || groupToRun.length == 0) {
      return;
    }

    var terminalNumber = 0;
    if (groupToRun.length >= 1) {
      // vscode.window.showWarningMessage("Please be patient, vscode is busy creating terminals");
    }
    for (var i = 0; i < groupToRun.length; i++) {
      let group = groupToRun[i];
      if (group.enabled !== false) {
        // console.log(group.terminals[0]);
        let fstTerm = await createTerminal(false, group.terminals[0]);
        group.terminals[0].num = terminalNumber++;
        for (var j = 1; j < group.terminals.length; j++) {
          // console.log(group.terminals[j]);
          let terminal = group.terminals[j];
          terminal.num = terminalNumber++;
          let term = await createTerminal(true, terminal);
        }
      }
    }
  }

  function createTerminal(horizontal: boolean, terminal: Terminal): Promise<vscode.Terminal | undefined> {
    return new Promise<vscode.Terminal | undefined>((resolve, reject) => {
      // var command = "workbench.action.terminal.new";
      var command = "workbench.action.terminal.new";
      if (horizontal === true) {
        command = "workbench.action.terminal.split";
      }

      // console.log(terminal.name, "executing command ", command);
      vscode.commands.executeCommand(command).then((e) => {
        // console.log(terminal.name, "command finishes execution ", e);
        let newTerminal = vscode.window.activeTerminal;
        // console.log(terminal.name, "On did open terminal ", e);
        newTerminal?.show();
        terminal.trm = newTerminal;
        vscode.commands.executeCommand("workbench.action.terminal.renameWithArg", { name: terminal.name }).then(() => {
          newTerminal?.sendText(`cd ${terminal.path}`, true);
          newTerminal?.sendText(terminal.cmd, true);
          // listener.dispose();
          resolve(newTerminal);
        });
      });
    });
  }

  context.subscriptions.push(dispLoadTerminals);
  context.subscriptions.push(dispLoadTrmGroups);
}

// this method is called when your extension is deactivated
export function deactivate() {}
