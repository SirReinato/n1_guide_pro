import styled from "styled-components";
import { ParagrafosStl, theme } from "../../theme/theme";
import { useState } from "react";
import RichText from "../RichText/RichText";

export default function PassoAPasso({ titulo, paragrafo, passo, img }) {
    const [imgErro, setImgErro] = useState(false);

    const mostrarImagem = img?.trim() && !imgErro;

    return (
        <ConteinerPassoStl>
            <SubTituloPassoStl>
                {passo} - {titulo}
            </SubTituloPassoStl>

            <DescricaoPassoStl as={"div"} $primary $gg>
                <RichText text={paragrafo} />
            </DescricaoPassoStl>

            {mostrarImagem && (
                <img
                    className="passoImg"
                    src={img}
                    alt={titulo}
                    onError={() => setImgErro(true)}
                />
            )}
        </ConteinerPassoStl>
    );
}

const ConteinerPassoStl = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    box-sizing: border-box;
    padding: 22px 24px;
    border-radius: 12px;
    background: rgba(14, 38, 68, 0.6);
    border: 1px solid rgba(108, 164, 197, 0.14);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);

    .passoImg {
        max-width: 100%;
        border-radius: 8px;
        margin-top: 4px;
    }

    @media (max-width: 480px) {
        padding: 16px;
    }
`;

const SubTituloPassoStl = styled.h3`
    font-size: 1.35rem;
    font-weight: 600;
    font-family: ${theme.fontsFamily.titulos};
    color: ${theme.colors.clara.medio};
`;

const DescricaoPassoStl = styled(ParagrafosStl)`
    white-space: pre-line;
    font-size: 1.05rem;
    line-height: 1.65;
    width: 100%;

    @media (max-width: 480px) {
        font-size: 0.92rem;
        box-sizing: border-box;
    }
`;
