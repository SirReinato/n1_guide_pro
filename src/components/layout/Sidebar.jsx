import { useState } from "react";
import { useMenu } from "../../context/MenuContext";
import Link from "next/link";
import slugify from "../../utils/slogify";
import styled from "styled-components";
import { theme } from "../../theme/theme";
import {
    Menu,
    X,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    FileText,
} from "react-feather";

export default function Sidebar({ colapsado, onToggleColapsado }) {
    const { categorias, categoriaAtiva, setCategoriaAtiva, carregando } =
        useMenu();
    const [aberto, setAberto] = useState(false);
    const [expandidas, setExpandidas] = useState({});

    const nomes = Object.keys(categorias || {});

    /* Categoria: marca como ativa, expande e rola até a section */
    const handleCategoriaClick = (e, nome) => {
        e.preventDefault();
        setCategoriaAtiva(nome);
        setExpandidas((prev) => ({ ...prev, [nome]: true }));
        setTimeout(() => {
            const el = document.getElementById(slugify(nome));
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 120);
    };

    const renderMenu = (isDrawer) => {
        const compacto = colapsado && !isDrawer;
        return (
            <NavStl>
                {carregando ? (
                    <CarregandoStl>Carregando módulos...</CarregandoStl>
                ) : nomes.length === 0 ? (
                    <VazioStl>Nenhum módulo encontrado</VazioStl>
                ) : (
                    nomes.map((nome) => {
                        const itens = categorias[nome] || [];
                        const expandida = expandidas[nome] && !compacto;
                        const ativa = categoriaAtiva === nome;
                        return (
                            <GrupoStl key={nome}>
                                <CategoriaStl
                                    $ativo={ativa}
                                    $compacto={compacto}
                                    onClick={(e) => {
                                        if (compacto) {
                                            setCategoriaAtiva(nome);
                                        } else {
                                            handleCategoriaClick(e, nome);
                                        }
                                    }}
                                >
                                    {compacto ? (
                                        <span title={nome}>
                                            <BookOpen size={16} />
                                        </span>
                                    ) : (
                                        <>
                                            <span>{nome}</span>
                                            <SetaStl $expandida={expandida}>
                                                <ChevronRight size={12} />
                                            </SetaStl>
                                        </>
                                    )}
                                </CategoriaStl>

                                {expandida && (
                                    <SubListaStl>
                                        {itens.map((item) => (
                                            <ItemStl key={item.id}>
                                                <Link
                                                    href={`/posts/${item.id}`}
                                                    passHref
                                                >
                                                    <ItemLink>
                                                        <FileText size={12} />
                                                        <span>{item.nome}</span>
                                                    </ItemLink>
                                                </Link>
                                            </ItemStl>
                                        ))}
                                    </SubListaStl>
                                )}
                            </GrupoStl>
                        );
                    })
                )}
            </NavStl>
        );
    };

    return (
        <>
            {/* Botão hamburguer visível apenas em mobile */}
            <BtnAbrirMobile onClick={() => setAberto(true)}>
                <Menu size={20} />
            </BtnAbrirMobile>

            {/* Sidebar sticky (desktop). Em mobile fica oculta via CSS. */}
            <SidebarStl $colapsado={colapsado}>
                <BtnRetrairStl
                    onClick={onToggleColapsado}
                    title={colapsado ? "Expandir menu" : "Retrair menu"}
                >
                    {colapsado ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </BtnRetrairStl>

                <SidebarHeaderStl $colapsado={colapsado}>
                    <LogoStl $colapsado={colapsado}>
                        <BookOpen size={20} />
                        <span>N1 GuidePro</span>
                    </LogoStl>
                </SidebarHeaderStl>

                {renderMenu(false)}
            </SidebarStl>

            {/* Drawer mobile */}
            {aberto && (
                <>
                    <OverlayStl onClick={() => setAberto(false)} />
                    <DrawerStl>
                        <DrawerHeaderStl>
                            <LogoStl>
                                <BookOpen size={20} />
                                <span>N1 GuidePro</span>
                            </LogoStl>
                            <BtnFechar onClick={() => setAberto(false)}>
                                <X size={20} />
                            </BtnFechar>
                        </DrawerHeaderStl>
                        {renderMenu(true)}
                    </DrawerStl>
                </>
            )}
        </>
    );
}

/* Sidebar sticky no fluxo — gruda ao rolar */
const SidebarStl = styled.aside`
    display: none;
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: calc(100vh - 80px);
    overflow-y: auto;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.claro};
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.25);
    transition: width 0.25s ease;
    z-index: 20;

    ${(props) =>
        props.$colapsado &&
        `
        width: 72px;
    `}

    @media (min-width: 769px) {
        display: block;
    }
`;

/* Botão retrair na borda direita da sidebar */
const BtnRetrairStl = styled.button`
    position: absolute;
    top: 12px;
    right: -18px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${theme.colors.azul.medio};
    color: ${theme.colors.clara.claro};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: background 0.2s ease;

    &:hover {
        background: ${theme.colors.azul.claro};
    }
`;

const SidebarHeaderStl = styled.div`
    display: flex;
    align-items: center;
    padding: 20px 16px;
    border-bottom: 1px solid ${theme.colors.azul.medio};

    ${(props) =>
        props.$colapsado &&
        `
        padding: 16px;
        justify-content: center;
    `}
`;

const LogoStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.1rem;
    font-weight: 400;
    color: ${theme.colors.clara.claro};
    white-space: nowrap;
    overflow: hidden;

    ${(props) =>
        props.$colapsado &&
        `
        span { display: none; }
    `}
`;

const NavStl = styled.nav`
    padding: 8px 0 24px;
    overflow-y: auto;
`;

const GrupoStl = styled.div``;

const CategoriaStl = styled.a`
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.$compacto ? "center" : "space-between")};
    gap: 8px;
    width: 100%;
    padding: 10px 18px;
    cursor: pointer;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    background: ${(props) =>
        props.$ativo ? theme.colors.azulMaisClaro.escuro : "transparent"};
    color: ${theme.colors.clara.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: ${(props) => (props.$ativo ? "700" : "600")};
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: background 0.2s ease;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
        background: ${theme.colors.azul.medio};
        text-decoration: none;
    }

    ${(props) =>
        props.$compacto &&
        `
        padding: 12px 8px;
    `}
`;

const SetaStl = styled.span`
    display: flex;
    align-items: center;
    transition: transform 0.25s ease;
    opacity: 0.7;
    transform: ${(props) => (props.$expandida ? "rotate(90deg)" : "rotate(0)")};
`;

const SubListaStl = styled.div`
    max-height: 420px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.18);
`;

const ItemStl = styled.div`
    display: flex;
    align-items: center;
`;

const ItemLink = styled.a`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 18px 8px 34px;
    color: ${theme.colors.clara.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.82rem;
    font-weight: 400;
    text-decoration: none;
    opacity: 0.85;
    transition: background 0.2s ease, opacity 0.2s ease;

    &:hover {
        background: ${theme.colors.azul.medio};
        opacity: 1;
        text-decoration: none;
    }

    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

/* Hamburguer mobile (fixed) */
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
    overflow-y: auto;
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
