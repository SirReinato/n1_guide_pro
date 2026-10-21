import styled, { keyframes } from "styled-components";
import { theme } from "../../theme/theme";
import { useMenu } from "../../context/MenuContext";
import instalacoes from "../../data/instalacao.json";

export default function LetreiroHeader() {
    const { categorias } = useMenu() || {};
    const nomesMenu = Object.keys(categorias || {});
    const itens =
        nomesMenu.length > 0 ? nomesMenu : Object.keys(instalacoes);

    // Duplica a lista para que o loop translateX(-50%) seja contínuo sem pulos
    const itensLoop = [...itens, ...itens];

    return (
        <LetreiroWrapper aria-label="Categorias disponíveis na base de conhecimento">
            <LetreiroTrack>
                {itensLoop.map((nome, idx) => (
                    <ItemLetreiro key={`${nome}-${idx}`}>
                        {idx % itens.length === 0 && (
                            <DestaqueTexto>🛠️ Base interna N1 GuidePro •</DestaqueTexto>
                        )}
                        <Texto>{nome} •</Texto>
                    </ItemLetreiro>
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
    max-width: 520px;

    background: rgba(26, 58, 95, 0.55);
    border: 1px solid rgba(108, 164, 197, 0.22);
    border-radius: 999px;
    padding: 7px 16px;
`;

const LetreiroTrack = styled.div`
    display: flex;
    align-items: center;
    width: max-content;
    animation: ${animacao} 24s linear infinite;

    &:hover {
        animation-play-state: paused;
    }
`;

const ItemLetreiro = styled.span`
    display: inline-flex;
    align-items: center;
`;

const DestaqueTexto = styled.span`
    white-space: nowrap;
    padding-right: 20px;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.clara.claro};
    letter-spacing: 0.02em;
`;

const Texto = styled.span`
    white-space: nowrap;
    padding-right: 20px;

    font-size: 0.82rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.claro};
    letter-spacing: 0.02em;
`;
