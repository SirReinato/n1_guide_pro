import CardManuais from "../../../components/CardManuais";
import styled from "styled-components";
import instalacoes from "../../../../instalacao.json";
import { TitulosPrincipaisStl } from "../../../theme/theme";

export default function Manuais() {
    const titulos = Object.keys(instalacoes);
    return (
        <ManuaisStl>
            {titulos.map((dados) => {
                return (
                    <ConteinerDosManuais>
                        <TitulosPrincipaisStl key={dados}>
                            {dados}
                        </TitulosPrincipaisStl>

                        <ConteinerManualDuplo>
                            {instalacoes[dados].map((dados) => {
                                return (
                                    <CardManuais
                                        path={dados.id}
                                        key={dados.id}
                                        nome={dados.nome}
                                        descricao={dados.descricao}
                                    />
                                );
                            })}
                        </ConteinerManualDuplo>
                    </ConteinerDosManuais>
                );
            })}
        </ManuaisStl>
    );
}

const ManuaisStl = styled.section`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding: 64px 12%;
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
        padding: 32px 2%;
        flex-direction: column;
    }
`;

const ConteinerDosManuais = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
`;

const ConteinerManualDuplo = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 32px;
`;
