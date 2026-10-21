import styled from "styled-components";
import Link from "next/link";
import { ParagrafosStl, theme, TitulosSecundariosStl } from "../../theme/theme";
import { FileText } from "react-feather";

export default function CardManuais({ nome, descricao, path }) {
    return (
        <Link href={`/posts/${path}`}>
            <CardManuaisStl>
                <IconeStl>
                    <FileText size={20} />
                </IconeStl>
                <ConteudoStl>
                    <TituloStl>{nome}</TituloStl>
                    {descricao && <DescricaoStl>{descricao}</DescricaoStl>}
                    <TagStl>Manual Técnico</TagStl>
                </ConteudoStl>
            </CardManuaisStl>
        </Link>
    );
}

const CardManuaisStl = styled.article`
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 12px;
    background: rgba(14, 38, 68, 0.85);
    border: 1px solid rgba(108, 164, 197, 0.22);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-2px);
        background: rgba(26, 58, 95, 0.92);
        border-color: ${theme.colors.azulMaisClaro.claro};
    }
`;

const IconeStl = styled.div`
    background: rgba(68, 140, 182, 0.22);
    border: 1px solid rgba(108, 164, 197, 0.28);
    color: ${theme.colors.azulMaisClaro.claro};
    padding: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const ConteudoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

const TituloStl = styled(TitulosSecundariosStl)`
    font-size: 1.02rem;
    color: ${theme.colors.clara.medio};
    line-height: 1.3;
`;

const DescricaoStl = styled(ParagrafosStl)`
    font-size: 0.84rem;
    line-height: 1.4;
    color: ${theme.colors.azulMaisClaro.claro};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const TagStl = styled.span`
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${theme.colors.azulMaisClaro.muitoClaro};
    background: rgba(68, 140, 182, 0.28);
    padding: 3px 8px;
    border-radius: 6px;
    width: fit-content;
`;
