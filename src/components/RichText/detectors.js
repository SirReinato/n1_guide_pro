/**
 * Detecta URLs (http, https, ftp)
 */
export function isUrl(text) {
    if (!text) return false;

    const trimmed = text.trim();

    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(trimmed);
}

/**
 * Detecta comandos de terminal (CMD, PowerShell, Bash, ferramentas comuns)
 */
export function isCommand(text) {
    if (!text) return false;

    const trimmed = text.trim().toLowerCase();

    // Comandos comuns em suporte de TI
    const comandos = [
        "cmd",
        "powershell",
        "pwsh",
        "sfc",
        "ipconfig",
        "ping",
        "tracert",
        "net ",
        "netsh",
        "whoami",
        "tasklist",
        "taskkill",
        "chkdsk",
        "diskpart",
        "shutdown",
        "restart",
        "npm",
        "npx",
        "git",
        "curl",
        "wget",
    ];

    // Se começa com comando OU contém flags típicas (/ ou -)
    const temComandoConhecido = comandos.some(
        (cmd) => trimmed.startsWith(cmd) || trimmed.includes(` ${cmd}`),
    );

    const temFlag = /\s(\/|-)[a-z]/i.test(trimmed);

    return temComandoConhecido || temFlag;
}

/**
 * Detecta caminhos e variáveis de ambiente (Windows / Linux)
 */
export function isPath(text) {
    if (!text) return false;

    const trimmed = text.trim();

    // %appdata%
    const envWindows = /%[a-zA-Z0-9_]+%/;

    // C:\Windows\System32
    const pathWindows = /^[a-zA-Z]:\\/;

    // \\servidor\pasta (UNC)
    const pathUNC = /^\\\\[a-zA-Z0-9._-]+\\/;

    // /usr/bin
    const pathUnix = /^\//;

    return (
        envWindows.test(trimmed) ||
        pathWindows.test(trimmed) ||
        pathUNC.test(trimmed) ||
        pathUnix.test(trimmed)
    );
}
