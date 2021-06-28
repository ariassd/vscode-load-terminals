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
        {
          name: "--1g-1c",
          path: ".",
          cmd: ["echo first group first console!"],
          num: 0,
        },
        {
          name: "--1g-2c",
          path: ".",
          cmd: ["echo first group second console!"],
          num: 0,
        },
      ],
    },
    {
      name: "Second group: Sample",
      description: "Second group of terminals and commands",
      enabled: true,
      terminals: [
        {
          name: "--2g-1c",
          path: ".",
          cmd: ["echo Second group first console!"],
          num: 0,
        },
        {
          name: "--2g-2c",
          path: ".",
          cmd: ["echo Second group second console!"],
          num: 0,
        },
      ],
    },
  ],
};

const conf_filename: string = "LoadTerminal.json";
const wsSettingsSection: string = "terminalLoader";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let dispLoadTerminals = vscode.commands.registerCommand(
    "extension.loadTerminals",
    () => executeCommand({ groups: ["groups"] })
  );

  let dispLoadTrmGroups = vscode.commands.registerCommand(
    "extension.loadTrmGroups",
    async () => {
      const inputData = await vscode.window.showInputBox({
        placeHolder: "groups,groups-a,groups-b",
      });
      executeCommand({ groups: inputData?.split(",") || [] });
    }
  );

  async function executeCommand(options: { groups: string[] }) {
    const tLoaderSettings =
      vscode.workspace.getConfiguration(wsSettingsSection);
    let conf_folderPath: string = "workspaceConfiguration";

    if (tLoaderSettings.has("config")) {
      const settings: any = JSON.parse(
        JSON.stringify(tLoaderSettings.get("config"))
      );
      conf_folderPath = settings.directory || conf_folderPath;
    }

    const rootSpaceFolders = vscode.workspace
      .workspaceFolders as vscode.WorkspaceFolder[];
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
      // vscode.window.showInformationMessage(`Opening terminals!`);
      if (!fs.existsSync(path.join(confFolderPath, conf_filename))) {
        fs.writeFile(
          path.join(confFolderPath, conf_filename),
          JSON.stringify(jsonFile),
          async (err) => {
            if (err) {
              vscode.window.showErrorMessage(
                "Load terminal: Default configuration file could´t be created"
              );
            } else {
              vscode.window.showInformationMessage(
                `Configuration file was created at ${path.join(
                  confFolderPath,
                  conf_filename
                )}`
              );
              for (const group of options.groups) {
                await loadTerminals(confFolderPath, group.trim());
              }
            }
          }
        );
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
        let fstTerm: any = await createTerminal(false, group.terminals[0]);
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

  function createTerminal(
    horizontal: boolean,
    terminal: Terminal
  ): Promise<vscode.Terminal | undefined> {
    return new Promise<vscode.Terminal | undefined>((resolve, reject) => {
      if (horizontal === true) {
        const command = "workbench.action.terminal.split";
        vscode.commands.executeCommand(command).then((e) => {
          // console.log(terminal.name, "command finishes execution ", e);
          let newTerminal = vscode.window.activeTerminal;
          // console.log(terminal.name, "On did open terminal ", e);
          newTerminal?.show(false);
          terminal.trm = newTerminal;
          vscode.commands
            .executeCommand("workbench.action.terminal.renameWithArg", {
              name: terminal.name,
            })
            .then(() => {
              vscode.commands
                .executeCommand("workbench.action.terminal.clear")
                .then(() => {
                  newTerminal?.sendText(`cd ${terminal.path}`, true);
                  if (
                    Object.prototype.toString.call(terminal.cmd) ===
                    "[object String]"
                  ) {
                    // @ts-ignore
                    newTerminal?.sendText(terminal.cmd, true);
                  } else {
                    for (const cmd of terminal.cmd) {
                      newTerminal?.sendText(cmd, true);
                    }
                  }
                  resolve(newTerminal);
                });
            });
        });
      } else {
        let newTerminal = vscode.window.createTerminal({
          name: terminal.name,
          //shellPath?: 'string',
          ///shellArgs?: 'string[] | string';
          //cwd?: 'string | Uri';
          //env?: { [key: string]: string | null | undefined };
          //strictEnv?: boolean;
          //hideFromUser?: boolean;
          message: terminal.name,
          // iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;
        } as vscode.TerminalOptions);
        newTerminal?.show();

        vscode.commands
          .executeCommand("workbench.action.terminal.clear")
          .then(() => {
            newTerminal?.sendText(`cd ${terminal.path}`, true);
            if (
              Object.prototype.toString.call(terminal.cmd) === "[object String]"
            ) {
              // @ts-ignore
              newTerminal?.sendText(terminal.cmd, true);
            } else {
              for (const cmd of terminal.cmd) {
                newTerminal?.sendText(cmd, true);
              }
            }

            resolve(newTerminal);
          });
      }
    });
  }

  context.subscriptions.push(dispLoadTerminals);
  context.subscriptions.push(dispLoadTrmGroups);
}

// this method is called when your extension is deactivated
export function deactivate() {}
