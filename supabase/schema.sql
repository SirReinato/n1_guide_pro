-- ============================================================
-- N1 GuidePro - Schema do Supabase
-- ============================================================
-- Execute este SQL no SQL Editor do Supabase:
-- https://supabase.com -> seu projeto -> SQL Editor
-- ============================================================

-- Habilita extensão de busca (opcional, para buscas avançadas no futuro)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Categorias dos manuais
CREATE TABLE IF NOT EXISTS categorias (
    id   SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

-- Manuais
CREATE TABLE IF NOT EXISTS manuais (
    id             SERIAL PRIMARY KEY,
    nome           TEXT NOT NULL,
    descricao      TEXT NOT NULL DEFAULT '',
    categoria_id   INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    gerado_por_ia  BOOLEAN NOT NULL DEFAULT FALSE,
    aprovado       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Passos de cada manual
CREATE TABLE IF NOT EXISTS passos (
    id        SERIAL PRIMARY KEY,
    manual_id INTEGER NOT NULL REFERENCES manuais(id) ON DELETE CASCADE,
    passo     INTEGER NOT NULL,
    titulo    TEXT NOT NULL,
    descricao TEXT,
    imagem    TEXT,
    UNIQUE(manual_id, passo)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_manuais_categoria ON manuais(categoria_id);
CREATE INDEX IF NOT EXISTS idx_passos_manual ON passos(manual_id);

-- ============================================================
-- Row Level Security (RLS) — leitura pública, escrita controlada
-- ============================================================

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuais    ENABLE ROW LEVEL SECURITY;
ALTER TABLE passos     ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode LER
CREATE POLICY "Leitura publica - categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Leitura publica - manuais"    ON manuais    FOR SELECT USING (true);
CREATE POLICY "Leitura publica - passos"     ON passos     FOR SELECT USING (true);

-- Apenas via service_role (API server-side) pode INSERIR/ATUALIZAR/DELETAR
-- (a anon_key nao tem permissao de escrita por padrao — o INSERT vem da API Route)
CREATE POLICY "Insert via service - manuais"    ON manuais    FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert via service - categorias" ON categorias FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert via service - passos"     ON passos     FOR INSERT WITH CHECK (true);
CREATE POLICY "Upsert via service - categorias" ON categorias FOR UPDATE USING (true);

-- ============================================================
-- PRONTO! Agora execute: npm run migrar
-- ============================================================
