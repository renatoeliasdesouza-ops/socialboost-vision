import { ProductData } from '../scraper/product-scraper';
import { AnalysisResult } from '../types';

export function generateIntelligentContent(
    productData: ProductData,
    imageAnalysis?: any
): Omit<AnalysisResult, 'previewUrl' | 'type'> {

    // Gerar score baseado em dados reais
    const score = calculateScore(productData, imageAnalysis);

    // Gerar títulos contextualizados
    const title = generateTitle(productData);

    // Gerar legenda persuasiva
    const caption = generateCaption(productData);

    // Gerar hashtags específicas
    const hashtags = generateHashtags(productData);

    // Gerar melhorias
    const improvements = generateImprovements(productData, imageAnalysis);

    return {
        score,
        title,
        caption,
        hashtags,
        improvements
    };
}

function calculateScore(productData: ProductData, imageAnalysis?: any): number {
    let score = 50; // Base

    // +20 pontos se tem título descritivo
    if (productData.title.length > 20) score += 10;
    if (productData.title.length > 40) score += 10;

    // +15 pontos se tem descrição
    if (productData.description.length > 50) score += 8;
    if (productData.description.length > 200) score += 7;

    // +10 pontos se tem imagens
    if (productData.images.length > 0) score += 5;
    if (productData.images.length > 2) score += 5;

    // +10 pontos se tem palavras-chave
    if (productData.keywords.length > 3) score += 5;
    if (productData.keywords.length > 6) score += 5;

    // +5 pontos se tem preço
    if (productData.price) score += 5;

    return Math.min(score, 98);
}

function generateTitle(productData: ProductData): string {
    const templates = [
        `🔥 ${productData.title.slice(0, 50)}... Você precisa ver!`,
        `✨ Descobri isso e mudou tudo: ${productData.title.slice(0, 45)}`,
        `💎 ${productData.title.slice(0, 50)} - Vale cada centavo!`,
        `🚀 Isso aqui é INCRÍVEL: ${productData.title.slice(0, 45)}!`,
        `⚡ ${productData.title.slice(0, 50)} - Qualidade surpreendente!`
    ];

    // Escolher template baseado em palavras-chave
    const hasQuality = productData.keywords.some(k =>
        ['qualidade', 'premium', 'luxo', 'profissional'].includes(k)
    );

    if (hasQuality) {
        return templates[2]; // Template de valor
    }

    return templates[Math.floor(Math.random() * templates.length)];
}

function generateCaption(productData: ProductData): string {
    const intro = generateIntro(productData);
    const body = generateBody(productData);
    const cta = generateCTA(productData);

    return `${intro}\n\n${body}\n\n${cta}`;
}

function generateIntro(productData: ProductData): string {
    const intros = [
        `Quem disse que qualidade custa caro? 🤔`,
        `Você já conhece ${productData.title.split(' ')[0]}? 👀`,
        `Isso aqui vai mudar sua vida! ✨`,
        `Encontrei o produto PERFEITO e preciso compartilhar! 💎`,
        `Testei e aprovei! Vem ver... 🔥`
    ];

    return intros[Math.floor(Math.random() * intros.length)];
}

function generateBody(productData: ProductData): string {
    // Usar descrição do produto ou criar baseado em keywords
    if (productData.description.length > 100) {
        const summary = productData.description.slice(0, 150) + '...';
        return `${summary}\n\n✅ Qualidade comprovada\n✅ Entrega rápida\n✅ Melhor custo-benefício`;
    }

    const benefits = productData.keywords.slice(0, 3).map(k => `✅ ${k.charAt(0).toUpperCase() + k.slice(1)}`);

    return `Esse produto tem tudo que você precisa:\n\n${benefits.join('\n')}\n\n💯 Testado e aprovado por milhares de clientes satisfeitos!`;
}

function generateCTA(productData: ProductData): string {
    const ctas = [
        `👉 Link na bio para comprar!\n💬 Comenta aqui o que achou!`,
        `🔗 Clica no link da bio e garante o seu!\n❤️ Salva esse post para não esquecer!`,
        `⚡ Corre que é por tempo limitado!\n📲 Link na bio!`,
        `🎯 Quer saber mais? Link na bio!\n💭 Me conta nos comentários!`,
        `🛒 Disponível agora! Link na bio!\n⭐ Marca aquele amigo que precisa disso!`
    ];

    return ctas[Math.floor(Math.random() * ctas.length)];
}

function generateHashtags(productData: ProductData): string[] {
    const baseHashtags = [
        '#dicasdecompras',
        '#produtobom',
        '#recomendo',
        '#valedinheiro',
        '#comprasonline'
    ];

    // Hashtags baseadas em keywords
    const keywordHashtags = productData.keywords
        .slice(0, 5)
        .map(k => `#${k.replace(/\s+/g, '')}`);

    // Hashtags da plataforma
    const platformHashtags: Record<string, string[]> = {
        mercadolivre: ['#mercadolivre', '#meli', '#comprasonline'],
        shopee: ['#shopee', '#shopeebrasil', '#comprasonline'],
        amazon: ['#amazon', '#amazonbrasil', '#comprasonline'],
        generic: ['#comprasonline', '#ecommerce']
    };

    // Hashtags de tendência (simuladas)
    const trendingHashtags = [
        '#foryou',
        '#viral',
        '#tendencia',
        '#novidade'
    ];

    // Combinar tudo
    const allHashtags = [
        ...keywordHashtags,
        ...baseHashtags,
        ...platformHashtags[productData.platform],
        ...trendingHashtags.slice(0, 2)
    ];

    // Remover duplicatas e limitar a 15
    return [...new Set(allHashtags)].slice(0, 15);
}

function generateImprovements(productData: ProductData, imageAnalysis?: any): string[] {
    const improvements: string[] = [];

    // Melhorias baseadas nos dados do produto
    if (!productData.price) {
        improvements.push('Adicione o preço do produto na descrição para aumentar conversões');
    }

    if (productData.images.length < 3) {
        improvements.push('Use mais imagens do produto (mínimo 3-5) para mostrar diferentes ângulos');
    }

    if (productData.description.length < 100) {
        improvements.push('Expanda a descrição do produto com mais detalhes e benefícios');
    }

    if (productData.keywords.length < 5) {
        improvements.push('Adicione mais palavras-chave relevantes para melhorar SEO');
    }

    // Melhorias genéricas de marketing
    improvements.push('Adicione depoimentos de clientes para aumentar credibilidade');
    improvements.push('Use emojis estratégicos para destacar pontos importantes');
    improvements.push('Crie senso de urgência com ofertas por tempo limitado');

    return improvements.slice(0, 5);
}
