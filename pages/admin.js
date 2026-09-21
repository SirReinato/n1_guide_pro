import { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { theme } from "../src/theme/theme";
import {
    Check,
    Trash2,
    ArrowLeft,
    Lock,
    LogOut,
    ChevronDown,
    ChevronUp,
    FileText,
    AlertCircle,
    RefreshCw,
    Edit2,
    BarChart2,
    ThumbsUp,
    ThumbsDown,
    Eye,
    Plus,
    X,
    HelpCircle,
} from "react-feather";

export default function AdminPage() {
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [carregandoLogin, setCarregandoLogin] = useState(false);

    // Estados do painel
    const [abaAtiva, setAbaAtiva] = useState("pendentes"); // 'pendentes' | 'aprovados' | 'dashboard'
    const [manuaisPendentes, setManuaisPendentes] = useState([]);
    const [manuaisAprovados, setManuaisAprovados] = useState([]);
    const [logsConsultas, setLogsConsultas] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(false);
    const [erroPainel, setErroPainel] = useState("");
    const [sucessoMensagem, setSucessoMensagem] = useState("");
    const [passosExpandidos, setPassosExpandidos] = useState({});
    const [precisaCriarColuna, setPrecisaCriarColuna] = useState(false);

    // Estado do modal de edição
    const [manualEditando, setManualEditando] = useState(null);
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("n1_admin_token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

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
        setLogsConsultas([]);
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
            setLogsConsultas(data.logsConsultas || []);
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

    // ─── Funções de Edição ───────────────────────────────────────────────────

    function abrirEdicao(manual) {
        setManualEditando({
            id: manual.id,
            nome: manual.nome,
            descricao: manual.descricao || "",
            aprovado: manual.aprovado,
            passos: (manual.passos || []).map((p, idx) => ({
                passo: idx + 1,
                titulo: p.titulo || "",
                descricao: p.descricao || "",
            })),
        });
    }

    function fecharEdicao() {
        setManualEditando(null);
    }

    function adicionarPasso() {
        if (!manualEditando) return;
        setManualEditando((prev) => ({
            ...prev,
            passos: [
                ...prev.passos,
                { passo: prev.passos.length + 1, titulo: "", descricao: "" },
            ],
        }));
    }

    function removerPasso(index) {
        if (!manualEditando) return;
        setManualEditando((prev) => ({
            ...prev,
            passos: prev.passos.filter((_, i) => i !== index),
        }));
    }

    function atualizarPasso(index, campo, valor) {
        if (!manualEditando) return;
        setManualEditando((prev) => {
            const novosPassos = [...prev.passos];
            novosPassos[index] = { ...novosPassos[index], [campo]: valor };
            return { ...prev, passos: novosPassos };
        });
    }

    async function salvarEdicao(aprovarJunto) {
        if (!manualEditando) return;
        setSalvandoEdicao(true);

        try {
            const res = await fetch("/api/admin/manuais", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: manualEditando.id,
                    nome: manualEditando.nome,
                    descricao: manualEditando.descricao,
                    passos: manualEditando.passos,
                    aprovado: aprovarJunto !== undefined ? aprovarJunto : manualEditando.aprovado,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Erro ao salvar alterações");
                return;
            }

            setSucessoMensagem(
                `Manual #${manualEditando.id} atualizado ${aprovarJunto ? "e publicado " : ""}com sucesso!`
            );
            setTimeout(() => setSucessoMensagem(""), 4000);
            fecharEdicao();
            carregarManuais();
        } catch (err) {
            alert("Erro de conexão ao salvar.");
        } finally {
            setSalvandoEdicao(false);
        }
    }

    // ─── Métricas do Dashboard ───────────────────────────────────────────────

    const totalManuais = manuaisAprovados.length + manuaisPendentes.length;
    const totalConsultas = logsConsultas.length;
    const consultasSemManual = logsConsultas.filter((l) => !l.encontrou_manual);
    const totalVotosPositivos = manuaisAprovados.reduce((acc, m) => acc + (m.votos_positivos || 0), 0);
    const totalVotosNegativos = manuaisAprovados.reduce((acc, m) => acc + (m.votos_negativos || 0), 0);
    const totalVotos = totalVotosPositivos + totalVotosNegativos;
    const taxaSatisfacao = totalVotos > 0 ? Math.round((totalVotosPositivos / totalVotos) * 100) : 100;

    const manuaisMaisAcessados = [...manuaisAprovados]
        .sort((a, b) => ((b.visualizacoes || 0) + (b.votos_positivos || 0)) - ((a.visualizacoes || 0) + (a.votos_positivos || 0)))
        .slice(0, 5);

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
                        Área de moderação, edição e métricas do SirReinato
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

    return (
        <ContainerPainelStl>
            <Head>
                <title>Painel de Gestão e Moderação - N1 GuidePro</title>
            </Head>

            <HeaderPainelStl>
                <HeaderEsquerdaStl>
                    <Link href="/">
                        <BotaoVoltarTopoStl title="Ir para o site">
                            <ArrowLeft size={18} />
                        </BotaoVoltarTopoStl>
                    </Link>
                    <div>
                        <TituloPainelStl>Painel de Moderação & Gestão</TituloPainelStl>
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

            {/* Barra de Navegação por Abas */}
            <AbasNavegacaoStl>
                <BotaoAbaStl
                    $ativa={abaAtiva === "pendentes"}
                    onClick={() => setAbaAtiva("pendentes")}
                >
                    <FileText size={16} />
                    <span>Aguardando Aprovação</span>
                    <BadgeAbaStl $alerta={manuaisPendentes.length > 0}>
                        {manuaisPendentes.length}
                    </BadgeAbaStl>
                </BotaoAbaStl>

                <BotaoAbaStl
                    $ativa={abaAtiva === "aprovados"}
                    onClick={() => setAbaAtiva("aprovados")}
                >
                    <Check size={16} />
                    <span>Publicados no Site</span>
                    <BadgeAbaStl>{manuaisAprovados.length}</BadgeAbaStl>
                </BotaoAbaStl>

                <BotaoAbaStl
                    $ativa={abaAtiva === "dashboard"}
                    onClick={() => setAbaAtiva("dashboard")}
                >
                    <BarChart2 size={16} />
                    <span>Dashboard N1 & Métricas</span>
                </BotaoAbaStl>
            </AbasNavegacaoStl>

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
                            <h4>Configuração rápida recomendada no Supabase</h4>
                            <p>
                                Para habilitar as métricas e avaliações completas, execute este comando no <strong>SQL Editor</strong> do Supabase:
                            </p>
                            <code>
                                ALTER TABLE manuais ADD COLUMN IF NOT EXISTS aprovado BOOLEAN NOT NULL DEFAULT TRUE;
                                ALTER TABLE manuais ADD COLUMN IF NOT EXISTS visualizacoes INTEGER DEFAULT 0;
                                ALTER TABLE manuais ADD COLUMN IF NOT EXISTS votos_positivos INTEGER DEFAULT 0;
                                ALTER TABLE manuais ADD COLUMN IF NOT EXISTS votos_negativos INTEGER DEFAULT 0;
                                CREATE TABLE IF NOT EXISTS logs_consultas (id BIGSERIAL PRIMARY KEY, termo TEXT NOT NULL, origem TEXT NOT NULL, encontrou_manual BOOLEAN DEFAULT FALSE, criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()));
                            </code>
                        </div>
                    </DicaSqlStl>
                )}

                {/* ─── ABA 1: PENDENTES DE MODERAÇÃO ─── */}
                {abaAtiva === "pendentes" && (
                    <>
                        <SecaoTituloStl>
                            Manuais Gerados pela IA Aguardando Sua Aprovação
                            <BadgePendentesStl>{manuaisPendentes.length}</BadgePendentesStl>
                        </SecaoTituloStl>

                        {carregandoDados ? (
                            <CarregandoTextoStl>Carregando manuais pendentes...</CarregandoTextoStl>
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
                                                <BotaoEditarStl onClick={() => abrirEdicao(m)} title="Editar título, descrição ou passos antes de aprovar">
                                                    <Edit2 size={15} /> Editar
                                                </BotaoEditarStl>
                                                <BotaoAprovarStl onClick={() => aprovarManual(m.id)}>
                                                    <Check size={15} /> Aprovar e Publicar
                                                </BotaoAprovarStl>
                                                <BotaoExcluirStl onClick={() => excluirManual(m.id, m.nome)}>
                                                    <Trash2 size={15} /> Recusar
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
                    </>
                )}

                {/* ─── ABA 2: APROVADOS / PUBLICADOS ─── */}
                {abaAtiva === "aprovados" && (
                    <>
                        <SecaoTituloStl>
                            Manuais Publicados no Site ({manuaisAprovados.length})
                        </SecaoTituloStl>

                        <TabelaPublicadosStl>
                            {manuaisAprovados.map((m) => (
                                <LinhaPublicadoStl key={m.id}>
                                    <span className="id">#{m.id}</span>
                                    <div className="infoPrincipal">
                                        <span className="nome">{m.nome}</span>
                                        <span className="origem">{m.gerado_por_ia ? "🤖 Gerado por IA" : "📋 Padrão"}</span>
                                    </div>

                                    <div className="metricasManual">
                                        <span title="Visualizações"><Eye size={13} /> {m.visualizacoes || 0}</span>
                                        <span title="Votos Positivos" className="votoPos"><ThumbsUp size={13} /> {m.votos_positivos || 0}</span>
                                        <span title="Votos Negativos" className="votoNeg"><ThumbsDown size={13} /> {m.votos_negativos || 0}</span>
                                    </div>

                                    <div className="acoesLinha">
                                        <BotaoEditarPequenoStl onClick={() => abrirEdicao(m)} title="Editar manual">
                                            <Edit2 size={14} /> Editar
                                        </BotaoEditarPequenoStl>
                                        <Link href={`/posts/${m.id}`} target="_blank" className="link">
                                            Ver no site →
                                        </Link>
                                    </div>
                                </LinhaPublicadoStl>
                            ))}
                        </TabelaPublicadosStl>
                    </>
                )}

                {/* ─── ABA 3: DASHBOARD & MÉTRICAS ─── */}
                {abaAtiva === "dashboard" && (
                    <DashboardContainerStl>
                        <SecaoTituloStl>
                            <BarChart2 size={20} /> Visão Geral & Métricas Operacionais N1
                        </SecaoTituloStl>

                        {/* Cards de Resumo */}
                        <GridCardsResumoStl>
                            <CardKpiStl>
                                <div className="kpiIcone"><FileText size={24} /></div>
                                <div className="kpiValor">{totalManuais}</div>
                                <div className="kpiLabel">Total de Manuais</div>
                            </CardKpiStl>

                            <CardKpiStl>
                                <div className="kpiIcone" style={{ color: "#38bdf8" }}><HelpCircle size={24} /></div>
                                <div className="kpiValor">{totalConsultas}</div>
                                <div className="kpiLabel">Consultas à IA</div>
                            </CardKpiStl>

                            <CardKpiStl>
                                <div className="kpiIcone" style={{ color: "#f59e0b" }}><AlertCircle size={24} /></div>
                                <div className="kpiValor">{manuaisPendentes.length}</div>
                                <div className="kpiLabel">Pendentes de Moderação</div>
                            </CardKpiStl>

                            <CardKpiStl>
                                <div className="kpiIcone" style={{ color: "#10b981" }}><ThumbsUp size={24} /></div>
                                <div className="kpiValor">{taxaSatisfacao}%</div>
                                <div className="kpiLabel">Taxa de Resolução Útil</div>
                            </CardKpiStl>
                        </GridCardsResumoStl>

                        {/* Grid de Tabelas Analíticas */}
                        <GridDashboardDuploStl>
                            {/* Ranking de Manuais Mais Procurados */}
                            <BoxAnaliticoStl>
                                <div className="boxHeader">
                                    <ThumbsUp size={16} color="#10b981" />
                                    <h4>Manuais Mais Acessados / Curtidos</h4>
                                </div>
                                <div className="boxCorpo">
                                    {manuaisMaisAcessados.map((m, idx) => (
                                        <LinhaRankingStl key={m.id}>
                                            <span className="posicao">#{idx + 1}</span>
                                            <div className="tituloRanking">
                                                <Link href={`/posts/${m.id}`} target="_blank">
                                                    {m.nome}
                                                </Link>
                                            </div>
                                            <div className="dadosRanking">
                                                <span><Eye size={12} /> {m.visualizacoes || 0}</span>
                                                <span style={{ color: "#10b981" }}><ThumbsUp size={12} /> {m.votos_positivos || 0}</span>
                                            </div>
                                        </LinhaRankingStl>
                                    ))}
                                </div>
                            </BoxAnaliticoStl>

                            {/* Oportunidades: Dúvidas sem manual */}
                            <BoxAnaliticoStl>
                                <div className="boxHeader">
                                    <AlertCircle size={16} color="#f59e0b" />
                                    <h4>Dúvidas Sem Manual Correspondente (Oportunidades)</h4>
                                </div>
                                <div className="boxCorpo">
                                    {consultasSemManual.length === 0 ? (
                                        <p className="vazioTexto">Nenhum termo sem resposta registrado até o momento.</p>
                                    ) : (
                                        consultasSemManual.slice(0, 6).map((log) => (
                                            <LinhaOportunidadeStl key={log.id}>
                                                <span className="termo">"{log.termo}"</span>
                                                <span className="data">{new Date(log.criado_em).toLocaleDateString("pt-BR")}</span>
                                            </LinhaOportunidadeStl>
                                        ))
                                    )}
                                </div>
                            </BoxAnaliticoStl>
                        </GridDashboardDuploStl>

                        {/* Histórico Geral de Perguntas Recentes */}
                        <BoxAnaliticoStl style={{ marginTop: "20px" }}>
                            <div className="boxHeader">
                                <HelpCircle size={16} color="#38bdf8" />
                                <h4>Últimas Dúvidas Perguntadas à IA pelos Usuários</h4>
                            </div>
                            <div className="boxCorpo">
                                {logsConsultas.length === 0 ? (
                                    <p className="vazioTexto">As perguntas feitas no Assistente IA começarão a ser listadas aqui conforme o uso.</p>
                                ) : (
                                    logsConsultas.slice(0, 10).map((log) => (
                                        <LinhaLogStl key={log.id}>
                                            <span className="origemBadge">{log.origem === "ia" ? "IA" : "Busca"}</span>
                                            <span className="textoLog">{log.termo}</span>
                                            <span className="statusManual">{log.encontrou_manual ? "✅ Resolvido" : "⚠️ Sem manual direto"}</span>
                                        </LinhaLogStl>
                                    ))
                                )}
                            </div>
                        </BoxAnaliticoStl>
                    </DashboardContainerStl>
                )}
            </CorpoPainelStl>

            {/* ─── MODAL DE EDIÇÃO DE MANUAL ─── */}
            {manualEditando && (
                <ModalOverlayStl onClick={fecharEdicao}>
                    <ModalCardEdicaoStl onClick={(e) => e.stopPropagation()}>
                        <ModalHeaderEdicaoStl>
                            <div className="modalTitulo">
                                <Edit2 size={20} />
                                <h3>Editar Manual #{manualEditando.id}</h3>
                            </div>
                            <button onClick={fecharEdicao} className="botaoFechar">
                                <X size={20} />
                            </button>
                        </ModalHeaderEdicaoStl>

                        <ModalCorpoEdicaoStl>
                            <CampoFormStl>
                                <label>Título do Procedimento:</label>
                                <input
                                    type="text"
                                    value={manualEditando.nome}
                                    onChange={(e) =>
                                        setManualEditando((prev) => ({ ...prev, nome: e.target.value }))
                                    }
                                />
                            </CampoFormStl>

                            <CampoFormStl>
                                <label>Descrição / Objetivo:</label>
                                <textarea
                                    rows={2}
                                    value={manualEditando.descricao}
                                    onChange={(e) =>
                                        setManualEditando((prev) => ({ ...prev, descricao: e.target.value }))
                                    }
                                />
                            </CampoFormStl>

                            <SecaoPassosEdicaoStl>
                                <div className="passosHeader">
                                    <h4>Passos do Procedimento ({manualEditando.passos?.length || 0})</h4>
                                    <BotaoAddPassoStl type="button" onClick={adicionarPasso}>
                                        <Plus size={15} /> Adicionar Passo
                                    </BotaoAddPassoStl>
                                </div>

                                {manualEditando.passos?.map((p, idx) => (
                                    <CardPassoEdicaoStl key={idx}>
                                        <div className="passoTop">
                                            <span className="passoNum">Passo {idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removerPasso(idx)}
                                                className="btnRemover"
                                                title="Remover este passo"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Título do Passo..."
                                            value={p.titulo}
                                            onChange={(e) => atualizarPasso(idx, "titulo", e.target.value)}
                                        />

                                        <textarea
                                            rows={3}
                                            placeholder="Instruções detalhadas..."
                                            value={p.descricao}
                                            onChange={(e) => atualizarPasso(idx, "descricao", e.target.value)}
                                        />
                                    </CardPassoEdicaoStl>
                                ))}
                            </SecaoPassosEdicaoStl>
                        </ModalCorpoEdicaoStl>

                        <ModalFooterEdicaoStl>
                            <BotaoCancelarEdicaoStl type="button" onClick={fecharEdicao}>
                                Cancelar
                            </BotaoCancelarEdicaoStl>

                            <BotaoSalvarRascunhoStl
                                type="button"
                                disabled={salvandoEdicao}
                                onClick={() => salvarEdicao(manualEditando.aprovado)}
                            >
                                {salvandoEdicao ? "Salvando..." : "Salvar Alterações"}
                            </BotaoSalvarRascunhoStl>

                            {!manualEditando.aprovado && (
                                <BotaoSalvarAprovarStl
                                    type="button"
                                    disabled={salvandoEdicao}
                                    onClick={() => salvarEdicao(true)}
                                >
                                    <Check size={16} />
                                    {salvandoEdicao ? "Aprovando..." : "Salvar e Publicar"}
                                </BotaoSalvarAprovarStl>
                            )}
                        </ModalFooterEdicaoStl>
                    </ModalCardEdicaoStl>
                </ModalOverlayStl>
            )}
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
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ErroMensagemStl = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 16px;
`;

const VoltarLinkStl = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 0.9rem;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: ${theme.colors.clara.medio};
    }
`;

const ContainerPainelStl = styled.div`
    min-height: 100vh;
    background: ${theme.colors.clara.bgGeral};
    padding-bottom: 60px;
`;

const HeaderPainelStl = styled.header`
    background: ${theme.colors.azul.medio};
    border-bottom: 1px solid ${theme.colors.azulMaisClaro.escuro};
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const HeaderEsquerdaStl = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BotaoVoltarTopoStl = styled.button`
    background: ${theme.colors.azul.escuro};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
    }
`;

const TituloPainelStl = styled.h1`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.4rem;
    color: ${theme.colors.clara.medio};
`;

const SubtituloPainelStl = styled.p`
    font-size: 0.82rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-family: ${theme.fontsFamily.paragrafos};
`;

const HeaderDireitaStl = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const BotaoIconeAcaoStl = styled.button`
    background: ${theme.colors.azul.escuro};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    padding: 9px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
    }
`;

const BotaoSairStl = styled.button`
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 8px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #ef4444;
        color: #fff;
    }
