import styled from "styled-components";
import Link from "next/link";
import { ParagrafosStl, theme, TitulosSecundariosStl } from "../../theme/theme";
import { FileText } from "react-feather";

export default function CardManuais({ nome, descricao, path }) {
    return (
        <Link href={`/posts/${path}`} passHref>
            <CardManuaisStl>
                <IconeStl>
                    <FileText size={24} />
                </IconeStl>
                <ConteudoStl>
                    <TituloStl>{nome}</TituloStl>
                    <DescricaoStl>{descricao}</DescricaoStl>
                    <TagStl>Manual Técnico</TagStl>
                </ConteudoStl>
            </CardManuaisStl>
        </Link>
    );
}

const CardManuaisStl = styled.article`
    width: 100%;
    min-height: 160px;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    background: ${theme.colors.azulMaisClaro.muitoClaro};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 16px rgba(0, 0, 0, 0.25);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const IconeStl = styled.div`
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    padding: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ConteudoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TituloStl = styled(TitulosSecundariosStl)`
    font-size: ${theme.fontSize.titulosSecundarios.mm};
    color: ${theme.colors.azul.escuro};
`;

const DescricaoStl = styled(ParagrafosStl)`
    font-size: ${theme.fontSize.paragrafos.pp};
    color: ${theme.colors.azul.medio};
`;

const TagStl = styled.span`
    font-size: 0.875rem;
    font-weight: bold;
    color: ${theme.colors.azulMaisClaro.muitoClaro};
    background: ${theme.colors.azulMaisClaro.escuro};
    padding: 4px 8px;
    border-radius: 6px;
    width: fit-content;
`;
