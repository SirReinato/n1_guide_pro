import { ParagrafosStl, theme, TitulosSecundariosStl } from "../../theme/theme";
import styled from "styled-components";
import Link from "next/link";

export default function CardManuais({ nome, descricao, path }) {
    return (
        <CardManuaisStl>
            <Link href={`/posts/${path}`}>
                <AjustesCard>
                    <TitulosSecundariosStl>{nome}</TitulosSecundariosStl>
                    <ParagrafosStl>{descricao}</ParagrafosStl>
                </AjustesCard>
            </Link>
        </CardManuaisStl>
    );
}

const CardManuaisStl = styled.article`
    width: 42%;
    min-height: 129px;
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-radius: 8px;
    background: ${theme.colors.azulMaisClaro.claro};
    box-shadow: 0 4px 8px rgba(155, 148, 148, 0.1),
        0 6px 20px rgba(247, 238, 238, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }
    @media (min-width: 1401px) {
        width: 48%;
    }
    @media (min-width: 768px) and (max-width: 1400px) {
        width: 48%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        width: 100%;
    }
`;

const AjustesCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
