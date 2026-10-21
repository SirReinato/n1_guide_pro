import {
    ParagrafosStl,
    theme,
    TitulosPrincipaisStl,
} from "../../../theme/theme";
import styled from "styled-components";
import { HelpCircle } from "react-feather";
import ManuaisPesquisaForm from "../../manuaisPesquisaForm";

export default function Banner() {
    return (
        <ConteinerBannerStl>
            <div className="textBanner">
                <CentralSuporteStl>
                    <HelpCircle size={16} />
                    <CentralSuporteTextStl>
                        Central de Suporte N1 - Guia Interno
                    </CentralSuporteTextStl>
                </CentralSuporteStl>
                <TitulosWrapperStl>
                    <TitulosPrincipaisStl>N1 GuidePro</TitulosPrincipaisStl>
                    <SubtituloHeroStl>
                        Simplificando o Suporte Técnico
                    </SubtituloHeroStl>
                </TitulosWrapperStl>
                <ParagrafosStl $primary>
                    Acesse manuais práticos, fluxos de atendimento e
                    procedimentos padronizados para o dia a dia do suporte
                    técnico.
                </ParagrafosStl>
                <ManuaisPesquisaForm />
            </div>
            <ImageWrapperStl>
                <img
                    className="ImaBanner"
                    src="/assets/img/banner.png"
                    alt="Banner do site, um homem negro de terno segurando um notebook, atras varios itens tecnologicos"
                />
            </ImageWrapperStl>
        </ConteinerBannerStl>
    );
}

const ConteinerBannerStl = styled.section`
    width: 100%;
    padding: 40px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    border-radius: 16px;
    background: linear-gradient(
        135deg,
        rgba(8, 29, 53, 0.92) 0%,
        rgba(26, 58, 95, 0.55) 100%
    );
    border: 1px solid rgba(108, 164, 197, 0.16);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
    box-sizing: border-box;

    .textBanner {
        display: flex;
        flex-direction: column;
        gap: 18px;
        flex: 1;
        max-width: 580px;
    }

    @media (max-width: 1024px) {
        padding: 32px 28px;
    }

    @media (max-width: 768px) {
        padding: 28px 20px;
        flex-direction: column;
        text-align: center;

        .textBanner {
            align-items: center;
            max-width: 100%;
        }
    }
`;

const TitulosWrapperStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const SubtituloHeroStl = styled(TitulosPrincipaisStl)`
    font-size: 2.2rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.2;

    @media (max-width: 1200px) {
        font-size: 1.8rem;
    }
    @media (max-width: 480px) {
        font-size: 1.4rem;
    }
`;

const ImageWrapperStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .ImaBanner {
        max-width: 320px;
        width: 100%;
        height: auto;
        border-radius: 12px;
        filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
    }

    @media (max-width: 1024px) {
        .ImaBanner {
            max-width: 250px;
        }
    }

    @media (max-width: 480px) {
        .ImaBanner {
            max-width: 220px;
        }
    }
`;

const CentralSuporteStl = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${theme.colors.azulMaisClaro.muitoClaro};
    background: rgba(68, 140, 182, 0.22);
    border: 1px solid rgba(154, 195, 219, 0.28);
    padding: 6px 14px;
    border-radius: 999px;
    width: fit-content;
`;

const CentralSuporteTextStl = styled.span`
    font-size: 0.82rem;
    font-family: ${theme.fontsFamily.paragrafos};
    letter-spacing: 0.06em;
    font-weight: 700;
    text-transform: uppercase;

    @media (max-width: 480px) {
        font-size: 0.75rem;
    }
`;
