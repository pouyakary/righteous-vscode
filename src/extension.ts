

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

//
// ─── FORMAT ─────────────────────────────────────────────────────────────────────
//

    export function formatECMAScriptFamily ( document: vscode.TextDocument,
                                                range: vscode.Range,
                                              options: vscode.FormattingOptions,
                                             language: string ) {

        const start = new vscode.Position( 0, 0 );
        const end = new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length )
        const docRange = new vscode.Range( start, end )

        const result = new Array<vscode.TextEdit>( )
        const content = document.getText( docRange )

        if ( !options )
            options = { insertSpaces: true, tabSize: 4 }

        try {
            const formatted = formatBasedOnLanguage( content, language )
            if ( formatted )
                result.push( new vscode.TextEdit( docRange, formatted ) )

            return result

        } catch ( error ) {
            vscode.window.showErrorMessage('Righteous could not format your code.')
            console.log( error )
        }
    }

//
// ─── FORMAT BASED ON LANGUAGE WITH RIGHTEOUS CORE ───────────────────────────────
//s

    function formatBasedOnLanguage ( code, language ) {
        if ( language === 'css' )
            return righteous.cssFormatter( code )
        else
            return righteous.ecmascriptFormatter( code )
    }

//
// ─── REGISTRATION ───────────────────────────────────────────────────────────────
//

    // this method is called when your extension is activated
    // your extension is activated the very first time the command is executed
    export function activate ( context: vscode.ExtensionContext ) {
        for ( let language of [ 'typescript', 'javascript' ] )
            registerFormatter( language, context )

        registerFormatter( 'css', context )
    }

//
// ─── FUNCTION REGISTER FORMATTER ────────────────────────────────────────────────
//

    function registerFormatter ( language: string, context: vscode.ExtensionContext ) {
        context.subscriptions.push(
            vscode.languages.registerDocumentFormattingEditProvider( language, {
                provideDocumentFormattingEdits: ( document, options, token ) => {
                    return formatECMAScriptFamily( document, null, options, language )
                }
            })
        )

        context.subscriptions.push(
            vscode.languages.registerDocumentRangeFormattingEditProvider( language, {
                provideDocumentRangeFormattingEdits: ( document, range, options, token ) => {
                    const start =
                        new vscode.Position( 0, 0 )
                    const end =
                        new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length )
                    return formatECMAScriptFamily( document, new vscode.Range( start, end ), options, language )
                }
            })
        )
    }

// ────────────────────────────────────────────────────────────────────────────────

