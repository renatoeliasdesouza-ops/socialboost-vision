"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ImageAnalysis {
    composition: string;
    lighting: string;
    colors: string;
    quality: string;
    commercialAppeal: {
        score: number;
        strengths: string[];
        weaknesses: string[];
    };
    improvements: string[];
}

export async function analyzeImageAction(
    imageBase64: string,
    mimeType: string
): Promise<ImageAnalysis> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Chave da API do Google Gemini não configurada.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analise esta imagem de produto/postagem para redes sociais e forneça uma análise DETALHADA em português do Brasil:

1. COMPOSIÇÃO:
   - Regra dos terços
   - Pontos focais
   - Enquadramento
   - Simetria/Assimetria

2. ILUMINAÇÃO:
   - Tipo de luz (natural/artificial)
   - Direção da luz
   - Qualidade (dura/suave)
   - Temperatura de cor

3. CORES:
   - Paleta de cores
   - Harmonia cromática
   - Contraste
   - Saturação

4. QUALIDADE TÉCNICA:
   - Nitidez
   - Exposição
   - Ruído/Granulação
   - Resolução aparente

5. APELO COMERCIAL (0-100):
   - Pontos fortes (liste 3-5)
   - Pontos fracos (liste 2-4)
   - Score geral

6. MELHORIAS ESPECÍFICAS:
   - Liste 5-7 sugestões PRÁTICAS e TÉCNICAS
   - Inclua valores específicos quando possível (ex: "aumentar contraste em 15%")

Responda APENAS em formato JSON válido seguindo esta estrutura:
{
  "composition": "análise da composição",
  "lighting": "análise da iluminação",
  "colors": "análise das cores",
  "quality": "análise da qualidade técnica",
  "commercialAppeal": {
    "score": 85,
    "strengths": ["ponto forte 1", "ponto forte 2", ...],
    "weaknesses": ["ponto fraco 1", "ponto fraco 2", ...]
  },
  "improvements": ["melhoria 1", "melhoria 2", ...]
}`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Extrair JSON da resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Não foi possível gerar análise da imagem (formato inválido)");
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Validar e retornar estrutura
        return {
            composition: analysis.composition || "Composição equilibrada.",
            lighting: analysis.lighting || "Iluminação adequada.",
            colors: analysis.colors || "Paleta de cores harmoniosa.",
            quality: analysis.quality || "Boa qualidade técnica.",
            commercialAppeal: {
                score: analysis.commercialAppeal?.score || 75,
                strengths: analysis.commercialAppeal?.strengths || ["Produto bem destacado"],
                weaknesses: analysis.commercialAppeal?.weaknesses || ["Pode melhorar iluminação"]
            },
            improvements: analysis.improvements || ["Melhorar iluminação", "Aumentar contraste"]
        };

    } catch (error) {
        console.error("Erro ao analisar imagem:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        throw new Error(`Falha na análise da imagem: ${errorMessage}`);
    }
}
