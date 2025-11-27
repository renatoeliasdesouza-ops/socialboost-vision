import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBusodHo83eTyf5Kv30Uk985NdcmBpUoAA");

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

export async function analyzeImageWithAI(imageFile: File): Promise<ImageAnalysis> {
    try {
        // Converter imagem para base64
        const imageData = await fileToBase64(imageFile);

        // Usar Gemini Pro Vision
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Responda em formato JSON estruturado.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageData,
                    mimeType: imageFile.type
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Tentar parsear JSON da resposta
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error("Erro ao parsear JSON:", e);
        }

        // Fallback: criar análise estruturada do texto
        return parseTextAnalysis(text);

    } catch (error) {
        console.error("Erro na análise com Gemini:", error);
        throw error;
    }
}

export async function generateContentWithAI(
    productData: any,
    imageAnalysis?: ImageAnalysis
): Promise<{
    titles: string[];
    captions: string[];
    hashtags: string[];
}> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Com base nestes dados de produto:
Título: ${productData.title}
Descrição: ${productData.description}
Palavras-chave: ${productData.keywords.join(", ")}
${imageAnalysis ? `Análise visual: Score ${imageAnalysis.commercialAppeal.score}/100` : ''}

Gere conteúdo OTIMIZADO para redes sociais em português do Brasil:

1. TÍTULOS (gere 5 opções):
   - Máximo 60 caracteres
   - Use emojis estratégicos
   - Gatilhos mentais (urgência, exclusividade, curiosidade)
   - Foco em benefícios

2. LEGENDAS (gere 3 opções):
   - Estrutura: Gancho + Corpo + CTA
   - 150-200 caracteres
   - Storytelling envolvente
   - Call-to-action claro

3. HASHTAGS (gere 15-20):
   - Mix de nicho + genéricas + tendências
   - Alta/média/baixa concorrência
   - Relevantes para o produto

Responda em formato JSON:
{
  "titles": ["título 1", "título 2", ...],
  "captions": ["legenda 1", "legenda 2", ...],
  "hashtags": ["#hashtag1", "#hashtag2", ...]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parsear JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error("Não foi possível gerar conteúdo");

    } catch (error) {
        console.error("Erro ao gerar conteúdo:", error);
        throw error;
    }
}

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function parseTextAnalysis(text: string): ImageAnalysis {
    // Extrair informações do texto não estruturado
    const scoreMatch = text.match(/score[:\s]+(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    return {
        composition: extractSection(text, "composição") || "Composição equilibrada com elementos bem distribuídos.",
        lighting: extractSection(text, "iluminação") || "Iluminação adequada para o tipo de produto.",
        colors: extractSection(text, "cores") || "Paleta de cores harmoniosa.",
        quality: extractSection(text, "qualidade") || "Boa qualidade técnica geral.",
        commercialAppeal: {
            score,
            strengths: extractList(text, "pontos fortes") || [
                "Produto bem destacado",
                "Boa composição visual",
                "Cores atrativas"
            ],
            weaknesses: extractList(text, "pontos fracos") || [
                "Pode melhorar iluminação",
                "Adicionar mais contexto"
            ]
        },
        improvements: extractList(text, "melhorias") || [
            "Aumentar contraste para destacar detalhes",
            "Melhorar iluminação do produto",
            "Adicionar elementos de contexto"
        ]
    };
}

function extractSection(text: string, section: string): string | null {
    const regex = new RegExp(`${section}[:\\s]+([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
}

function extractList(text: string, section: string): string[] | null {
    const regex = new RegExp(`${section}[:\\s]+([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = text.match(regex);
    if (!match) return null;

    return match[1]
        .split('\n')
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
}
