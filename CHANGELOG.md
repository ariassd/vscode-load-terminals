# Load terminals change log

### 2.0.0

> Note! this version broke the original configuration file.

- Change: Remove `workspaceConfiguration` folder. Configuration file (`LoadTerminal.json`) moved to `.vscode/terminal-loader.json`
- Change Some code refactor and libraries updates

Release additional notes:

- Sometimes when you define a split the behavior is not the expected due some issues with promises and thenable
- Unfortunately it is not possible yet assign terminal icons and terminal colors

### 1.2.1

- Fix: Naming new terminals ( not splitted )
- Know bug: Renaming splitted terminal does not work with vscode version 1.57.1
- Command list on configuration, Now you can define a list of commands to be executed in the configuration file.

### 1.2.0

- New command `TLoader: Load Groups` now you can extend config file adding new groups so you can manage many additional `configurations`.

### 1.1.0

- Fixed: Issues lading terminals with vscode 1.53
- New: configuration in `.vscode/settings`, now you will be able to define the folder for the file `LoadTerminal.json`

### 1.0.10

- Fixed: Security updates from dependencies applied

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
