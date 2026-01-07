import styled from "styled-components";
import { ParagrafosStl, TitulosPrincipaisStl } from "../../../theme/theme";

export default function Sobre() {
    return (
        <ConteinerSobreStl>
            <img
                className="imgSobre"
                src="/assets/img/n1.png"
                alt="Banner do site, um homem negro de terno segurando um notebook, atras varios itens tecnologicos"
            />
            <ConteinerTextSobreStl>
                <TitulosPrincipaisStl>Sobre</TitulosPrincipaisStl>
                <ParagrafosStl className="ajustesParagrafo">
                    N1 GuidePro é mais do que um manual de suporte técnico. É
                    uma plataforma em constante evolução, projetada para
                    aprimorar as tecnologias Next.js, Styled-Components e
                    integrações com APIs, oferecendo guias práticos e eficientes
                    para a equipe de N1.
                </ParagrafosStl>
            </ConteinerTextSobreStl>
        </ConteinerSobreStl>
    );
}

const ConteinerSobreStl = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 12%;
    background: linear-gradient(to right, #fefaf4, #e3edf4, #bad5e5, #9fc8e0);
    @media (min-width: 1401px) {
        padding: 16px 16%;
        .imgSobre {
            width: 40%;
        }
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
        .imgSobre {
            width: 46%;
        }
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        padding: 16px 2%;
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 8px;
        .imgSobre {
            width: 100%;
        }
    }
`;

const ConteinerTextSobreStl = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 30%;
    .ajustesParagrafo {
        line-height: 40px;
        letter-spacing: 0.1em;
    }
    @media (min-width: 1401px) {
        width: 46%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        width: 46%;
        .ajustesParagrafo {
            line-height: 30px;
            letter-spacing: 0.1em;
        }
    }
    @media (max-width: 431px) {
        width: 100%;
    }
`;
