import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../../theme/theme";
import instalacoes from "../../data/instalacao.json";

export default function LetreiroHeader() {
    const [itens, setItens] = useState(Object.keys(instalacoes));

    useEffect(() => {
        fetch("/api/manuais")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const cats = Array.from(
                        new Set(data.map((m) => m.categorias?.nome || "Outros"))
                    );
                    if (cats.length > 0) setItens(cats);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <LetreiroWrapper>
            <LetreiroTrack>
                <Texto>🛠️ Base interna N1 GuidePro •</Texto>

                {itens.map((nome) => (
                    <li key={nome}>
                        <Texto>{nome}</Texto>
                    </li>
                ))}
            </LetreiroTrack>
        </LetreiroWrapper>
    );
}

const animacao = keyframes`
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
`;
const LetreiroWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    max-width: 420px;

    background: ${theme.colors.azulMaisClaro.claro};
    border-radius: 8px;
    padding: 8px 0;
`;

const LetreiroTrack = styled.div`
    display: flex;
    width: max-content;
    animation: ${animacao} 15s linear infinite;

    &:hover {
        animation-play-state: paused;
    }
`;

const Texto = styled.span`
    white-space: nowrap;
    padding-right: 32px;

    font-size: ${theme.fontSize.paragrafos.pp};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
`;
