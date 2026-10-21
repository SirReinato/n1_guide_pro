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
    max-width: 480px;

    background: rgba(26, 58, 95, 0.55);
    border: 1px solid rgba(108, 164, 197, 0.22);
    border-radius: 999px;
    padding: 7px 16px;
`;

const LetreiroTrack = styled.div`
    display: flex;
    align-items: center;
    width: max-content;
    animation: ${animacao} 18s linear infinite;

    &:hover {
        animation-play-state: paused;
    }
`;

const Texto = styled.span`
    white-space: nowrap;
    padding-right: 28px;

    font-size: 0.82rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.claro};
    letter-spacing: 0.02em;
`;
