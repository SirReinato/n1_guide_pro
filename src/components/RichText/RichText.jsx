import styled from "styled-components";
import { theme } from "../../theme/theme";

import { isUrl, isCommand, isPath } from "./detectors";
import UrlBox from "./boxes/UrlBox";
import CommandBox from "./boxes/CommandBox";
import PathBox from "./boxes/PathBox";
import { parseInlineText } from "./inlineParser";

export default function RichText({ text }) {
    if (!text) return null;

    const linhas = text.split("\n");

    return (
        <Wrapper>
            {linhas.map((linha, index) => {
                const valor = linha.trim();
                if (!valor) return <Espaco key={index} />;

                if (isUrl(valor)) return <UrlBox key={index} value={valor} />;
                if (isCommand(valor))
                    return <CommandBox key={index} value={valor} />;
                if (isPath(valor)) return <PathBox key={index} value={valor} />;

                return (
                    <Texto key={index}>
                        {parseInlineText(valor).map((parte, i) => {
                            if (parte.type === "url") {
                                return (
                                    <InlineLink
                                        key={i}
                                        href={parte.value}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {parte.value}
                                    </InlineLink>
                                );
                            }

                            if (parte.type === "path") {
                                return (
                                    <InlineCode key={i}>
                                        {parte.value}
                                    </InlineCode>
                                );
                            }

                            if (parte.type === "quoted") {
                                return (
                                    <InlineCode key={i}>
                                        {parte.quote}
                                        {parte.value}
                                        {parte.quote}
                                    </InlineCode>
                                );
                            }

                            return <span key={i}>{parte.value}</span>;
                        })}
                    </Texto>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    flex-direction: column;
    gap: 12px;
`;

const Texto = styled.p`
    line-height: 32px;
    font-size: ${theme.fontSize.paragrafos.m};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.clara.claro};
`;

const Espaco = styled.div`
    height: 8px;
`;

const InlineLink = styled.a`
    color: ${theme.colors.azulMaisClaro.claro};
    text-decoration: underline;
    font-weight: 500;

    &:hover {
        color: ${theme.colors.azulMaisClaro.medio};
    }
`;

const InlineCode = styled.code`
    padding: 2px 6px;
    border-radius: 4px;

    font-family: monospace;
    font-size: 0.95em;

    background: rgba(255, 255, 255, 0.08);
    color: ${theme.colors.azulMaisClaro.claro};
    margin: 0 2px;

    display: inline-block;
    max-width: 100%;
    word-break: break-all;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
`;
