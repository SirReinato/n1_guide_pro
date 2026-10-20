import { createContext, useContext, useState, useEffect } from "react";
import { getInstalacoesPorCategoria } from "../service/instalacoesService";

const MenuContext = createContext();

export function MenuProvider({ children }) {
    const [categorias, setCategorias] = useState({});
    const [categoriaAtiva, setCategoriaAtiva] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ignorar = false;
        async function carregar() {
            setCarregando(true);
            try {
                const data = await getInstalacoesPorCategoria();
                if (!ignorar) setCategorias(data || {});
            } catch (err) {
                console.error("Erro ao carregar categorias do menu:", err.message);
                if (!ignorar) setCategorias({});
            } finally {
                if (!ignorar) setCarregando(false);
            }
        }
        carregar();
        return () => {
            ignorar = true;
        };
    }, []);

    return (
        <MenuContext.Provider
            value={{
                categorias,
                categoriaAtiva,
                setCategoriaAtiva,
                carregando,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}