`;

const AbasNavegacaoStl = styled.nav`
    display: flex;
    gap: 8px;
    padding: 16px 32px 0;
    max-width: 1100px;
    margin: 0 auto;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BotaoAbaStl = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: ${(props) => (props.$ativa ? theme.colors.azul.medio : "transparent")};
    border: none;
    border-bottom: 3px solid ${(props) => (props.$ativa ? theme.colors.azulMaisClaro.escuro : "transparent")};
    color: ${(props) => (props.$ativa ? "#fff" : theme.colors.azulMaisClaro.claro)};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.95rem;
    font-weight: ${(props) => (props.$ativa ? "bold" : "normal")};
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    transition: all 0.2s;

    &:hover {
        color: #fff;
        background: ${theme.colors.azul.medio};
    }
`;

const BadgeAbaStl = styled.span`
    background: ${(props) => (props.$alerta ? "#f59e0b" : theme.colors.azul.escuro)};
    color: ${(props) => (props.$alerta ? "#000" : theme.colors.clara.medio)};
    font-weight: bold;
    font-size: 0.75rem;
    padding: 2px 7px;
    border-radius: 999px;
`;

const CorpoPainelStl = styled.main`
    max-width: 1100px;
    margin: 24px auto 0;
    padding: 0 32px;
`;

const SecaoTituloStl = styled.h2`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.2rem;
    color: ${theme.colors.clara.medio};
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
`;

const BadgePendentesStl = styled.span`
    background: #f59e0b;
    color: #000;
    font-size: 0.78rem;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 999px;
