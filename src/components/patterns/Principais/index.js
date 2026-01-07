import ListaDeItens from "../../../components/ListaDeItens";
import { TitulosSecundariosStl } from "../../../theme/theme";
import styled from "styled-components";

export default function Principais() {
    return (
        <PrincipaisConteinerStl>
            <TitulosSecundariosStl>Principais Problemas</TitulosSecundariosStl>
            <ListaPrincipaisStl>
                {aListaPrincipais.map((dados, index) => {
                    return (
                        <ListaDeItens
                            nome={dados.nome}
                            key={dados.id}
                            posicao={index + 1}
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
    padding: 16px 12%;
    flex-direction: column;
    gap: 32px;
    background: linear-gradient(to right, #a7d4eb, #f5f7f9);
    @media (min-width: 1401px) {
        padding: 64px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
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
    },
    {
        id: 2,
        nome: "Instalação do Qlik Sense/View",
    },
    {
        id: 3,
        nome: "Problema no Authenticator",
    },
    {
        id: 4,
        nome: "Mapeamento Pasta Esporte",
    },
    {
        id: 5,
        nome: "Instalação do Qlik Sense/View",
    },
    {
        id: 6,
        nome: "Problema no Authenticator",
    },
    {
        id: 7,
        nome: "Mapeamento Pasta Esporte",
    },
];
