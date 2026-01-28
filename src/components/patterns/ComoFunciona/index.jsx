import styled from "styled-components";
import { theme } from "../../../theme/theme";
import ListaDeItens from "../../ListaDeItens";

export default function ComoFunciona() {
    return (
        <ComoFuncionaContainerStl>
            <TituloComoFuncionaStl>
                Como Funciona o N1 GuidePro
            </TituloComoFuncionaStl>
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

const ComoFuncionaContainerStl = styled.div`
    width: 100%;
    display: flex;
    padding: 16px 12%;
    flex-direction: column;
    gap: 16px;
    background: linear-gradient(
        ${theme.colors.azulMaisClaro.muitoClaro},
        ${theme.colors.azulMaisClaro.claro}
    );
    @media (min-width: 1401px) {
        padding: 32px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 32px 6%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        display: none;
    }
`;

const TituloComoFuncionaStl = styled.h2`
    font-size: ${theme.fontSize.titulosSecundarios.gg};
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    color: ${theme.colors.azul.medio};
`;

const CardsComoFuncionaStl = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200px) {
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
    }
`;

const comoFunciona = [
    {
        id: 1,
        nome: "Busque o problema",
        icon: "Search",
        descricao: "Use a busca ou navegue pelas categorias",
    },
    {
        id: 2,
        nome: "Siga o manual",
        icon: "BookOpen",
        descricao: "Tutoriais objetivos, com prints e validações",
    },
    {
        id: 3,
        nome: "Resolva com confiança",
        icon: "CheckCircle",
        descricao: "Procedimentos padronizados e testados",
    },
];
