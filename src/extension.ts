import * as vscode from "vscode";
import { BrowserContentProvider } from "./browserContentProvider";
import { Utility } from "./Utility";

export function activate(context: vscode.ExtensionContext) {
    Utility.startWebServer();

    const provider = new BrowserContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider("http", provider);
    let previewUri = vscode.Uri.parse("http://localhost");

    /*
    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            provider.update(previewUri);
        }
    });
    */

    vscode.workspace.onDidChangeConfiguration(() => {
        Utility.resumeWebServer();
        vscode.window.showInformationMessage("Resume the Web Server.");
    });

    let disposable: any = vscode.commands.registerCommand("extension.preview", () => {
        Utility.startWebServer();
        // set ViewColumn
        let viewColumn: vscode.ViewColumn;
        if (vscode.window.activeTextEditor.viewColumn < 3) {
            viewColumn = vscode.window.activeTextEditor.viewColumn + 1;
        } else {
            viewColumn = 1;
        }

        return vscode.commands.executeCommand("vscode.previewHtml", previewUri, viewColumn, "Preview with WebServer").then(() => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    let disposable2: any = vscode.commands.registerCommand("extension.launch", () => {
        Utility.startWebServer();
        const uri = Utility.getUriOfActiveEditor();
        return vscode.commands.executeCommand("vscode.open", uri);
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        Utility.stopWebServer();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    context.subscriptions.push(disposable, disposable2, disposable3, registration);
}

export function deactivate() {
}
