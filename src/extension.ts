// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Terminal, TerminalGroup } from "./terminal";
import { ConfigurationFile } from "./configuration-file";
import { Settings } from "./settings";
import { resolve } from "path/posix";
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

const conf_filename: string = "terminal-loader.json";
const wsSettingsSection: string = "terminal-loader";
const defaultConfig = { directory: ".vscode" };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }

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
    let vscSettings = await vscode.workspace.getConfiguration(
      wsSettingsSection
    );
    const scope = vscode.workspace.workspaceFolders
      ? vscode.ConfigurationTarget.WorkspaceFolder
      : vscode.ConfigurationTarget.Workspace;

    let settings: Settings = (await vscSettings.get("config")) as Settings;

    if (!settings.directory) {
      settings.directory = defaultConfig.directory;
      await (async () =>
        new Promise((resolve, reject) => {
          vscSettings.update("config", { ...defaultConfig }).then(() => {
            logger("updated full");
            resolve(true);
          });
        }))();
      logger("get config again", defaultConfig);
      //settings = (await vscSettings.get("config")) as Settings;
      logger("get config again", settings);
    }

    const settingsFolder = path.isAbsolute(settings.directory)
      ? settings.directory
      : path.join(getWorkspaceFolder(), settings.directory);

    logger("directory", settingsFolder);

    if (!fs.existsSync(settingsFolder))
      fs.mkdirSync(settingsFolder, { recursive: true });
    if (settingsFolder) {
      if (!fs.existsSync(path.join(settingsFolder, conf_filename))) {
        fs.writeFile(
          path.join(settingsFolder, conf_filename),
          JSON.stringify(jsonFile),
          async (err) => {
            if (err) {
              vscode.window.showErrorMessage(
                "Load terminal: Default configuration file could´t be created"
              );
            } else {
              vscode.window.showInformationMessage(
                `Configuration file was created at ${path.join(
                  settings.directory,
                  conf_filename
                )}`
              );
              for (const group of options.groups) {
                await loadTerminals(settingsFolder, group.trim());
              }
            }
          }
        );
      } else {
        for (const group of options.groups) {
          await loadTerminals(settingsFolder, group.trim());
        }
      }
    } else {
      vscode.window.showInformationMessage("Please open a folder before start");
    }
  }

  async function loadTerminals(folderPath: string, groups: string) {
    const current = vscode.window.terminals;
    for (const term of current) {
      logger("term", term.state);
      term.dispose();
    }

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

  async function createTerminal(
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
                  // vscode.commands
                  //   .executeCommand("workbench.action.terminal.changeIcon", {
                  //     icon: "circuit-board",
                  //   })
                  //   .then(() => {
                  //     resolve(newTerminal);
                  //   });
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

function logger(title: string, ...value: any) {
  console.log(`[TLoader]: ${title}`, ...value);
}

//https://itnext.io/how-to-make-a-visual-studio-code-extension-77085dce7d82
// takes an array of workspace folder objects and return
// workspace root, assumed to be the first item in the array
export const getWorkspaceFolder = (): string => {
  const folders = vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[];
  if (!folders) {
    return "";
  }

  const folder = folders[0] || {};
  const uri = folder.uri;

  return uri.fsPath;
};
