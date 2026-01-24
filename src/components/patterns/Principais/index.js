import ListaDeItens from "../../../components/ListaDeItens";
import { theme, TitulosSecundariosStl } from "../../../theme/theme";
import styled from "styled-components";

export default function Principais() {
    return (
        <PrincipaisConteinerStl>
            <TitulosSecundariosStl>Principais Problemas</TitulosSecundariosStl>
            <ListaPrincipaisStl>
                {aListaPrincipais.map((dados) => {
                    return (
                        <ListaDeItens
                            nome={dados.nome}
                            key={dados.id}
                            descricao={dados.descricao}
                        />
                    );
                })}
            </ListaPrincipaisStl>
        </PrincipaisConteinerStl>
    );
}

const PrincipaisConteinerStl = styled.div`
    width: 100%;
    display: flex;
    padding: 32px 12%;
    flex-direction: column;
    gap: 32px;
    background: radial-gradient(
        ${theme.colors.azulMaisClaro.muitoClaro},
        ${theme.colors.azulMaisClaro.medio}
    );
    @media (min-width: 1401px) {
        padding: 64px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 32px 6%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        padding: 16px 2%;
    }
`;

const ListaPrincipaisStl = styled.ul`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200px) {
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        gap: 8px;
    }
`;

const aListaPrincipais = [
    {
        id: 1,
        nome: "Configuração do serproID",
        descricao:
            "Passo a pasta para configurar eailzar e acesso conestamente →",
    },
    {
        id: 2,
        nome: "Instalação do Qlik Sense/View",
        descricao:
            "Instalação do Qlik Sense/View ucião do procedimentos padronizados →",
    },
    {
        id: 3,
        nome: "Problema no Authenticator",
        descricao:
            "Prdronização padronização.re restados e acessos pacossomaliamento →",
    },
    {
        id: 4,
        nome: "Mapeamento Pasta Esporte",
        descricao: "Passo a pasta para configurar cre e acesso conetamente →",
    },

    {
        id: 6,
        nome: "Problema no Authenticator",
        descricao:
            "Prdronização padronização.re restados e acessos pacossomaliamento →",
    },
    {
        id: 7,
        nome: "Mapeamento Pasta Esporte",
        descricao:
            "Prdronização padronização.re restados e acessos pacossomaliamento →",
    },
];
