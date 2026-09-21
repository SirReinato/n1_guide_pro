/**
 * Script de migração: JSON local → Supabase
 * 
 * Uso:
 *   1. Configure .env.local com as credenciais do Supabase
 *   2. Execute: npm run migrar
 * 
 * Execute apenas UMA VEZ após criar as tabelas no Supabase.
 */

// Carrega variáveis de ambiente do .env.local
const path = require("path");
require("fs");

// Lê o .env.local manualmente (sem dependência do dotenv)
const fs = require("fs");
const envPath = path.join(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...rest] = trimmed.split("=");
            if (key && rest.length) {
                process.env[key.trim()] = rest.join("=").trim();
            }
        }
    });
}

const { createClient } = require("@supabase/supabase-js");
const instalacoes = require("../src/data/instalacao.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("SEU_PROJETO")) {
    console.error("❌ Configure o .env.local com as credenciais do Supabase antes de migrar.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrar() {
    console.log("🚀 Iniciando migração dos dados...\n");

    const categorias = Object.keys(instalacoes);
    let totalManuais = 0;
    let totalPassos = 0;

    for (const nomeCategoria of categorias) {
        console.log(`📂 Categoria: ${nomeCategoria}`);

        // Inserir categoria
        const { data: categoria, error: errCat } = await supabase
            .from("categorias")
            .upsert({ nome: nomeCategoria }, { onConflict: "nome" })
            .select()
            .single();

        if (errCat) {
            console.error(`  ❌ Erro ao inserir categoria: ${errCat.message}`);
            continue;
        }

        const manuaisCategoria = instalacoes[nomeCategoria];

        for (const manual of manuaisCategoria) {
            // Inserir manual
            const { data: manualInserido, error: errManual } = await supabase
                .from("manuais")
                .upsert(
                    {
                        id: manual.id,
                        nome: manual.nome,
                        descricao: manual.descricao,
                        categoria_id: categoria.id,
                        gerado_por_ia: false,
                    },
                    { onConflict: "id" }
                )
                .select()
                .single();

            if (errManual) {
                console.error(`  ❌ Erro ao inserir manual "${manual.nome}": ${errManual.message}`);
                continue;
            }

            totalManuais++;
            console.log(`  ✅ Manual: ${manual.nome} (id: ${manualInserido.id})`);

            // Inserir passos
            const passos = manual.passo_passo || [];
            for (const passo of passos) {
                const { error: errPasso } = await supabase.from("passos").upsert(
                    {
                        manual_id: manualInserido.id,
                        passo: passo.passo,
                        titulo: passo.titulo,
                        descricao: passo.descricao,
                        imagem: passo.imagem || null,
                    },
                    { onConflict: "manual_id,passo" }
                );

                if (errPasso) {
                    console.error(`    ❌ Erro no passo ${passo.passo}: ${errPasso.message}`);
                } else {
                    totalPassos++;
                }
            }
        }
    }

    console.log(`\n🎉 Migração concluída!`);
    console.log(`   📚 Manuais migrados: ${totalManuais}`);
    console.log(`   📋 Passos migrados: ${totalPassos}`);
}

migrar().catch(console.error);