`;

const ListaCardsStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
`;

const CardManualModerarStl = styled.div`
    background: ${theme.colors.azul.medio};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CardHeaderModerarStl = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CardIdTagStl = styled.span`
    font-size: 0.75rem;
    color: ${theme.colors.azulMaisClaro.claro};
    background: ${theme.colors.azul.escuro};
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
`;

const CardTituloModerarStl = styled.h3`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.15rem;
    color: ${theme.colors.clara.medio};
    margin: 6px 0 4px;
`;

const CardDescricaoModerarStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.88rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.4;
`;

const CardAcoesStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const BotaoEditarStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 8px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
    }
`;

const BotaoAprovarStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: 8px;
    border: none;
    background: #10b981;
    color: #fff;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #059669;
        transform: translateY(-1px);
    }
`;

const BotaoExcluirStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 8px;
    border: 1px solid #ef4444;
    background: transparent;
    color: #ef4444;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #ef4444;
        color: #fff;
    }
`;

const TogglePassosBotaoStl = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.azulMaisClaro.claro};
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    margin-top: 14px;
    padding: 0;
    transition: color 0.2s;

    &:hover {
        color: ${theme.colors.clara.medio};
    }
`;

const PassosContainerStl = styled.div`
    margin-top: 14px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const PassoItemStl = styled.div`
    background: ${theme.colors.azul.escuro};
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.85rem;

    strong {
        color: ${theme.colors.clara.medio};
        display: block;
        margin-bottom: 2px;
    }

    p {
        color: ${theme.colors.azulMaisClaro.claro};
        margin: 0;
    }
