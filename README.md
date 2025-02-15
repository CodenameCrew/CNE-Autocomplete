# Codename Engine Autocomplete

Autocomplete for Codename XML Files (Only stages currently) & Haxe scripts (HScript)

## Features

- Create stage with with stage snippets and code completion
- *PLANNED!* ~~Completion for other XML file types~~
- *IN PROGRESS!* ~~Completion for hscript (callbacks, functions, variables)~~

### Installing VSIX 
1. Download the .vsix file from the latest release
2. Open **Visual Studio Code** and select **Extensions** from the left bar
3. At the top of Extensions menu click on three dots and select "**Install From VSIX...**"
4. In the Install from VSIX window select downloaded .vsix file
5. Restart Visual Studio Code

## Release Notes

### 0.6.1

Fixed regex for arrow functions
Removed the command example from vscode :skull: (i left it in by accident)
Changed repo url to the CodenameCrew one

### 0.6.0

Changed Codename Autocomplete Prefix to "CNE"
Added the default hscript events and callbacks (no type checking) (global scripts has different autocomplete than normal scripts)

### 0.5.1

The first release yay!

## Contributing
Any pull requests are appreciated, feel free to Pull Request any missing stuff!
NOTE : If you don't know how to install dependencies use `npm install`

## Compiling and Editing the source
1. Install [npm](https://nodejs.org/en/download/)
2. Clone this repo with ```git clone https://github.com/CodenameCrew/CNE-Autocomplete.git```
3. To install all the libraries run ```npm install```
4. And to compile run ```npm run build```
