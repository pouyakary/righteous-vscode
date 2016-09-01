

//
// Righteous for Visual Studio Code.
//    Copyright 2016 by Kary Foundation. Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

    /// <reference path="../node_modules/righteous-core/typings/righteous.d.ts" />

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import * as vscode from 'vscode';
    import righteous = require( 'righteous-core' );

//
// ─── FORMAT ─────────────────────────────────────────────────────────────────────
//

    export function format ( document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions ) {
    
        var start = new vscode.Position( 0, 0 );
        var end = new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length );
        range = new vscode.Range( start, end );
    
        var result: vscode.TextEdit[ ] = [ ];
    
        var content = document.getText( range );
    
        if ( !options ) {
            options = { insertSpaces: true, tabSize: 4 };
        }
    
        var formatted = righteous( content );
    
        if ( formatted ) {
            result.push( new vscode.TextEdit( range, formatted ) );
        }
    
        return result;
    };

//
// ─── REGISTRATION ───────────────────────────────────────────────────────────────
//

    // this method is called when your extension is activated
    // your extension is activated the very first time the command is executed
    export function activate ( context: vscode.ExtensionContext ) {
        for ( let language of [ 'typescript', 'javascript' ] ) {
    
            context.subscriptions.push(
                vscode.languages.registerDocumentFormattingEditProvider( language, {
                    provideDocumentFormattingEdits: ( document, options, token ) => {
                        return format( document, null, options )
                    }
                })
            );
    
            context.subscriptions.push(
                vscode.languages.registerDocumentRangeFormattingEditProvider( language, {
                    provideDocumentRangeFormattingEdits: ( document, range, options, token ) => {
                        var start = new vscode.Position( 0, 0 );
                        var end = new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length );
                        return format( document, new vscode.Range( start, end ), options )
                    }
                })
            );
        }
    }

// ────────────────────────────────────────────────────────────────────────────────

    