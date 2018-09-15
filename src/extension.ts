

//
// Righteous for Visual Studio Code.
//    Copyright 2016 by Kary Foundation. Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/// <reference path="righteous.d.ts" />

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import * as vscode from 'vscode'
    import righteous = require( 'righteous-core' )
    import { languages } from 'vscode';

//
// ─── FORMAT ─────────────────────────────────────────────────────────────────────
//

    export function formatWithRighteous ( document: vscode.TextDocument,
                                             range: vscode.Range,
                                           options: vscode.FormattingOptions ) {

        const start =
            new vscode.Position( 0, 0 );
        const end =
            new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length )
        const docRange =
            new vscode.Range( start, end )
        const result =
            new Array<vscode.TextEdit>( )
        const content =
            document.getText( docRange )

        if ( !options ) {
            options = { insertSpaces: true, tabSize: 4 }
        }

        try {
            const formatted = righteous( content )
            if ( formatted ) {
                result.push( new vscode.TextEdit( docRange, formatted ) )
            }

            return result

        } catch ( error ) {
            vscode.window.showErrorMessage('Righteous could not format your code.')
            console.log( error )
        }
    }

//
// ─── REGISTRATION ───────────────────────────────────────────────────────────────
//

    // this method is called when your extension is activated
    // your extension is activated the very first time the command is executed
    export function activate ( context: vscode.ExtensionContext ) {
        registerFormatter( context )
    }

//
// ─── FUNCTION REGISTER FORMATTER ────────────────────────────────────────────────
//

    function registerFormatter ( context: vscode.ExtensionContext ) {
        context.subscriptions.push(
            vscode.languages.registerDocumentFormattingEditProvider( "css", {
                provideDocumentFormattingEdits: ( document, options, token ) => {
                    return formatWithRighteous( document, null, options )
                }
            })
        )

        context.subscriptions.push(
            vscode.languages.registerDocumentRangeFormattingEditProvider( "css", {
                provideDocumentRangeFormattingEdits: ( document, range, options, token ) => {
                    const start =
                        new vscode.Position( 0, 0 )
                    const end =
                        new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length )
                    return formatWithRighteous( document, new vscode.Range( start, end ), options )
                }
            })
        )
    }

// ────────────────────────────────────────────────────────────────────────────────

