import { useState, useEffect } from "react";
import { useMenu } from "../../context/MenuContext";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { theme } from "../../theme/theme";
import {
    Menu,
    X,
    Folder,
    ChevronRight,
    ChevronLeft,
    FileText,
    Home,
    Layers,
} from "react-feather";

export default function Sidebar({ colapsado, onToggleColapsado }) {
    const { categorias, categoriaAtiva, setCategoriaAtiva, carregando } =
        useMenu();
    const router = useRouter();
    const [aberto, setAberto] = useState(false);
    const [expandidas, setExpandidas] = useState({});

    const nomes = Object.keys(categorias || {});
    const activePostId = router?.query?.id ? String(router.query.id) : null;

    /* Expande automaticamente a categoria do manual aberto ou a primeira categoria */
    useEffect(() => {
        if (!nomes.length) return;

        if (activePostId) {
            for (const nome of nomes) {
                const itens = categorias[nome] || [];
                if (itens.some((item) => String(item.id) === activePostId)) {
                    setCategoriaAtiva(nome);
                    setExpandidas((prev) => ({ ...prev, [nome]: true }));
                    return;
                }
            }
        }
    }, [activePostId, nomes.length]);

    const handleCategoriaClick = (e, nome) => {
        e.preventDefault();
        setCategoriaAtiva(nome);
        setExpandidas((prev) => ({ ...prev, [nome]: !prev[nome] }));
    };

    const renderMenu = (isDrawer) => {
        const compacto = colapsado && !isDrawer;
        const isHome = router?.pathname === "/";

        return (
            <NavStl>
                {/* Link Início estilo Wiki.js */}
                <HomeLinkWrapper $compacto={compacto}>
                    <Link href="/" passHref legacyBehavior>
                        <HomeNavItemStl
                            $ativo={isHome && !activePostId}
                            $compacto={compacto}
                            onClick={() => isDrawer && setAberto(false)}
                            title="Página Inicial"
                        >
                            <Home size={16} />
                            {!compacto && <span>Página Inicial</span>}
                        </HomeNavItemStl>
                    </Link>
                </HomeLinkWrapper>

                {!compacto && (
                    <SectionLabelStl>
                        <span>DOCUMENTAÇÃO</span>
                    </SectionLabelStl>
                )}

                {carregando ? (
                    <CarregandoStl $compacto={compacto}>
                        {compacto ? "..." : "Carregando módulos..."}
                    </CarregandoStl>
                ) : nomes.length === 0 ? (
                    <VazioStl $compacto={compacto}>
                        {compacto ? "—" : "Nenhum módulo encontrado"}
                    </VazioStl>
                ) : (
                    nomes.map((nome) => {
                        const itens = categorias[nome] || [];
                        const expandida = Boolean(expandidas[nome]) && !compacto;
                        const ativa = categoriaAtiva === nome || expandida;

                        return (
                            <GrupoStl key={nome}>
                                <CategoriaStl
                                    $ativo={ativa}
                                    $expandida={expandida}
                                    $compacto={compacto}
                                    title={nome}
                                    onClick={(e) => {
                                        if (compacto) {
                                            onToggleColapsado?.();
                                            setCategoriaAtiva(nome);
                                            setExpandidas((prev) => ({
                                                ...prev,
                                                [nome]: true,
                                            }));
                                        } else {
                                            handleCategoriaClick(e, nome);
                                        }
                                    }}
                                >
                                    {compacto ? (
                                        <IconBoxStl $ativo={ativa}>
                                            <Folder size={17} />
                                        </IconBoxStl>
                                    ) : (
                                        <>
                                            <CatLeftStl>
                                                <FolderIconStl $ativo={ativa}>
                                                    <Folder size={15} />
                                                </FolderIconStl>
                                                <CatNomeStl>{nome}</CatNomeStl>
                                            </CatLeftStl>
                                            <CatRightStl>
                                                <BadgeCountStl $ativo={ativa}>
                                                    {itens.length}
                                                </BadgeCountStl>
                                                <SetaStl $expandida={expandida}>
                                                    <ChevronRight size={14} />
                                                </SetaStl>
                                            </CatRightStl>
                                        </>
                                    )}
                                </CategoriaStl>

                                {expandida && (
                                    <SubListaStl>
                                        {itens.map((item) => {
                                            const itemAtivo =
                                                activePostId === String(item.id);
                                            return (
                                                <ItemStl key={item.id}>
                                                    <Link
                                                        href={`/posts/${item.id}`}
                                                        passHref
                                                        legacyBehavior
                                                    >
                                                        <ItemLink
                                                            $ativo={itemAtivo}
                                                            title={item.nome}
                                                            onClick={() =>
                                                                isDrawer &&
                                                                setAberto(false)
                                                            }
                                                        >
                                                            <FileText size={13} />
                                                            <span>{item.nome}</span>
                                                        </ItemLink>
                                                    </Link>
                                                </ItemStl>
                                            );
                                        })}
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
            <BtnAbrirMobile
                onClick={() => setAberto(true)}
                aria-label="Abrir navegação"
            >
                <Menu size={20} />
            </BtnAbrirMobile>

            {/* Sidebar sticky (desktop) no formato Wiki.js */}
            <SidebarStl $colapsado={colapsado}>
                <SidebarHeaderStl $colapsado={colapsado}>
                    {!colapsado && (
                        <HeaderTitleStl>
                            <Layers size={15} />
                            <span>Navegação</span>
                        </HeaderTitleStl>
                    )}
                    <BtnRetrairStl
                        onClick={onToggleColapsado}
                        title={colapsado ? "Expandir navegação" : "Recolher navegação"}
                        aria-label={colapsado ? "Expandir navegação" : "Recolher navegação"}
                    >
                        {colapsado ? (
                            <ChevronRight size={16} />
                        ) : (
                            <ChevronLeft size={16} />
                        )}
                    </BtnRetrairStl>
                </SidebarHeaderStl>

                <ScrollAreaStl>{renderMenu(false)}</ScrollAreaStl>
            </SidebarStl>

            {/* Drawer mobile */}
            {aberto && (
                <>
                    <OverlayStl onClick={() => setAberto(false)} />
                    <DrawerStl>
                        <DrawerHeaderStl>
                            <HeaderTitleStl>
                                <Layers size={16} />
                                <span>Navegação</span>
                            </HeaderTitleStl>
                            <BtnFechar
                                onClick={() => setAberto(false)}
                                aria-label="Fechar menu"
                            >
                                <X size={18} />
                            </BtnFechar>
                        </DrawerHeaderStl>
                        <ScrollAreaStl>{renderMenu(true)}</ScrollAreaStl>
                    </DrawerStl>
                </>
            )}
        </>
    );
}

/* Sidebar sticky no fluxo — estilo Wiki.js */
const SidebarStl = styled.aside`
    display: none;
    width: ${(props) => (props.$colapsado ? "68px" : "280px")};
    flex-shrink: 0;
    position: sticky;
    top: 64px;
    height: calc(100vh - 108px);
    background: rgba(8, 26, 48, 0.78);
    backdrop-filter: blur(10px);
    color: ${theme.colors.clara.claro};
    border-right: 1px solid rgba(108, 164, 197, 0.14);
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
    box-sizing: border-box;

    @media (min-width: 769px) {
        display: flex;
        flex-direction: column;
    }
`;

const SidebarHeaderStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
        props.$colapsado ? "center" : "space-between"};
    padding: ${(props) => (props.$colapsado ? "12px 8px" : "12px 16px")};
    min-height: 48px;
    border-bottom: 1px solid rgba(108, 164, 197, 0.1);
`;

const HeaderTitleStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${theme.colors.azulMaisClaro.claro};
    opacity: 0.9;
`;

const BtnRetrairStl = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(26, 58, 95, 0.55);
    color: ${theme.colors.azulMaisClaro.claro};
    border: 1px solid rgba(108, 164, 197, 0.18);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #ffffff;
        border-color: ${theme.colors.azulMaisClaro.medio};
    }
`;

/* Scrollbar customizada seguindo o padrão CSS moderno com fallback WebKit */
const ScrollAreaStl = styled.div`
    --scrollbar-thumb: rgba(108, 164, 197, 0.28);
    --scrollbar-track: transparent;

    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

    @supports not (scrollbar-color: auto) {
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 999px;
        }
        &::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }
    }
`;

const NavStl = styled.nav`
    padding: 10px 8px 28px;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const HomeLinkWrapper = styled.div`
    margin-bottom: ${(props) => (props.$compacto ? "4px" : "8px")};
`;

const HomeNavItemStl = styled.a`
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.$compacto ? "center" : "flex-start")};
    gap: 10px;
    padding: ${(props) => (props.$compacto ? "10px 8px" : "9px 12px")};
    border-radius: 8px;
    cursor: pointer;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: ${(props) => (props.$ativo ? "700" : "500")};
    color: ${(props) =>
        props.$ativo ? "#ffffff" : theme.colors.clara.medio};
    background: ${(props) =>
        props.$ativo ? "rgba(68, 140, 182, 0.28)" : "transparent"};
    border-left: 3px solid
        ${(props) =>
            props.$ativo ? theme.colors.azulMaisClaro.claro : "transparent"};
    transition: all 0.18s ease;
    text-decoration: none;

    svg {
        color: ${(props) =>
            props.$ativo
                ? theme.colors.azulMaisClaro.claro
                : theme.colors.azulMaisClaro.medio};
        flex-shrink: 0;
    }

    &:hover {
        background: rgba(26, 58, 95, 0.65);
        color: #ffffff;
    }
`;

const SectionLabelStl = styled.div`
    padding: 8px 12px 6px;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    color: ${theme.colors.azulMaisClaro.medio};
    opacity: 0.75;
`;

const GrupoStl = styled.div`
    display: flex;
    flex-direction: column;
`;

const CategoriaStl = styled.button`
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
        props.$compacto ? "center" : "space-between"};
    gap: 8px;
    width: 100%;
    padding: ${(props) => (props.$compacto ? "10px 6px" : "9px 12px")};
    cursor: pointer;
    border: none;
    border-radius: 8px;
    border-left: 3px solid
        ${(props) =>
            props.$ativo ? theme.colors.azulMaisClaro.claro : "transparent"};
    background: ${(props) =>
        props.$ativo ? "rgba(68, 140, 182, 0.18)" : "transparent"};
    color: ${(props) =>
        props.$ativo ? "#ffffff" : theme.colors.clara.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.82rem;
    font-weight: ${(props) => (props.$ativo ? "700" : "600")};
    letter-spacing: 0.02em;
    text-align: left;
    transition: all 0.18s ease;

    &:hover {
        background: rgba(26, 58, 95, 0.65);
        color: #ffffff;
    }
`;

const CatLeftStl = styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    flex: 1;
`;

const FolderIconStl = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) =>
        props.$ativo
            ? theme.colors.azulMaisClaro.claro
            : theme.colors.azulMaisClaro.medio};
    flex-shrink: 0;
`;

const IconBoxStl = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) =>
        props.$ativo
            ? theme.colors.azulMaisClaro.claro
            : theme.colors.azulMaisClaro.medio};
`;

const CatNomeStl = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
`;

const CatRightStl = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
`;

const BadgeCountStl = styled.span`
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 999px;
    background: ${(props) =>
        props.$ativo
            ? "rgba(154, 195, 219, 0.22)"
            : "rgba(255, 255, 255, 0.06)"};
    color: ${(props) =>
        props.$ativo
            ? theme.colors.azulMaisClaro.muitoClaro
            : theme.colors.azulMaisClaro.claro};
`;

const SetaStl = styled.span`
    display: flex;
    align-items: center;
    transition: transform 0.22s ease;
    opacity: 0.75;
    transform: ${(props) => (props.$expandida ? "rotate(90deg)" : "rotate(0)")};
`;

/* Árvore indentada estilo Wiki.js com linha guia à esquerda */
const SubListaStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 3px 0 6px 19px;
    padding-left: 10px;
    border-left: 1px solid rgba(108, 164, 197, 0.22);
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
    padding: 7px 10px;
    border-radius: 6px;
    color: ${(props) =>
        props.$ativo ? "#ffffff" : "rgba(245, 240, 234, 0.78)"};
    background: ${(props) =>
        props.$ativo ? "rgba(68, 140, 182, 0.28)" : "transparent"};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.8rem;
    font-weight: ${(props) => (props.$ativo ? "600" : "400")};
    line-height: 1.35;
    text-decoration: none;
    transition: all 0.16s ease;

    svg {
        flex-shrink: 0;
        opacity: ${(props) => (props.$ativo ? 1 : 0.65)};
        color: ${(props) =>
            props.$ativo
                ? theme.colors.azulMaisClaro.claro
                : theme.colors.azulMaisClaro.medio};
    }

    &:hover {
        background: rgba(26, 58, 95, 0.55);
        color: #ffffff;
        text-decoration: none;

        svg {
            opacity: 1;
        }
    }

    span {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
    }
`;

const CarregandoStl = styled.div`
    padding: 14px 12px;
    font-size: 0.82rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-style: italic;
    text-align: ${(props) => (props.$compacto ? "center" : "left")};
`;

const VazioStl = styled.div`
    padding: 14px 12px;
    font-size: 0.82rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-style: italic;
    text-align: ${(props) => (props.$compacto ? "center" : "left")};
`;

/* Hamburguer mobile (fixed) */
const BtnAbrirMobile = styled.button`
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(8, 29, 53, 0.9);
    color: ${theme.colors.clara.claro};
    border: 1px solid rgba(108, 164, 197, 0.25);
    border-radius: 8px;
    cursor: pointer;
    z-index: 35;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        display: flex;
        position: fixed;
        top: 76px;
        left: 12px;
    }
`;

const OverlayStl = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(4, 12, 24, 0.6);
    z-index: 45;
    backdrop-filter: blur(3px);
`;

const DrawerStl = styled.aside`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.claro};
    z-index: 50;
    border-right: 1px solid rgba(108, 164, 197, 0.2);
    box-shadow: 8px 0 24px rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.22s ease-out;

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
    padding: 16px;
    border-bottom: 1px solid rgba(108, 164, 197, 0.14);
`;

const BtnFechar = styled.button`
    background: rgba(26, 58, 95, 0.5);
    border: 1px solid rgba(108, 164, 197, 0.2);
    border-radius: 6px;
    color: ${theme.colors.clara.claro};
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
