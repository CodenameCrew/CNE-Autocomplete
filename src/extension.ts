// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as CNECallbacks from './data/callbacks.json';
import * as CNETypes from './data/types.json';
import * as CNEVariables from './data/variables.json';

// List of pre-imported libraries from Script.hx (thanks furo)
// https://github.com/CodenameCrew/CodenameEngine/blob/main/source/funkin/backend/scripting/Script.hx
const preImportedLibraries = [
    "Std", "Math", "Reflect", "StringTools", "haxe.Json",
    "openfl.utils.Assets", "lime.app.Application", "funkin.backend.system.Main", "lime.app.Application.current.window",
    "flixel.FlxG", "flixel.FlxSprite", "flixel.FlxBasic", "flixel.FlxCamera", "flixel.FlxG.state", "flixel.tweens.FlxEase",
    "flixel.tweens.FlxTween", "flixel.sound.FlxSound", "flixel.system.FlxAssets", "flixel.math.FlxMath", "flixel.group.FlxGroup",
    "flixel.group.FlxGroup.FlxTypedGroup", "flixel.group.FlxSpriteGroup", "flixel.addons.text.FlxTypeText", "flixel.text.FlxText",
    "flixel.util.FlxTimer", "flixel.math.FlxPoint", "flixel.util.FlxAxes",
    "flixel.util.FlxColor", "funkin.backend.system.macros.GitCommitMacro.commitNumber",
    "funkin.backend.system.macros.GitCommitMacro.commitHash", "funkin.backend.scripting.ModState", "funkin.backend.scripting.ModSubState",
    "funkin.game.PlayState", "funkin.game.GameOverSubstate", "funkin.game.HealthIcon", "funkin.game.HudCamera", "funkin.game.Note",
    "funkin.game.Strum", "funkin.game.StrumLine", "funkin.game.Character", "funkin.menus.PauseSubState", "funkin.menus.FreeplayState",
    "funkin.menus.MainMenuState", "funkin.menus.StoryMenuState", "funkin.menus.TitleState", "funkin.options.Options", "funkin.backend.assets.Paths",
    "funkin.backend.system.Conductor", "funkin.backend.shaders.FunkinShader", "funkin.backend.shaders.CustomShader", "funkin.backend.FunkinText",
    "funkin.backend.FlxAnimate", "funkin.backend.FunkinSprite", "funkin.menus.ui.Alphabet", "funkin.backend.utils.CoolUtil", "funkin.backend.utils.IniUtil",
    "funkin.backend.utils.XMLUtil", "funkin.backend.utils.ZipUtil", "funkin.backend.utils.MarkdownUtil", "funkin.backend.utils.EngineUtil",
    "funkin.backend.utils.MemoryUtil", "funkin.backend.utils.BitmapUtil"
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Codename Autocomplete is Running! | VSCode Version: ' + vscode.version);

	    const diagnosticCollection = vscode.languages.createDiagnosticCollection('cneextension');
    context.subscriptions.push(diagnosticCollection);

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
        "xml",
        {
            provideCompletionItems(document, position, token, context) {
                // Check if the file path includes "song/{anysongname}/scripts"
                if (!document.fileName.includes("song") || (!document.fileName.includes("scripts") && !document.fileName.includes("song"))) {
                    return;
                }

                var completionItems: vscode.CompletionItem[] = [];

                var makeSnippet = function (prefix: String, name: string, description: string, snippetCode: string) {
                    var snippet = new vscode.CompletionItem(`[CNE ${prefix}] ${name}`);
                    snippet.documentation = new vscode.MarkdownString(description);
                    snippet.detail = "Codename Engine " + prefix + " XML Snippet";
                    snippet.kind = vscode.CompletionItemKind.Snippet;
                    snippet.insertText = new vscode.SnippetString(snippetCode);
                    completionItems.push(snippet);
                };

                makeSnippet("Stage", "Create Stage", "This creates an empty stage for Codename Engine", '<!DOCTYPE codename-engine-stage>\n<stage zoom="1" startCamPosX="0" startCamPosY="0" folder="stages/(your stage folder name in images/stage/)/">\n\t$0\n</stage>');
                makeSnippet("Stage", "High Memory Block", "Creates a element that doesn't show on low memory mode", '<high-memory>\n\t<!-- your sprites elements here -->\n\t$0\n</high-memory>');
                makeSnippet("Stage", "Static Sprite", "Creates a sprite element", '<sprite x="0" y="0" alpha="1" scroll="1" antialiasing="true" scale="1" flipX="false" flipY="false" updateHitbox="true" zoomfactor="1" sprite="mySillyImage" name="sillySprite"/>$0');
                makeSnippet("Stage", "Static Sprite (Compact)", "Creates a sprite element but removes the usually unused properties", '<sprite x="0" y="0" alpha="1" scale="1" sprite="mySillyImage" name="sillySprite"/>$0');
                makeSnippet("Stage", "Animated Sprite", "Creates a animated sprite element that uses sparrow", '<sprite x="0" y="0" alpha="1" scroll="1" antialiasing="true" scale="1" flipX="false" flipY="false" updateHitbox="true" zoomfactor="1" type="(either none, beat or loop)" sprite="mySillyImage" name="sillySprite">\n\t<!-- your sprites anims here (use the "Sprite Animation" Snippet) -->\n\t$0\n</sprite>');
                makeSnippet("Stage", "Animated Sprite (Compact)", "Creates a animated sprite element but removes the usually unused properties", '<sprite x="0" y="0" alpha="1" scale="1" type="loop" sprite="mySillyImage" name="sillySprite">\n\t<!-- your sprites anims here (use the "Sprite Animation" Snippet) -->\n\t$0\n</sprite>');
                makeSnippet("Stage", "Sprite Animation", "Creates a sprite animation element", '<anim name="idle" anim="mysprite idle0000" loop="false"/>\n\t$0');
                makeSnippet("Stage", "Sprite Animation With Indices", "Creates a sprite animation element", '<anim name="idle" anim="mysprite idle0000" loop="false" indices="0..14"/>\n$0');
                makeSnippet("Stage", "Solid Sprite", "Creates a solid sprite element", '<solid x="0" y="0" width="50" height="50" color="#FFFFFF"/>$0');

                var characters = [["bf", "Player"], ["gf", "Spectator"], ["dad", "Opponent"]];
                for (let index = 0; index < characters.length; index++) {
                    var characterInfo = characters[index];
                    var charactersType = characterInfo[0];
                    var charactersName = characterInfo[1];
                    makeSnippet("Stage", `${charactersName} Character Position`, `Sets the position for the ${charactersName.toLowerCase()} in the stage`, `<${charactersType} x="0" y="0" alpha="1" scale="1" camxoffset="0" camyoffset="0" flipX="false" scroll="1"/>$0`);
                }

                return new vscode.CompletionList(completionItems, false);
            },
        },
    ));

    context.subscriptions.push(vscode.languages.registerHoverProvider("haxe", {
        provideHover: async function (document, position, token) {
            // Check if the file path includes "song/{anysongname}/scripts" or "song"
            if (!document.fileName.includes("song") || (!document.fileName.includes("scripts") && !document.fileName.includes("song"))) {
                return;
            }

            var range = document.getWordRangeAtPosition(position);

            if (!range) {
                return;
            }

            var word = document.getText(range);
            var daType = (CNETypes as any)[word];

            let hoverMd = new vscode.MarkdownString();
            hoverMd.appendMarkdown("## `" + word + "`\n\n");
            for (let i = 0; i < daType.length; i++) {
                var type = daType[i];
                hoverMd.appendMarkdown("`" + type.name + ":" + type.type + "`" + (type.description !== null ? " - " + type.description : "") + "\n\n");
            }

            return new vscode.Hover(hoverMd);
        }
    }));

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('haxe', {
        provideCompletionItems: async function (document, position) {
            // Check if the file path includes "songs"
            const isInSongsFolder = document.fileName.includes("songs");

            var completionItems: vscode.CompletionItem[] = [];

            var makeSnippet = function (name: string, description: string | null, snippetCode: string, type: vscode.CompletionItemKind, hasPrefix: boolean = true, preselect: boolean = false, command: vscode.Command | undefined = undefined) {
                var snippet = new vscode.CompletionItem(hasPrefix ? `[CNE] ${type === vscode.CompletionItemKind.Event ? "Event Function" : (type === vscode.CompletionItemKind.Function ? "Callback Function" : "Snippet")}: ${name}` : name);
                snippet.documentation = description ?? undefined;
                snippet.detail = `Codename Engine Haxe ${type === vscode.CompletionItemKind.Event ? "Event" : (type === vscode.CompletionItemKind.Function ? "Callback" : "Snippet")}`;
                snippet.kind = type;
                snippet.preselect = preselect;
                snippet.command = command;
                snippet.insertText = new vscode.SnippetString(snippetCode);
                completionItems.push(snippet);
            };

            const isGlobalScript = document.fileName.includes("global");
            const isInFunction = checkIfInFunction(document, position);

            if (!isInFunction) {
                if (isGlobalScript) {
                    makeSnippet("State Replacement", "Snippet for replacing normal states by your ModState", "var stateRedirection:Map<FlxState, String> = [\n\t//MainMenuState => \"MyMainMenuState\",\n\t// In that example \"MyMainMenuState.hx\" is located in data/states/ so it works as a mod state\n\t$0\n];\n\nfunction preStateSwitch() {\n\tfor (defaultState => replacedState in stateRedirection)\n\t\tif (FlxG.game._requestedState is defaultState)\n\t\t\tFlxG.game._requestedState = new ModState(replacedState);\n}", vscode.CompletionItemKind.Snippet);
                }
                for (let i = 0; i < CNECallbacks.events.length; i++) {
                    const event: any = CNECallbacks.events[i];
                    var addSnippet = true;
                    if (isInSongsFolder) {
                        addSnippet = !event.isGlobal;
                    } else {
                        addSnippet = event.isGlobal;
                    }

                    if (addSnippet) {
                        makeSnippet(event.name, event.description ?? null, `function ${event.name}(event:${event.type}) {\n\t$0\n}`, vscode.CompletionItemKind.Event, true, false, {
                            command: 'cneextension.addCallbackImport', title: 'Add Callback Import', arguments: [document.uri, event.type, (CNETypes as any)[event.type]]
                        });
                    }
                }
                for (let i = 0; i < CNECallbacks.callbacks.length; i++) {
                    const callback: any = CNECallbacks.callbacks[i];
                    var argString = "";
                    var needToImport = false;
                    var funcArgs: any[] = [];
                    for (let j = 0; j < callback.args.length; j++) {
                        var arg: any = callback.args[j];
                        if (arg.typePath !== null) {
                            needToImport = true;
                            funcArgs = [document.uri, arg.type, { path: arg.typePath }];
                        }
                        argString += `${arg.name}:${arg.type}${j === callback.args.length - 1 ? "" : ", "}`;
                    }

                    var addSnippet = true;
                    if (isInSongsFolder) {
                        addSnippet = !callback.isGlobal;
                    } else {
                        addSnippet = callback.isGlobal;
                    }

                    if (addSnippet) {
                        makeSnippet(callback.name, callback.description ?? null, `function ${callback.name}(${argString}) {\n\t$0\n}`, vscode.CompletionItemKind.Function, true, false, needToImport ? {
                            command: 'cneextension.addCallbackImport', title: 'Add Callback Import', arguments: funcArgs
                        } : undefined);
                    }
                }

                // Add variables to completion items
                for (let i = 0; i < CNEVariables.variables.length; i++) {
                    const variable: any = CNEVariables.variables[i];
                    var description = variable.description ?? "";
                    var snippet = new vscode.CompletionItem(`[CNE Variable] ${variable.name}`);
                    snippet.documentation = new vscode.MarkdownString(description);
                    snippet.detail = `Codename Engine Variable: ${variable.type}`;
                    snippet.kind = vscode.CompletionItemKind.Variable;
                    snippet.insertText = new vscode.SnippetString(variable.name);
                    completionItems.push(snippet);

                    // If the variable is a boolean, add true/false completion items
                    if (variable.type === "Bool") {
                        const trueSnippet = new vscode.CompletionItem(`[CNE Variable] ${variable.name} = true`);
                        trueSnippet.documentation = new vscode.MarkdownString(description);
                        trueSnippet.detail = `Codename Engine Variable: ${variable.type}`;
                        trueSnippet.kind = vscode.CompletionItemKind.Variable;
                        trueSnippet.insertText = new vscode.SnippetString(`${variable.name} = true`);
                        completionItems.push(trueSnippet);

                        const falseSnippet = new vscode.CompletionItem(`[CNE Variable] ${variable.name} = false`);
                        falseSnippet.documentation = new vscode.MarkdownString(description);
                        falseSnippet.detail = `Codename Engine Variable: ${variable.type}`;
                        falseSnippet.kind = vscode.CompletionItemKind.Variable;
                        falseSnippet.insertText = new vscode.SnippetString(`${variable.name} = false`);
                        completionItems.push(falseSnippet);
                    }
                }
            }
			// Check for pre-imported libraries and add warnings
			const text = document.getText();
			const diagnostics: vscode.Diagnostic[] = [];
			preImportedLibraries.forEach(library => {
				const regex = new RegExp(`import\\s+${library.replace('.', '\\.')}`, 'g');
				let match;
				while ((match = regex.exec(text)) !== null) {
					const diagnostic = new vscode.Diagnostic(
						new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)),
						`The library '${library}' is already pre-imported, No need to import it in.`,
						vscode.DiagnosticSeverity.Warning
					);
					diagnostics.push(diagnostic);
				}
			});
			diagnosticCollection.set(document.uri, diagnostics);
            return new vscode.CompletionList(completionItems, false);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cneextension.addCallbackImport', async (uri, type, event) => {
        var callbackPath: string = event.typePath !== null ? `${event.typePath}.${event.path}` : event.path;
        var callbackType = `import ${callbackPath.length === 0 ? "" : callbackPath + "."}${type};`;

        var document = await vscode.workspace.openTextDocument(uri);
        var documentText = document.getText();
        if (!documentText.includes(callbackType)) {
            var edit = new vscode.WorkspaceEdit();
            edit.insert(uri, new vscode.Position(0, 0), `${callbackType}\n`);
            await vscode.workspace.applyEdit(edit);
        }
    }));
}

