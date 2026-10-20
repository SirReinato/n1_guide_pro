import { useState } from "react";
import { useMenu } from "../../context/MenuContext";
import Link from "next/link";
import slugify from "../../utils/slogify";
import styled from "styled-components";
import { theme } from "../../theme/theme";
import { Menu, X, BookOpen, ChevronRight } from "react-feather";

export default function Sidebar() {
    const { categorias, categoriaAtiva, setCategoriaAtiva, carregando } =
        useMenu();
    const [aberto, setAberto] = useState(false);

    const nomes = Object.keys(categorias || {});

    return (
        <SidebarWrapper>
            {/* Botão hamburguer visível apenas em mobile */}
            <BtnAbrirMobile onClick={() => setAberto(true)}>
                <Menu size={20} />
            </BtnAbrirMobile>

            {/* Sidebar fixa (desktop). Em mobile fica oculta via CSS. */}
            <SidebarStl>
                <SidebarHeaderStl>
                    <LogoStl>
                        <BookOpen size={20} />
                        <span>N1 GuidePro</span>
                    </LogoStl>
                </SidebarHeaderStl>

                <NavStl>
                    {carregando ? (
                        <CarregandoStl>Carregando módulos...</CarregandoStl>
                    ) : nomes.length === 0 ? (
                        <VazioStl>Nenhum módulo encontrado</VazioStl>
                    ) : (
                        nomes.map((nome) => {
                            const ativo = categoriaAtiva === nome;
                            const id = slugify(nome);
                            return (
                                <ItemStl
                                    key={nome}
                                    $ativo={ativo}
                                    onClick={() => setCategoriaAtiva(nome)}
                                >
                                    <Link href={`#${id}`} passHref>
                                        <ItemLink $ativo={ativo}>
                                            <ChevronRight size={14} />
                                            {nome}
                                        </ItemLink>
                                    </Link>
                                </ItemStl>
                            );
                        })
                    )}
                </NavStl>
            </SidebarStl>

            {/* Drawer mobile */}
            {aberto && (
                <>
                    <OverlayStl onClick={() => setAberto(false)} />
                    <DrawerStl $aberto={true}>
                        <DrawerHeaderStl>
                            <LogoStl>
                                <BookOpen size={20} />
                                <span>N1 GuidePro</span>
                            </LogoStl>
                            <BtnFechar onClick={() => setAberto(false)}>
                                <X size={20} />
                            </BtnFechar>
                        </DrawerHeaderStl>
                        <NavStl>
                            {nomes.map((nome) => {
                                const ativo = categoriaAtiva === nome;
                                return (
                                    <ItemStl
                                        key={nome}
                                        $ativo={ativo}
                                        onClick={() => {
                                            setCategoriaAtiva(nome);
                                            setAberto(false);
                                        }}
                                    >
                                        <Link href={`#${slugify(nome)}`} passHref>
                                            <ItemLink $ativo={ativo}>
                                                <ChevronRight size={14} />
                                                {nome}
                                            </ItemLink>
                                        </Link>
                                    </ItemStl>
                                );
                            })}
                        </NavStl>
                    </DrawerStl>
                </>
            )}
        </SidebarWrapper>
    );
}

const SidebarWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const BtnAbrirMobile = styled.div`
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.claro};
    border-radius: 8px;
    cursor: pointer;
    z-index: 30;
    margin: 8px;

    @media (max-width: 768px) {
        display: flex;
        position: fixed;
        top: 96px;
        left: 12px;
    }
`;

const SidebarStl = styled.aside`
    width: 280px;
    flex-shrink: 0;
    position: fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.claro};
    z-index: 20;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.25);

    @media (max-width: 768px) {
        display: none;
    }
`;

const SidebarHeaderStl = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px;
    border-bottom: 1px solid ${theme.colors.azul.medio};
`;

const LogoStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.1rem;
    font-weight: 400;
    color: ${theme.colors.clara.claro};
`;

const NavStl = styled.nav`
    padding: 16px 0;
    overflow-y: auto;
`;

const ItemStl = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 18px;
    cursor: pointer;
    border-left: 3px solid transparent;
    background: ${(props) =>
        props.$ativo
            ? theme.colors.azulMaisClaro.escuro
            : "transparent"};
    color: ${theme.colors.clara.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    transition: background 0.2s ease;

    &:hover {
        background: ${theme.colors.azul.medio};
    }
`;

const ItemLink = styled.a`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    color: inherit;
    text-decoration: none;
    font-weight: ${(props) => (props.$ativo ? "700" : "400")};

    &:hover {
        text-decoration: none;
        opacity: 0.9;
    }
`;

const CarregandoStl = styled.div`
    padding: 16px 18px;
    font-size: 0.85rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-style: italic;
`;

const VazioStl = styled.div`
    padding: 16px 18px;
    font-size: 0.85rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-style: italic;
`;

const OverlayStl = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 25;
    backdrop-filter: blur(2px);
`;

const DrawerStl = styled.aside`
    position: fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    width: 280px;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.claro};
    z-index: 30;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.25s ease;

    @keyframes slideIn {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @media (min-width: 769px) {
        display: none;
    }
`;

const DrawerHeaderStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    border-bottom: 1px solid ${theme.colors.azul.medio};
`;

const BtnFechar = styled.button`
    background: transparent;
    border: none;
    color: ${theme.colors.clara.claro};
    cursor: pointer;
    padding: 4px;
    line-height: 1;
`;
