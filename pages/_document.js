import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        // Cria uma instância do ServerStyleSheet
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            // Modifica o método renderPage para envolver a aplicação com o sheet.collectStyles
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            // Coleta as props iniciais do documento
            const initialProps = await Document.getInitialProps(ctx);

            // Retorna as props iniciais, incluindo os estilos coletados
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            // Garante que os recursos do ServerStyleSheet sejam liberados corretamente
            sheet.seal();
        }
    }

    render() {
        return (
            <Html lang="pt-br">
                <Head>
                    {/* Links para fontes ou outros recursos globais podem ser incluídos aqui */}
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="true"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Aldrich&family=Almarai:wght@300;400;700;800&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
