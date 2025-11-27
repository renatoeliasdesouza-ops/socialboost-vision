"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export interface ScrapedProductData {
    name: string;
    description: string;
    price?: string;
    imageUrl?: string;
}

async function scrapeWithGemini(html: string): Promise<ScrapedProductData> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY não configurada");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analise este HTML de página de produto e extraia as informações em formato JSON.

HTML (primeiros 50000 caracteres):
${html.substring(0, 50000)}

Extraia APENAS as seguintes informações do produto:
1. Nome/Título do produto
2. Descrição completa do produto
3. Preço (se disponível)
4. URL da imagem principal (se disponível)

Responda APENAS em formato JSON válido:
{
  "name": "nome do produto",
  "description": "descrição completa do produto com todos os detalhes",
  "price": "preço formatado (opcional)",
  "imageUrl": "URL da imagem principal (opcional)"
}`;

    const result = await model.generateContent(prompt);
    const response_text = await result.response.text();

    const jsonMatch = response_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Formato de resposta inválido");
    }

    return JSON.parse(jsonMatch[0]);
}

async function scrapeWithOpenAI(html: string): Promise<ScrapedProductData> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY não configurada");
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Você é um assistente que extrai informações de produtos de páginas HTML. Responda APENAS em formato JSON válido."
            },
            {
                role: "user",
                content: `Analise este HTML e extraia: nome, descrição, preço e URL da imagem principal do produto.

HTML (primeiros 50000 caracteres):
${html.substring(0, 50000)}

Responda em JSON:
{
  "name": "nome do produto",
  "description": "descrição completa",
  "price": "preço (opcional)",
  "imageUrl": "URL da imagem (opcional)"
}`
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error("Resposta vazia da OpenAI");
    }

    return JSON.parse(content);
}

export async function scrapeProductUrl(url: string): Promise<ScrapedProductData> {
    try {
        // Fetch the HTML content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Não foi possível acessar a URL: ${response.status}`);
        }

        const html = await response.text();

        // Try Gemini first
        try {
            console.log("Tentando com Gemini...");
            const productData = await scrapeWithGemini(html);

            if (!productData.name || !productData.description) {
                throw new Error("Informações incompletas");
            }

            return {
                name: productData.name,
                description: productData.description,
                price: productData.price || undefined,
                imageUrl: productData.imageUrl || undefined
            };
        } catch (geminiError) {
            const errorMsg = geminiError instanceof Error ? geminiError.message : "";

            // If Gemini is overloaded or fails, try OpenAI
            if (errorMsg.includes("overloaded") || errorMsg.includes("503") || errorMsg.includes("429")) {
                console.log("Gemini sobrecarregada, tentando com OpenAI...");

                try {
                    const productData = await scrapeWithOpenAI(html);

                    if (!productData.name || !productData.description) {
                        throw new Error("Informações incompletas");
                    }

                    return {
                        name: productData.name,
                        description: productData.description,
                        price: productData.price || undefined,
                        imageUrl: productData.imageUrl || undefined
                    };
                } catch (openaiError) {
                    console.error("OpenAI também falhou:", openaiError);
                    throw new Error("Ambas as APIs falharam. Por favor, preencha manualmente.");
                }
            }

            // If it's not an overload error, throw the original error
            throw geminiError;
        }

    } catch (error) {
        console.error("Erro ao fazer scraping do produto:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        throw new Error(`Falha ao analisar URL: ${errorMessage}`);
    }
}