// This method is called when your extension is deactivated
export function deactivate() { }

function checkIfInFunction(document: vscode.TextDocument, position: vscode.Position): boolean {
    const textBeforePosition = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    const fullText = document.getText();

    // Updated regex to handle basic Haxe function declarations
    const functionRegexes = [
        // Standard Haxe function with optional access modifiers, type parameters, and return type
        /(public|private|static|override)?\s*function\s+\w+\s*(<[^>]*>)?\s*\([^)]*\)(\s*:\s*[^{]*?)?\s*{/g,
        // Function with newline before brace
        /(public|private|static|override)?\s*function\s+\w+\s*(<[^>]*>)?\s*\([^)]*\)(\s*:\s*[^{]*?)?\s*\n\s*{/g,
        // Arrow functions
        /\([^)]*\)(\s*:\s*[^\-]*?)?\s*->\s*{/g
    ];

    let isInFunction = false;
    const currentLine = position.line;
    const lines = fullText.split('\n');

    // Find all function declarations and their scopes
    for (const regex of functionRegexes) {
        let match;
        while ((match = regex.exec(fullText)) !== null) {
            const functionStartPos = document.positionAt(match.index);
            const functionStartLine = functionStartPos.line;

            // Find the matching closing brace for this function
            let openBraces = 0;
            let closeBraces = 0;
            let functionEndLine = -1;

            for (let i = functionStartLine; i < lines.length; i++) {
                const line = lines[i];
                for (const char of line) {
                    if (char === '{') {openBraces++;}
                    if (char === '}') {
                        closeBraces++;
                        if (openBraces === closeBraces) {
                            functionEndLine = i;
                            break;
                        }
                    }
                }
                if (functionEndLine !== -1) {break;}
            }

            // Check if current position is within the function's scope
            if (currentLine > functionStartLine && currentLine < functionEndLine) {
                isInFunction = true;
                break;
            }
        }
    }

    return isInFunction;
}