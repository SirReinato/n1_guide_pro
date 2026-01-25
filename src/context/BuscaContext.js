import { createContext, useContext, useState } from "react";

const BuscaContext = createContext();

export function BuscaProvider({ children }) {
    const [busca, setBusca] = useState("");

    return (
        <BuscaContext.Provider value={{ busca, setBusca }}>
            {children}
        </BuscaContext.Provider>
    );
}

export function useBusca() {
    return useContext(BuscaContext);
}
