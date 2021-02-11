# Terminal loader

This extension allow to open multiple terminals stacked side by side and run a different command on each one. Perfect to work in a workspace with multiple projects.

## Features

Allow to configure and run pre configured commands.
Add a configuration file called LoadTerminal.json on the root folder.

## Installation ⬇

In vscode marketplace search and install "Terminal loader".  
Or launch the vscode quick open (<kbd>⌘</kbd>+<kbd>p</kbd> | <kbd>Ctrl</kbd>+<kbd>p</kbd>) and run `ext install terminal-loader`

## Commands 🗣

The extension commands that can be accessed from the command pallet (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> ):

- `TLoader: Load Terminals` - Open pre configured terminals in file `LoadTerminal.json`
  ⚠️ IMPORTANT: A group called `groups` must exists in the configuration file for this, you can add extra groups, but please don't remove this one!

![explorer](assets/Sample.gif)

- `TLoader: Load Groups` - Open a group of terminals in file `LoadTerminal.json`. For the following example you can select groups or testEnv or both (groups,testEnv)

⚠️ IMPORTANT: Too many groups or crowded groups could cause VSCode freezing or stop working!

```json
{
  "version": "1.1.0",
  "groups": [
    {
      ...
    }
  ],
  "testEnv": [
    ...
  ]
}
```

## Workspace settings.

#### Setting Section: `terminalLoader.config`

- directory: Defines the name or location for the file `LoadTerminal.json`

```json
{
  ...
  "terminalLoader.config": {
    "directory": ".vscode",
  }
}
```

# License

[MIT](https://github.com/ariassd/vscode-load-terminals/blob/master/LICENSE)

## Requirements

- Visual Studio Code 1.53.0 or higher

## Latest release notes

### 1.2.0

- New command `TLoader: Load Groups` now you can extend config file adding new groups so you can manage many additional `configurations`.

### 1.1.0

- Fixed: Issues lading terminals with vscode 1.53
- New: configuration in `.vscode/settings`, now you will be able to define the folder for the file `LoadTerminal.json`

### 1.0.10

- Fixed: Security updates from dependencies applied

[See full change log here](CHANGELOG.md)

---

## Help this extension be great 💪

If you want to contribute or have any feedback positive or negative, let me know!  
Contact via [Email](ariassd@gmail.com) or open an issue at this project's [Git Repo](https://github.com/ariassd/vscode-load-terminals).

- [Luis Arias | Github](https://github.com/ariassd)

_Thank you Nick Armitage for reporting issues._
_Thank you Leandro Silva and Anton Olsson for suggestions._

**Enjoy it!**

```
{
    name: "Luis Arias",
    year: 2021
}
```
