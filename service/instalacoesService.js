const localURL = "https://api.example.com/data";
async function getInstalacoes() {
    try {
        const resposta = await fetch(localURL);
        if (!resposta.ok) {
            throw new Error(
                `Deu erro aqui no getInstalações, provavelmente url errada: ${resposta.status}`
            );
        }
        const dado = await resposta.json();
        return dado;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export { getInstalacoes };
