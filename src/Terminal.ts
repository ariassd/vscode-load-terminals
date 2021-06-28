import * as vscode from "vscode";
export class Terminal {
  name!: string;
  path!: string;
  cmd!: string | string[];
  num!: number;
  trm?: vscode.Terminal;

  constructor(name: string, path: string, cmd: string[]) {
    this.name = name;
    this.path = path;
    this.cmd = cmd;
  }
}

export class TerminalGroup {
  name!: string;
  description!: string;
  enabled: boolean = true;
  terminals!: Terminal[];
}
