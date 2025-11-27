"use server";



export interface ProductAnalysisResult {
    product: {
        name: string;
        description: string;
    };
    suggestions: {
        socialMedia: {
            titles: string[];
            captions: string[];
            hashtags: string[];
            bestTimes: string[];
            improvements: string[];
        };
        marketplace: {
            title: string;
            description: string;
            keywords: string[];
            category: string;
            improvements: string[];
        };
    };
    score: number;
}

export async function analyzeProductAction(
    name: string,
    description: string
): Promise<ProductAnalysisResult> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Chave da API do Google Gemini não configurada.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analise este produto e gere sugestões COMPLETAS e PROFISSIONAIS para divulgação:

**PRODUTO:**
Nome: ${name}
Descrição: ${description}

**GERE EM FORMATO JSON:**

{
  "score": <número de 0-100 baseado no potencial de venda>,
  "socialMedia": {
    "titles": [<5 títulos chamativos para redes sociais, máx 60 caracteres, com emojis>],
    "captions": [<3 legendas completas e persuasivas, 150-200 caracteres, com storytelling e CTA>],
    "hashtags": [<15-20 hashtags relevantes, mix de nicho + genéricas + tendências>],
    "bestTimes": [<3 melhores horários para postar, formato: "Dia: HH:MM - HH:MM">],
    "improvements": [<5 sugestões específicas para melhorar presença em redes sociais>]
  },
  "marketplace": {
    "title": "<título otimizado para SEO com palavras-chave, máx 80 caracteres>",
    "description": "<descrição persuasiva e completa para marketplace, 200-300 caracteres>",
    "keywords": [<10-15 palavras-chave para SEO>],
    "category": "<categoria sugerida para marketplace>",
    "improvements": [<5 sugestões específicas para melhorar vendas em marketplace>]
  }
}

**IMPORTANTE:**
- Seja ESPECÍFICO para este produto
- Use linguagem BRASILEIRA
- Foque em CONVERSÃO e ENGAJAMENTO
- Sugestões devem ser ACIONÁVEIS`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extrair JSON da resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Não foi possível gerar análise (formato inválido)");
        }

        const analysis = JSON.parse(jsonMatch[0]);

        return {
            product: {
                name,
                description
            },
            suggestions: {
                socialMedia: {
                    titles: analysis.socialMedia.titles || [],
                    captions: analysis.socialMedia.captions || [],
                    hashtags: analysis.socialMedia.hashtags || [],
                    bestTimes: analysis.socialMedia.bestTimes || [],
                    improvements: analysis.socialMedia.improvements || []
                },
                marketplace: {
                    title: analysis.marketplace.title || name,
                    description: analysis.marketplace.description || description,
                    keywords: analysis.marketplace.keywords || [],
                    category: analysis.marketplace.category || "Geral",
                    improvements: analysis.marketplace.improvements || []
                }
            },
            score: analysis.score || 75
        };

    } catch (error) {
        console.error("Erro ao analisar produto:", error);
        // Retornar mensagem específica para debug
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        throw new Error(`Falha na API: ${errorMessage}`);
    }
}
