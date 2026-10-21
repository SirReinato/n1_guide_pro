import styled from "styled-components";
import { theme } from "../../theme/theme";
import { useBusca } from "../../context/BuscaContext";
import { Search } from "react-feather";

export default function ManuaisPesquisaForm() {
    const { busca, setBusca, setModalAberto } = useBusca();

    function handleSubmit(event) {
        event.preventDefault();
        setModalAberto(true);
    }

    return (
        <ConteinerManuaisPesquisaFormStl>
            <FormStl onSubmit={handleSubmit}>
                <InputWrapperStl>
                    <Search size={18} />
                    <InputManuaisPesquisaFormStl
                        id="input-busca-principal"
                        type="text"
                        placeholder="Pesquisar solução... (Ctrl + K)"
                        value={busca}
                        onFocus={() => setModalAberto(true)}
                        onClick={() => setModalAberto(true)}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setModalAberto(true);
                        }}
                    />
                </InputWrapperStl>
                <ButtonManuaisPesquisaFormStl
                    type="submit"
                    onClick={() => setModalAberto(true)}
                >
                    Pesquisar
                </ButtonManuaisPesquisaFormStl>
            </FormStl>
        </ConteinerManuaisPesquisaFormStl>
    );
}

const ConteinerManuaisPesquisaFormStl = styled.div`
    display: flex;
    width: 100%;
    max-width: 480px;

    @media (max-width: 768px) {
        margin: 0 auto;
    }
`;

const FormStl = styled.form`
    display: flex;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(7, 22, 41, 0.75);
    border: 1px solid rgba(108, 164, 197, 0.28);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus-within {
        border-color: ${theme.colors.azulMaisClaro.claro};
        box-shadow: 0 0 0 3px rgba(108, 164, 197, 0.18);
    }
`;

const InputWrapperStl = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    color: ${theme.colors.azulMaisClaro.medio};
`;

const InputManuaisPesquisaFormStl = styled.input`
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    padding: 11px 0;
    background: transparent;
    font-size: 0.92rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.clara.claro};

    &::placeholder {
        color: rgba(154, 195, 219, 0.65);
    }
`;

const ButtonManuaisPesquisaFormStl = styled.button`
    border: none;
    padding: 0 22px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: ${theme.fontsFamily.paragrafos};
    color: #ffffff;
    background: ${theme.colors.azulMaisClaro.escuro};
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: ${theme.colors.azul.claro};
    }
`;
