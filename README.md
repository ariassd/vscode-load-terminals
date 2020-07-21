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

![explorer](assets/Sample.gif)

# License

[MIT](https://github.com/ariassd/vscode-load-terminals/blob/master/LICENSE)

## Requirements

- Visual Studio Code 1.43.0 or higher

## Known Issues

## Release Notes

### 1.0.8

- NPM updates

### 1.0.5

- Fix: Compatibility with older version of configuration file

### 1.0.4

- New: New option to enable or disable a group of terminals.

```json
{
    "version": "1.0.4",
    "groups": [
        {
            "name": "Group number 1",
            "description": "Working with microservices a and b",
            "enabled": true,
            "terminals": [

```

### 1.0.3

- Fixed: correct binding of terminal caused by manual folder selection.
- Changed: Command name to `TLoader: Load Terminals`

### 1.0.2

- Set icon
- Organize terminals by groups

### 1.0.1

- Some minor fixes

### 1.0.0

- Initial release.

---

## Help this extension be great 💪

If you want to contribute or have any feedback positive or negative, let me know!  
Contact via [Email](ariassd@gmail.com) or open an issue at this project's [Git Repo](https://github.com/ariassd/vscode-load-terminals).

- [Luis Arias | Github](https://github.com/ariassd)

**Enjoy it!**

```
{
    name: "Luis Arias",
    year: 2020,
    important: "COVID-19 is a serious threat, take care and wash your hands!"
    usefulHashtag: "#IStayAtHome #SafeAtHome #Covid19 #QuedateEnCasa #coronavirus"
}
```
