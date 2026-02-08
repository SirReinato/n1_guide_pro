import styled from "styled-components";
import { theme } from "../../theme/theme";
import { useBusca } from "../../context/BuscaContext";

export default function ManuaisPesquisaForm() {
    const { busca, setBusca } = useBusca();

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Pesquisar por:", busca);
    }

    return (
        <ConteinerManuaisPesquisaFormStl>
            <form onSubmit={handleSubmit}>
                <InputManuaisPesquisaFormStl
                    type="text"
                    placeholder="Pesquisar solução..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <ButtonManuaisPesquisaFormStl type="submit">
                    Pesquisar
                </ButtonManuaisPesquisaFormStl>
            </form>
        </ConteinerManuaisPesquisaFormStl>
    );
}

const ConteinerManuaisPesquisaFormStl = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    @media (max-width: 480px) {
        margin: 0 auto;
    }
`;
const InputManuaisPesquisaFormStl = styled.input`
    border: none;
    padding: 16px;
    font-size: ${theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
    border-radius: 8px 0 0 8px;
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        width: 63%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        width: 68%;
    }
`;
const ButtonManuaisPesquisaFormStl = styled.button`
    border: none;
    padding: 16px;
    font-size: ${theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.clara.claro};
    background: ${theme.colors.azulMaisClaro.escuro};
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    &:hover {
        background: ${theme.colors.clara.bgGeral};
        color: ${theme.colors.azulMaisClaro.claro};
    }
`;
