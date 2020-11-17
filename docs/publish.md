# How to publish vscode extensions

https://code.visualstudio.com/api/working-with-extensions/publishing-extension

https://code.visualstudio.com/api/get-started/your-first-extension

Extension in market place
https://marketplace.visualstudio.com/items?itemName=ariassd.terminal-loader

Devops page.
`https://dev.azure.com/<username>/_usersSettings/tokens`

## vsce

vsce, short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.

## Installation
Make sure you have Node.js installed. Then run:

`npm install -g vsce`
## Usage
You can use vsce to easily package and publish your extensions:

```bash
$ cd myExtension
$ vsce login <publisher_name> # Follow the instructions here
# Personal Access Token for publisher '<publisher_name>': ****************************************************
$ vsce publish patch # Make new version and publish
# This will modify the extension's package.json version attribute before publishing the extension.
#  increment: major, minor, or patch.




# Generate a version in the root folder
$ vsce package
# myExtension.vsix generated
$ vsce publish
# <publisherID>.myExtension published to VS Code MarketPlace

```

vsce can also search, retrieve metadata, and unpublish extensions. For a reference on all the available vsce commands, run vsce --help

### Log in to a publisher

If you already created a publisher before and want to use it with vsce:

`vsce login (publisher name)`
Similarly to the create-publisher command, vsce will ask you for the Personal Access Token and remember it for future commands.

You can also enter your Personal Access Token as you publish with an optional parameter -p <token>.

`vsce publish -p <token>`

### Auto-incrementing the extension version

You can auto-increment an extension's version number when you publish by specifying the SemVer compatible number to increment: major, minor, or patch.

For example, if you want to update an extension's version from 1.0.0 to 1.1.0, you would specify minor:

`vsce publish minor`
This will modify the extension's package.json version attribute before publishing the extension.

You can also specify a complete SemVer compatible version on the command line:

`vsce publish 2.0.1`
Note: If vsce publish is run in a git repo, it will also create a version commit and tag via npm-version. The default commit message will be extension's version, but you can supply a custom commit message using the -m flag. (The current version can be referenced from the commit message with %s.)
