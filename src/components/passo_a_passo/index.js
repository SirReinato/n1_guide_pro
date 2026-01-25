import styled from "styled-components";
import { ParagrafosStl, theme } from "../../theme/theme";
import { useState } from "react";

export default function PassoAPasso({ titulo, paragrafo, passo, img }) {
    const [imgErro, setImgErro] = useState(false);

    const mostrarImagem = img?.trim() && !imgErro;

    return (
        <ConteinerPassoStl>
            <SubTituloPassoStl>
                {passo} - {titulo}
            </SubTituloPassoStl>

            <DescricaoPassoStl $primary $gg>
                {paragrafo}
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
    align-items: start;
    flex-direction: column;
    gap: 16px;
    padding: 16px 8px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    .passoImg {
        max-width: 100%;
        padding: 8px 0;
    }
`;

const SubTituloPassoStl = styled.h3`
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: ${theme.fontsFamily.titulos};
    color: ${theme.colors.clara.escuro};
`;

const DescricaoPassoStl = styled(ParagrafosStl)`
    white-space: pre-line;
    line-height: 32px;
`;