`;

const TabelaPublicadosStl = styled.div`
    background: ${theme.colors.azul.medio};
    border-radius: 12px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    overflow: hidden;
`;

const LinhaPublicadoStl = styled.div`
    display: flex;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    gap: 16px;
    font-size: 0.9rem;

    &:last-child {
        border-bottom: none;
    }

    .id {
        color: ${theme.colors.azulMaisClaro.claro};
        font-weight: bold;
        width: 40px;
    }

    .infoPrincipal {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .nome {
        color: ${theme.colors.clara.medio};
        font-weight: 500;
    }

    .origem {
        font-size: 0.75rem;
        background: ${theme.colors.azul.escuro};
        color: ${theme.colors.azulMaisClaro.claro};
        padding: 2px 8px;
        border-radius: 999px;
    }

    .metricasManual {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.8rem;
        color: ${theme.colors.azulMaisClaro.claro};

        span {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .votoPos { color: #10b981; }
        .votoNeg { color: #ef4444; }
    }

    .acoesLinha {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .link {
        color: ${theme.colors.azulMaisClaro.claro};
        text-decoration: none;
        font-size: 0.85rem;
        transition: color 0.2s;

        &:hover {
            color: #fff;
            text-decoration: underline;
        }
    }
`;

const BotaoEditarPequenoStl = styled.button`
    background: none;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
    }
`;

const VazioCardStl = styled.div`
    background: ${theme.colors.azul.medio};
    border-radius: 12px;
    padding: 48px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: ${theme.colors.clara.medio};

    h3 { font-family: ${theme.fontsFamily.titulos}; font-size: 1.2rem; }
    p { font-size: 0.9rem; color: ${theme.colors.azulMaisClaro.claro}; }
`;

const CarregandoTextoStl = styled.p`
    text-align: center;
    color: ${theme.colors.azulMaisClaro.claro};
    padding: 30px;
`;

const AlertaSucessoStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: #065f46;
    border: 1px solid #10b981;
    color: #ecfdf5;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.9rem;
`;

const AlertaErroStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: #7f1d1d;
    border: 1px solid #ef4444;
    color: #fef2f2;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.9rem;
`;

const DicaSqlStl = styled.div`
    display: flex;
    gap: 14px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid #f59e0b;
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 24px;
    color: ${theme.colors.clara.medio};

    .dicaIcone { color: #f59e0b; flex-shrink: 0; }
    h4 { margin: 0 0 6px; font-size: 0.95rem; color: #f59e0b; }
    p { margin: 0 0 10px; font-size: 0.85rem; }
    code {
        display: block;
        background: ${theme.colors.azul.escuro};
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #38bdf8;
        word-break: break-all;
    }
`;

// ─── Styled Components do Dashboard ──────────────────────────────────────────

const DashboardContainerStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const GridCardsResumoStl = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const CardKpiStl = styled.div`
    background: ${theme.colors.azul.medio};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .kpiIcone {
        color: ${theme.colors.azulMaisClaro.claro};
        margin-bottom: 4px;
    }

    .kpiValor {
        font-family: ${theme.fontsFamily.titulos};
        font-size: 1.8rem;
        font-weight: bold;
        color: ${theme.colors.clara.medio};
    }

    .kpiLabel {
        font-size: 0.82rem;
        color: ${theme.colors.azulMaisClaro.claro};
        font-family: ${theme.fontsFamily.paragrafos};
    }
`;

const GridDashboardDuploStl = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

const BoxAnaliticoStl = styled.div`
    background: ${theme.colors.azul.medio};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 12px;
    overflow: hidden;

    .boxHeader {
        padding: 14px 18px;
        background: ${theme.colors.azul.escuro};
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 8px;

        h4 {
            font-family: ${theme.fontsFamily.titulos};
            font-size: 0.95rem;
            color: ${theme.colors.clara.medio};
            margin: 0;
        }
    }

    .boxCorpo {
        padding: 12px 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .vazioTexto {
        font-size: 0.85rem;
        color: ${theme.colors.azulMaisClaro.claro};
        font-style: italic;
        padding: 8px 0;
    }
`;

const LinhaRankingStl = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.85rem;

    &:last-child { border-bottom: none; }

    .posicao {
        font-weight: bold;
        color: ${theme.colors.azulMaisClaro.claro};
        width: 24px;
    }

    .tituloRanking {
        flex: 1;
        a {
            color: ${theme.colors.clara.medio};
            text-decoration: none;
            &:hover { text-decoration: underline; color: #fff; }
        }
    }

    .dadosRanking {
        display: flex;
        gap: 12px;
        font-size: 0.8rem;
        color: ${theme.colors.azulMaisClaro.claro};
        span { display: flex; align-items: center; gap: 4px; }
    }
`;

const LinhaOportunidadeStl = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.85rem;

    &:last-child { border-bottom: none; }

    .termo { color: #f59e0b; font-weight: 500; }
    .data { color: ${theme.colors.azulMaisClaro.claro}; font-size: 0.78rem; }
`;

const LinhaLogStl = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.85rem;

    &:last-child { border-bottom: none; }

    .origemBadge {
        background: ${theme.colors.azul.escuro};
        color: ${theme.colors.azulMaisClaro.claro};
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.72rem;
        font-weight: bold;
    }

    .textoLog {
        flex: 1;
        color: ${theme.colors.clara.medio};
    }

    .statusManual {
        font-size: 0.78rem;
        color: ${theme.colors.azulMaisClaro.claro};
    }
`;

// ─── Styled Components do Modal de Edição ─────────────────────────────────────

const ModalOverlayStl = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
`;

const ModalCardEdicaoStl = styled.div`
    background: ${theme.colors.azul.medio};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 16px;
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    overflow: hidden;
`;

const ModalHeaderEdicaoStl = styled.div`
    padding: 18px 24px;
    background: ${theme.colors.azul.escuro};
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .modalTitulo {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${theme.colors.clara.medio};

        h3 {
            margin: 0;
            font-family: ${theme.fontsFamily.titulos};
            font-size: 1.2rem;
        }
    }

    .botaoFechar {
        background: none;
        border: none;
        color: ${theme.colors.azulMaisClaro.claro};
        cursor: pointer;
        &:hover { color: #fff; }
    }
`;

const ModalCorpoEdicaoStl = styled.div`
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const CampoFormStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
        font-size: 0.85rem;
        font-weight: 500;
        color: ${theme.colors.azulMaisClaro.claro};
    }

    input, textarea {
        background: ${theme.colors.azul.escuro};
        border: 1px solid ${theme.colors.azulMaisClaro.escuro};
        border-radius: 8px;
        padding: 10px 14px;
        color: ${theme.colors.clara.medio};
        font-family: ${theme.fontsFamily.paragrafos};
        font-size: 0.9rem;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: ${theme.colors.azulMaisClaro.claro};
        }
    }
`;

const SecaoPassosEdicaoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 6px;

    .passosHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
            margin: 0;
            font-family: ${theme.fontsFamily.titulos};
            font-size: 0.95rem;
            color: ${theme.colors.clara.medio};
        }
    }
`;

const BotaoAddPassoStl = styled.button`
    background: ${theme.colors.azul.escuro};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
    }
`;

const CardPassoEdicaoStl = styled.div`
    background: rgba(14, 28, 48, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .passoTop {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .passoNum {
            font-weight: bold;
            font-size: 0.82rem;
            color: #38bdf8;
        }

        .btnRemover {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 2px;
            &:hover { opacity: 0.8; }
        }
    }

    input {
        background: ${theme.colors.azul.escuro};
        border: 1px solid ${theme.colors.azulMaisClaro.escuro};
        border-radius: 6px;
        padding: 8px 12px;
        color: ${theme.colors.clara.medio};
        font-size: 0.85rem;
        &:focus { outline: none; border-color: ${theme.colors.azulMaisClaro.claro}; }
    }

    textarea {
        background: ${theme.colors.azul.escuro};
        border: 1px solid ${theme.colors.azulMaisClaro.escuro};
        border-radius: 6px;
        padding: 8px 12px;
        color: ${theme.colors.clara.medio};
        font-size: 0.82rem;
        font-family: ${theme.fontsFamily.paragrafos};
        &:focus { outline: none; border-color: ${theme.colors.azulMaisClaro.claro}; }
    }
`;

const ModalFooterEdicaoStl = styled.div`
    padding: 16px 24px;
    background: ${theme.colors.azul.escuro};
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
`;

const BotaoCancelarEdicaoStl = styled.button`
    background: transparent;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    cursor: pointer;
    &:hover { background: rgba(255, 255, 255, 0.06); }
`;

const BotaoSalvarRascunhoStl = styled.button`
    background: ${theme.colors.azulMaisClaro.escuro};
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
        background: ${theme.colors.azulMaisClaro.medio};
    }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BotaoSalvarAprovarStl = styled.button`
    background: #10b981;
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
        background: #059669;
    }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
