import { createContext, useContext, useState, useEffect } from "react";
import instalacoesLocal from "../data/instalacao.json";

const BuscaContext = createContext();

export function BuscaProvider({ children }) {
    const [busca, setBusca] = useState("");
    const [todosOsItens, setTodosOsItens] = useState(
        Object.values(instalacoesLocal).flat()
    );

    useEffect(() => {
        // Busca a lista atualizada de manuais aprovados da API
        fetch("/api/manuais")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setTodosOsItens(data);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <BuscaContext.Provider value={{ busca, setBusca, todosOsItens, setTodosOsItens }}>
            {children}
        </BuscaContext.Provider>
    );
}

export function useBusca() {
    return useContext(BuscaContext);
}

