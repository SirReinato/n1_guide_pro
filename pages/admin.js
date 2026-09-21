import { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { theme, TitulosPrincipaisStl } from "../src/theme/theme";
import { Check, Trash2, ArrowLeft, Lock, LogOut, ChevronDown, ChevronUp, FileText, AlertCircle, RefreshCw } from "react-feather";

export default function AdminPage() {
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [carregandoLogin, setCarregandoLogin] = useState(false);

    // Estados do painel
    const [manuaisPendentes, setManuaisPendentes] = useState([]);
    const [manuaisAprovados, setManuaisAprovados] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(false);
    const [erroPainel, setErroPainel] = useState("");
    const [sucessoMensagem, setSucessoMensagem] = useState("");
    const [passosExpandidos, setPassosExpandidos] = useState({});
    const [precisaCriarColuna, setPrecisaCriarColuna] = useState(false);

    // Carrega token salvo


    useEffect(() => {
        const savedToken = localStorage.getItem("n1_admin_token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Busca dados quando autenticado
    useEffect(() => {
        if (token) {
            carregarManuais();
        }
    }, [token]);

    async function handleLogin(e) {
        e.preventDefault();
        setCarregandoLogin(true);
        setLoginError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setLoginError(data.error || "Senha incorreta");
                setCarregandoLogin(false);
                return;
            }

            localStorage.setItem("n1_admin_token", data.token);
            setToken(data.token);
            setPassword("");
        } catch (err) {
            setLoginError("Erro ao conectar ao servidor");
        } finally {
            setCarregandoLogin(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("n1_admin_token");
        setToken(null);
        setManuaisPendentes([]);
        setManuaisAprovados([]);
    }

    async function carregarManuais() {
        setCarregandoDados(true);
        setErroPainel("");

        try {
            const res = await fetch("/api/admin/manuais", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                handleLogout();
                return;
            }

            const data = await res.json();
            if (!res.ok) {
                setErroPainel(data.error || "Erro ao buscar manuais");
                return;
            }

            setManuaisPendentes(data.pendentes || []);
            setManuaisAprovados(data.aprovados || []);
            setPrecisaCriarColuna(Boolean(data.precisaCriarColuna));
        } catch (err) {
            setErroPainel("Erro ao carregar dados do banco");
        } finally {
            setCarregandoDados(false);
        }
    }


    async function aprovarManual(id) {
        setErroPainel("");
        try {
            const res = await fetch("/api/admin/manuais", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id, aprovado: true }),
            });

            if (!res.ok) {
                const data = await res.json();
                setErroPainel(data.error || "Erro ao aprovar manual");
                return;
            }

            setSucessoMensagem(`Manual #${id} aprovado e publicado com sucesso!`);
            setTimeout(() => setSucessoMensagem(""), 4000);
            carregarManuais();
        } catch (err) {
            setErroPainel("Erro ao aprovar manual");
        }
    }

    async function excluirManual(id, nome) {
        if (!confirm(`Tem certeza que deseja excluir o manual "${nome}"?`)) return;

        setErroPainel("");
        try {
            const res = await fetch(`/api/admin/manuais?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json();
                setErroPainel(data.error || "Erro ao excluir manual");
                return;
            }

            setSucessoMensagem(`Manual #${id} excluído com sucesso.`);
            setTimeout(() => setSucessoMensagem(""), 4000);
            carregarManuais();
        } catch (err) {
            setErroPainel("Erro ao excluir manual");
        }
    }

    function togglePassos(id) {
        setPassosExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    // Tela de Login
    if (!token) {
        return (
            <ContainerLoginStl>
                <Head>
                    <title>Administração - N1 GuidePro</title>
                </Head>
                <CardLoginStl>
                    <IconeLockStl>
                        <Lock size={32} />
                    </IconeLockStl>
                    <TituloLoginStl>Painel de Moderação</TituloLoginStl>
                    <SubtituloLoginStl>
                        Área de moderação e aprovação de manuais do SirReinato
                    </SubtituloLoginStl>

                    <form onSubmit={handleLogin}>
                        <InputSenhaStl
                            type="password"
                            placeholder="Digite a senha de administrador"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        {loginError && (
                            <ErroMensagemStl>
                                <AlertCircle size={16} /> {loginError}
                            </ErroMensagemStl>
                        )}
                        <BotaoEntrarStl type="submit" disabled={carregandoLogin || !password}>
                            {carregandoLogin ? "Verificando..." : "Entrar no Painel"}
                        </BotaoEntrarStl>
                    </form>

                    <VoltarLinkStl href="/">
                        <ArrowLeft size={16} /> Voltar para o site
                    </VoltarLinkStl>
                </CardLoginStl>
            </ContainerLoginStl>
        );
    }

    // Painel de Moderação
    return (
        <ContainerPainelStl>
            <Head>
                <title>Moderação de Manuais - N1 GuidePro</title>
            </Head>

            <HeaderPainelStl>
                <HeaderEsquerdaStl>
                    <Link href="/">
                        <BotaoVoltarTopoStl title="Ir para o site">
                            <ArrowLeft size={18} />
                        </BotaoVoltarTopoStl>
                    </Link>
                    <div>
                        <TituloPainelStl>Painel de Moderação</TituloPainelStl>
                        <SubtituloPainelStl>N1 GuidePro • Moderador: SirReinato</SubtituloPainelStl>
                    </div>
                </HeaderEsquerdaStl>

                <HeaderDireitaStl>
                    <BotaoIconeAcaoStl onClick={carregarManuais} title="Recarregar dados">
                        <RefreshCw size={16} />
                    </BotaoIconeAcaoStl>
                    <BotaoSairStl onClick={handleLogout}>
                        <LogOut size={16} /> Sair
                    </BotaoSairStl>
                </HeaderDireitaStl>
            </HeaderPainelStl>

            <CorpoPainelStl>
                {sucessoMensagem && (
                    <AlertaSucessoStl>
                        <Check size={18} /> {sucessoMensagem}
                    </AlertaSucessoStl>
                )}

                {erroPainel && (
                    <AlertaErroStl>
                        <AlertCircle size={18} /> {erroPainel}
                    </AlertaErroStl>
                )}

                {precisaCriarColuna && (
                    <DicaSqlStl>
                        <div className="dicaIcone">
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <h4>Ação rápida recomendada no Supabase</h4>
                            <p>
                                Para ativar a moderação no banco, execute este comando no <strong>SQL Editor</strong> do Supabase:
                            </p>
                            <code>ALTER TABLE manuais ADD COLUMN IF NOT EXISTS aprovado BOOLEAN NOT NULL DEFAULT TRUE;</code>
                        </div>
                    </DicaSqlStl>
                )}

                {/* Seção de Manuais Pendentes */}
                <SecaoTituloStl>

                    Manuais Aguardando Aprovação
                    <BadgePendentesStl>{manuaisPendentes.length}</BadgePendentesStl>
                </SecaoTituloStl>

                {carregandoDados ? (
                    <CarregandoTextoStl>Carregando manuais...</CarregandoTextoStl>
                ) : manuaisPendentes.length === 0 ? (
                    <VazioCardStl>
                        <Check size={36} color={theme.colors.azulMaisClaro.claro} />
                        <h3>Tudo em dia!</h3>
                        <p>Nenhum manual aguardando aprovação no momento.</p>
                    </VazioCardStl>
                ) : (
                    <ListaCardsStl>
                        {manuaisPendentes.map((m) => (
                            <CardManualModerarStl key={m.id}>
                                <CardHeaderModerarStl>
                                    <div>
                                        <CardIdTagStl>#{m.id}</CardIdTagStl>
                                        <CardTituloModerarStl>{m.nome}</CardTituloModerarStl>
                                        <CardDescricaoModerarStl>{m.descricao}</CardDescricaoModerarStl>
                                    </div>

                                    <CardAcoesStl>
                                        <BotaoAprovarStl onClick={() => aprovarManual(m.id)}>
                                            <Check size={16} /> Aprovar e Publicar
                                        </BotaoAprovarStl>
                                        <BotaoExcluirStl onClick={() => excluirManual(m.id, m.nome)}>
                                            <Trash2 size={16} /> Recusar
                                        </BotaoExcluirStl>
                                    </CardAcoesStl>
                                </CardHeaderModerarStl>

                                {/* Passos Expandíveis */}
                                <TogglePassosBotaoStl onClick={() => togglePassos(m.id)}>
                                    <FileText size={14} />
                                    <span>{m.passos?.length || 0} passos detalhados</span>
                                    {passosExpandidos[m.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </TogglePassosBotaoStl>

                                {passosExpandidos[m.id] && (
                                    <PassosContainerStl>
                                        {(m.passos || []).map((p) => (
                                            <PassoItemStl key={p.passo}>
                                                <strong>Passo {p.passo}: {p.titulo}</strong>
                                                <p>{p.descricao}</p>
                                            </PassoItemStl>
                                        ))}
                                    </PassosContainerStl>
                                )}
                            </CardManualModerarStl>
                        ))}
                    </ListaCardsStl>
                )}

                {/* Seção Informativa de Manuais Já Aprovados */}
                <SecaoTituloSecundariaStl>
                    Manuais Já Publicados no Site ({manuaisAprovados.length})
                </SecaoTituloSecundariaStl>
                <TabelaPublicadosStl>
                    {manuaisAprovados.slice(0, 10).map((m) => (
                        <LinhaPublicadoStl key={m.id}>
                            <span className="id">#{m.id}</span>
                            <span className="nome">{m.nome}</span>
                            <span className="origem">{m.gerado_por_ia ? "🤖 Gerado por IA" : "📋 Padrão"}</span>
                            <Link href={`/posts/${m.id}`} target="_blank" className="link">
                                Ver no site →
                            </Link>
                        </LinhaPublicadoStl>
                    ))}
                </TabelaPublicadosStl>
            </CorpoPainelStl>
        </ContainerPainelStl>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const ContainerLoginStl = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.clara.bgGeral};
    padding: 20px;
`;

const CardLoginStl = styled.div`
    background: ${theme.colors.azul.medio};
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    text-align: center;
`;

const IconeLockStl = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.azulMaisClaro.claro};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
`;

const TituloLoginStl = styled.h1`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.6rem;
    color: ${theme.colors.clara.medio};
    margin-bottom: 8px;
`;

const SubtituloLoginStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.95rem;
    color: ${theme.colors.azulMaisClaro.claro};
    margin-bottom: 28px;
`;

const InputSenhaStl = styled.input`
    width: 100%;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    font-size: 1rem;
    margin-bottom: 16px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${theme.colors.azulMaisClaro.claro};
    }
`;

const BotaoEntrarStl = styled.button`
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: none;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
        background: ${theme.colors.azulMaisClaro.medio};
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const VoltarLinkStl = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
        color: ${theme.colors.clara.medio};
    }
`;

const ErroMensagemStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #f87171;
    font-size: 0.9rem;
    margin-bottom: 14px;
`;

// Painel Logado
const ContainerPainelStl = styled.div`
    min-height: 100vh;
    width: 100%;
    background: ${theme.colors.clara.bgGeral};
`;

const HeaderPainelStl = styled.header`
    width: 100%;
    padding: 18px 8%;
    background: ${theme.colors.azul.escuro};
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid ${theme.colors.azul.medio};
`;

const HeaderEsquerdaStl = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BotaoVoltarTopoStl = styled.button`
    background: ${theme.colors.azul.medio};
    border: none;
    color: ${theme.colors.clara.medio};
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: ${theme.colors.azulMaisClaro.escuro}; }
`;

const TituloPainelStl = styled.h1`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.4rem;
    color: ${theme.colors.clara.medio};
`;

const SubtituloPainelStl = styled.p`
    font-size: 0.85rem;
    color: ${theme.colors.azulMaisClaro.medio};
`;

const HeaderDireitaStl = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const BotaoIconeAcaoStl = styled.button`
    background: ${theme.colors.azul.medio};
    border: none;
    color: ${theme.colors.clara.medio};
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
    &:hover { background: ${theme.colors.azulMaisClaro.escuro}; }
`;

const BotaoSairStl = styled.button`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: ${theme.colors.clara.medio};
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    transition: all 0.2s;
    &:hover { background: #dc2626; border-color: #dc2626; }
`;

const CorpoPainelStl = styled.main`
    padding: 36px 8%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
`;

const SecaoTituloStl = styled.h2`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.3rem;
    color: ${theme.colors.clara.medio};
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
`;

const SecaoTituloSecundariaStl = styled(SecaoTituloStl)`
    margin-top: 48px;
    font-size: 1.15rem;
    color: ${theme.colors.azulMaisClaro.claro};
`;

const BadgePendentesStl = styled.span`
    background: #f59e0b;
    color: #111;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: bold;
    padding: 2px 10px;
    border-radius: 999px;
`;

const AlertaSucessoStl = styled.div`
    background: #065f46;
    color: #ecfdf5;
    padding: 12px 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
`;

const AlertaErroStl = styled.div`
    background: #991b1b;
    color: #fef2f2;
    padding: 12px 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
`;

const VazioCardStl = styled.div`
    background: ${theme.colors.azul.medio};
    border-radius: 12px;
    padding: 48px;
    text-align: center;
    color: ${theme.colors.clara.medio};

    h3 {
        font-family: ${theme.fontsFamily.titulos};
        font-size: 1.2rem;
        margin: 12px 0 6px;
    }
    p {
        color: ${theme.colors.azulMaisClaro.claro};
        font-size: 0.95rem;
    }
`;

const CarregandoTextoStl = styled.p`
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 1rem;
    text-align: center;
    padding: 30px;
`;

const ListaCardsStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const CardManualModerarStl = styled.article`
    background: ${theme.colors.azul.medio};
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const CardHeaderModerarStl = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CardIdTagStl = styled.span`
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 0.8rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 6px;
`;

const CardTituloModerarStl = styled.h3`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.2rem;
    color: ${theme.colors.clara.medio};
    margin-bottom: 6px;
`;

const CardDescricaoModerarStl = styled.p`
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 0.95rem;
    line-height: 1.4;
`;

const CardAcoesStl = styled.div`
    display: flex;
    gap: 10px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const BotaoAprovarStl = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    background: #059669;
    color: #fff;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: #10b981; }
`;

const BotaoExcluirStl = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
`;

const TogglePassosBotaoStl = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.azulMaisClaro.claro};
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    margin-top: 14px;
    cursor: pointer;
    padding: 4px 0;
    &:hover { color: ${theme.colors.clara.medio}; }
`;

const PassosContainerStl = styled.div`
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const PassoItemStl = styled.div`
    background: ${theme.colors.azul.escuro};
    padding: 10px 14px;
    border-radius: 8px;
    color: ${theme.colors.clara.medio};
    font-size: 0.9rem;

    strong {
        color: ${theme.colors.azulMaisClaro.claro};
        display: block;
        margin-bottom: 4px;
    }
    p {
        color: #d1d5db;
        line-height: 1.4;
    }
`;

const TabelaPublicadosStl = styled.div`
    background: ${theme.colors.azul.escuro};
    border-radius: 12px;
    overflow: hidden;
    margin-top: 12px;
`;

const LinhaPublicadoStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.9rem;
    color: ${theme.colors.clara.medio};

    .id {
        color: ${theme.colors.azulMaisClaro.medio};
        font-weight: bold;
        width: 60px;
    }
    .nome {
        flex: 1;
        padding: 0 16px;
    }
    .origem {
        font-size: 0.8rem;
        color: ${theme.colors.azulMaisClaro.claro};
        padding: 0 16px;
    }
    .link {
        color: ${theme.colors.azulMaisClaro.claro};
        text-decoration: none;
        font-size: 0.85rem;
        &:hover { text-decoration: underline; }
    }
`;

const DicaSqlStl = styled.div`
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
    color: ${theme.colors.clara.medio};

    .dicaIcone {
        color: #f59e0b;
        margin-top: 2px;
    }

    h4 {
        font-family: ${theme.fontsFamily.titulos};
        font-size: 1rem;
        color: #f59e0b;
        margin-bottom: 6px;
    }

    p {
        font-size: 0.88rem;
        color: ${theme.colors.azulMaisClaro.claro};
        margin-bottom: 8px;
        line-height: 1.4;
    }

    code {
        display: block;
        background: ${theme.colors.azul.escuro};
        padding: 8px 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 0.85rem;
        color: #34d399;
        overflow-x: auto;
    }
`;

