import {
    ParagrafosStl,
    theme,
    TitulosPrincipaisStl,
} from "../../../theme/theme";
import styled from "styled-components";
import { HelpCircle } from "react-feather";

export default function Banner() {
    return (
        <ConteinerBannerStl>
            <div className="textBanner">
                <CentralSuporteStl>
                    <HelpCircle size={18} style={{ marginRight: "8px" }} />
                    Central de Suporte N1 - Guia Interno
                </CentralSuporteStl>
                <TitulosPrincipaisStl>N1 GuidePro</TitulosPrincipaisStl>
                <TitulosPrincipaisStl>
                    Simplificando o Suporte Técnico
                </TitulosPrincipaisStl>
                <ParagrafosStl $primary>
                    Acesse manuais práticos, flucos de atendimetno e
                    procedimetnos padronizados para o dia a dia do suporte
                    técnico.
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

const CentralSuporteStl = styled.span`
    font-size: ${theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
    background: ${theme.colors.azulMaisClaro.claro};
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 16px;
    width: fit-content;
`;
