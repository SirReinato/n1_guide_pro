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
                    <TituloHeroStl>N1 GuidePro</TituloHeroStl>
                    <SubtituloHeroStl>
                        Simplificando o Suporte Técnico
                    </SubtituloHeroStl>
                </TitulosWrapperStl>
                <DescricaoHeroStl $primary>
                    Acesse manuais práticos, fluxos de atendimento e
                    procedimentos padronizados para o dia a dia do suporte
                    técnico.
                </DescricaoHeroStl>
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
    padding: 36px 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    border-radius: 18px;
    background: linear-gradient(
        135deg,
        rgba(8, 29, 53, 0.92) 0%,
        rgba(26, 58, 95, 0.58) 100%
    );
    border: 1px solid rgba(108, 164, 197, 0.18);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
    box-sizing: border-box;

    .textBanner {
        display: flex;
        flex-direction: column;
        gap: 16px;
        flex: 1;
        max-width: 720px;
    }

    @media (max-width: 1200px) {
        padding: 28px 32px;
    }

    @media (max-width: 768px) {
        padding: 24px 20px;
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

const TituloHeroStl = styled(TitulosPrincipaisStl)`
    font-size: 2.8rem;
    line-height: 1.12;

    @media (max-width: 1200px) {
        font-size: 2.2rem;
    }
    @media (max-width: 480px) {
        font-size: 1.75rem;
    }
`;

const SubtituloHeroStl = styled(TitulosPrincipaisStl)`
    font-size: 2.1rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.18;

    @media (max-width: 1200px) {
        font-size: 1.65rem;
    }
    @media (max-width: 480px) {
        font-size: 1.35rem;
    }
`;

const DescricaoHeroStl = styled(ParagrafosStl)`
    font-size: 1.1rem;
    line-height: 1.5;
`;

const ImageWrapperStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .ImaBanner {
        max-width: 300px;
        width: 100%;
        height: auto;
        border-radius: 14px;
        filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.38));
    }

    @media (max-width: 1200px) {
        .ImaBanner {
            max-width: 240px;
        }
    }

    @media (max-width: 480px) {
        .ImaBanner {
            max-width: 200px;
        }
    }
`;

const CentralSuporteStl = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${theme.colors.azulMaisClaro.muitoClaro};
    background: rgba(68, 140, 182, 0.24);
    border: 1px solid rgba(154, 195, 219, 0.3);
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
        font-size: 0.72rem;
    }
`;
