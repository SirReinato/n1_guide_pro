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
                    <HelpCircle size={15} />
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
    padding: 24px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 28px;
    border-radius: 16px;
    background: linear-gradient(
        135deg,
        rgba(8, 29, 53, 0.92) 0%,
        rgba(26, 58, 95, 0.55) 100%
    );
    border: 1px solid rgba(108, 164, 197, 0.16);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
    box-sizing: border-box;

    .textBanner {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
        max-width: 580px;
    }

    @media (max-width: 1024px) {
        padding: 22px 24px;
    }

    @media (max-width: 768px) {
        padding: 20px 18px;
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
    gap: 4px;
`;

const TituloHeroStl = styled(TitulosPrincipaisStl)`
    font-size: 2.35rem;
    line-height: 1.15;

    @media (max-width: 1200px) {
        font-size: 2rem;
    }
    @media (max-width: 480px) {
        font-size: 1.6rem;
    }
`;

const SubtituloHeroStl = styled(TitulosPrincipaisStl)`
    font-size: 1.75rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.2;

    @media (max-width: 1200px) {
        font-size: 1.45rem;
    }
    @media (max-width: 480px) {
        font-size: 1.2rem;
    }
`;

const DescricaoHeroStl = styled(ParagrafosStl)`
    font-size: 1rem;
    line-height: 1.45;
`;

const ImageWrapperStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .ImaBanner {
        max-width: 230px;
        width: 100%;
        height: auto;
        border-radius: 12px;
        filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35));
    }

    @media (max-width: 1024px) {
        .ImaBanner {
            max-width: 190px;
        }
    }

    @media (max-width: 480px) {
        .ImaBanner {
            max-width: 170px;
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
    padding: 5px 12px;
    border-radius: 999px;
    width: fit-content;
`;

const CentralSuporteTextStl = styled.span`
    font-size: 0.76rem;
    font-family: ${theme.fontsFamily.paragrafos};
    letter-spacing: 0.06em;
    font-weight: 700;
    text-transform: uppercase;

    @media (max-width: 480px) {
        font-size: 0.7rem;
    }
`;
