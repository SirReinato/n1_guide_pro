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
    padding: 32px 52px;
    flex-direction: column;
    gap: 22px;
    border-radius: 18px;
    background: rgba(8, 29, 53, 0.58);
    border: 1px solid rgba(108, 164, 197, 0.16);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
    box-sizing: border-box;

    @media (max-width: 1200px) {
        padding: 26px 32px;
    }

    @media (max-width: 480px) {
        padding: 20px 16px;
    }
`;

const HeaderSectionStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const TituloComoFuncionaStl = styled.h2`
    font-size: 1.55rem;
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    color: ${theme.colors.clara.claro};
`;

const SubtituloSectionStl = styled.p`
    font-size: 0.96rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.medio};
`;

const CardsComoFuncionaStl = styled.ul`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
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
