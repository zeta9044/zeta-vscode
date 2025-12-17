import * as vscode from 'vscode';

interface AiInstructionRequest {
  instruction: string;
  cwd: string | undefined;
  model: string;
}

async function sendInstruction(request: AiInstructionRequest): Promise<string> {
  const baseUrl = vscode.workspace.getConfiguration('zeta').get<string>('apiBaseUrl');
  const apiKey = await vscode.authentication.getSession('zeta', ['api'], { createIfNone: false })
    .then(session => session?.accessToken)
    .catch(() => undefined) ?? vscode.workspace.getConfiguration('zeta').get<string>('apiKey');

  if (!baseUrl) {
    throw new Error('zeta.apiBaseUrl is not configured.');
  }

  if (!apiKey) {
    throw new Error('No API key available. Set zeta.apiKey or store a token in VS Code accounts.');
  }

  const response = await fetch(`${baseUrl}/instructions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed (${response.status}): ${text}`);
  }

  return response.text();
}

function createTerminal(): vscode.Terminal {
  return vscode.window.createTerminal({ name: 'Zeta AI Terminal' });
}

export function activate(context: vscode.ExtensionContext): void {
  let terminal: vscode.Terminal | undefined;

  const openTerminalDisposable = vscode.commands.registerCommand('zeta-vscode.openTerminal', async () => {
    terminal = terminal ?? createTerminal();
    terminal.show(true);
  });

  const instructionDisposable = vscode.commands.registerCommand('zeta-vscode.runInstruction', async () => {
    const instruction = await vscode.window.showInputBox({
      prompt: 'Describe what you want the AI to do',
      placeHolder: 'Run tests, summarize file, refactor code…'
    });

    if (!instruction) {
      return;
    }

    terminal = terminal ?? createTerminal();
    terminal.show(true);
    terminal.sendText(`# zeta: ${instruction}`);

    try {
      const model = vscode.workspace.getConfiguration('zeta').get<string>('model', 'claude-code');
      const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      const output = await sendInstruction({ instruction, cwd, model });
      terminal.sendText(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`Zeta request failed: ${message}`);
    }
  });

  context.subscriptions.push(openTerminalDisposable, instructionDisposable);
}

export function deactivate(): void {
  // No-op
}
