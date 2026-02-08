import styled from "styled-components";

export default function CopyButton({ value }) {
    function copiar() {
        navigator.clipboard.writeText(value);
    }

    return (
        <Button onClick={copiar} title="Copiar">
            📋
        </Button>
    );
}

const Button = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: inherit;
`;
