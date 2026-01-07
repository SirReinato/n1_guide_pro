import {
    ParagrafosStl,
    theme,
    TitulosPrincipaisStl,
} from "../../../theme/theme";
import styled from "styled-components";

export default function Banner() {
    return (
        <ConteinerBannerStl>
            <div className="textBanner">
                <TitulosPrincipaisStl>
                    N1 GuidePro: Simplificando o Suporte Técnico
                </TitulosPrincipaisStl>
                <ParagrafosStl $primary>
                    Acesse tudo o que sua equipe precisa para realizar
                    instalações, configurações e atendimentos com precisão e
                    rapidez.
                </ParagrafosStl>
            </div>
            <img
                className="ImaBanner"
                src="/assets/img/banner.png"
                alt="Banner do site, um homem negro de terno segurando um notebook, atras varios itens tecnologicos"
            />
        </ConteinerBannerStl>
    );
}

const ConteinerBannerStl = styled.div`
    width: 100%;
    padding: 32px 12%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${(props) =>
        props.$primary ? theme.colors.azul.claro : theme.colors.azul.escuro};
    .textBanner {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 50%;
    }
    @media (min-width: 1401px) {
        padding: 16px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        padding: 16px 2%;
        flex-direction: column;

        .textBanner {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            gap: 16px;
            width: 100%;
        }
        .ImaBanner {
        }
    }
`;
