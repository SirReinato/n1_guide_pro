import styled from "styled-components";
import { theme } from "../../../theme/theme";
import ListaDeItens from "../../ListaDeItens";

export default function ComoFunciona() {
    return (
        <ComoFuncionaContainerStl>
            <HeaderSectionStl>
                <TituloComoFuncionaStl>
                    Como Funciona o N1 GuidePro
                </TituloComoFuncionaStl>
                <SubtituloSectionStl>
                    Fluxo rápido de consulta para agilizar seu atendimento
                </SubtituloSectionStl>
            </HeaderSectionStl>
            <CardsComoFuncionaStl>
                {comoFunciona.map((item) => {
                    return (
                        <ListaDeItens
                            $spaceBetween
                            key={item.id}
                            nome={item.nome}
                            descricao={item.descricao}
                            icon={item.icon}
                        />
                    );
                })}
            </CardsComoFuncionaStl>
        </ComoFuncionaContainerStl>
    );
}

const ComoFuncionaContainerStl = styled.section`
    width: 100%;
    display: flex;
    padding: 22px 36px;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
    background: rgba(8, 29, 53, 0.55);
    border: 1px solid rgba(108, 164, 197, 0.14);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;

    @media (max-width: 1024px) {
        padding: 20px 24px;
    }

    @media (max-width: 480px) {
        padding: 18px 16px;
    }
`;

const HeaderSectionStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TituloComoFuncionaStl = styled.h2`
    font-size: 1.3rem;
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    color: ${theme.colors.clara.claro};
`;

const SubtituloSectionStl = styled.p`
    font-size: 0.86rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.medio};
`;

const CardsComoFuncionaStl = styled.ul`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-items: stretch;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
    }
`;

const comoFunciona = [
    {
        id: 1,
        nome: "Busque o problema",
        icon: "Search",
        descricao: "Use a busca rápida (Ctrl + K) ou navegue pelas categorias ao lado",
    },
    {
        id: 2,
        nome: "Siga o manual",
        icon: "BookOpen",
        descricao: "Tutoriais objetivos, com prints, comandos prontos e validações",
    },
    {
        id: 3,
        nome: "Resolva com confiança",
        icon: "CheckCircle",
        descricao: "Procedimentos padronizados e prontos para copiar para o chamado",
    },
];
