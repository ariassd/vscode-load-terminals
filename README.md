![explorer](assets/header.png)

# Terminal loader

This extension allows to open multiple terminals stacked side by side and run a different command on each one. Perfect to work in a workspace with multiple projects.

## Features

Allow to configure and run pre configured commands.
Add a configuration file in `.vscode` folder.

## Installation ⬇

In vscode marketplace search and install "Terminal loader".  
Or launch the vscode quick open (<kbd>⌘</kbd>+<kbd>p</kbd> | <kbd>Ctrl</kbd>+<kbd>p</kbd>) and run `ext install terminal-loader`

## Releases

Published versions

- [See and download all versions](release/)
- [v1.1.0](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ariassd/vsextensions/terminal-loader/1.1.0/vspackage)
- [v1.2.1](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ariassd/vsextensions/terminal-loader/1.2.1/vspackage)
- [v2.0.0](release/)

## Commands 🗣

The extension commands that can be accessed from the command pallet (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> ):

- `TLoader: Load Terminals` - Open pre configured terminals in file `.vscode/terminal-loader.json`
  ⚠️ IMPORTANT: A group called `groups` must exists in the configuration file for this, you can add extra groups, but don't remove this one!

![explorer](assets/Sample.gif)

- `TLoader: Load Groups` - Open a group of terminals in file `terminal-loader.json`. For the following example you can select groups or testEnv or both (groups,testEnv). A sample file is created when you run the extension the first time.

⚠️ IMPORTANT: Too many groups or crowded groups could cause VSCode freezing or stop working!

```javascript
{
   "version":"packageJson.version",
   "customGroup": [ ] // 👈 Defining a custom group to be loaded with `TLoader: Load Groups`
   "groups":[ // 👈 this is the default group
      {
         "name":"First group: Sample",
         "description":"First group of terminals and commands",
         "enabled":true,
         "terminals":[
            {
               "name":"--1g-1c",
               "path":".",
               "cmd":[
                  "echo first group first console!"
               ],
               "num":0
            }
         ]
      },
      {
         "name":"Second group: Sample",
         "description":"Second group of terminals and commands",
         "enabled":true,
         "terminals":[
            {
               "name":"--2g-1c",
               "path":".",
               "cmd":[
                  "echo Second group first console!"
               ],
               "num":0
            }
         ]
      }
   ]

}
```

## Workspace settings ☑

#### Setting Section: `terminal-loader`

- `directory`: Defines the name or location for the file `terminal-loader.json`, relative to the workspace's parent folder or absolute path

  ```json
  {
    ...
    "terminal-loader.config": {
      "directory": ".vscode",
    }
  }
  ```

# License

[MIT](https://github.com/ariassd/vscode-load-terminals/blob/master/LICENSE)

## Requirements

- Visual Studio Code 1.62.0 or higher

## Latest release notes

### 2.0.0

> Note! this version broke the original configuration file.

- Change: Remove `workspaceConfiguration` folder. Configuration file (`LoadTerminal.json`) moved to `.vscode/terminal-loader.json`
- Change Some code refactor and libraries updates

Release additional notes:

- Sometimes when you define a split the behavior is not the expected due some issues with promises and thenable
- Unfortunately it is not possible yet assign terminal icons and terminal colors

[See full change log here](CHANGELOG.md)

---

## Help this extension be great 💪

If you want to contribute or have any feedback positive or negative, let me know!  
Contact via [Email](ariassd@gmail.com) or open an issue at this project's [Git Repo](https://github.com/ariassd/vscode-load-terminals).

- [Luis Arias | Github](https://github.com/ariassd)

_Thank you Nick Armitage for reporting issues._
_Thank you Leandro Silva and Anton Olsson for suggestions._

## Stay in touch

- Author - Luis Arias 2021 <<ariassd@gmail.com>>
  [GitHub profile](https://github.com/ariassd)

## License

This software is licensed under [MIT License](LICENSE)

![](assets/MIT.png) ![](assets/open-source.png)

May 2021
