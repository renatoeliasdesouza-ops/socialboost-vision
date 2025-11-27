import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ProductData {
    title: string;
    price?: string;
    description: string;
    category?: string;
    images: string[];
    keywords: string[];
    url: string;
    platform: 'mercadolivre' | 'shopee' | 'amazon' | 'generic';
}

export async function scrapeProduct(url: string): Promise<ProductData> {
    try {
        // Detectar plataforma
        const platform = detectPlatform(url);

        // Fazer requisição
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Parsear baseado na plataforma
        switch (platform) {
            case 'mercadolivre':
                return parseMercadoLivre($, url);
            case 'shopee':
                return parseShopee($, url);
            case 'amazon':
                return parseAmazon($, url);
            default:
                return parseGeneric($, url);
        }
    } catch (error) {
        console.error('Erro ao fazer scraping:', error);
        // Retornar dados genéricos em caso de erro
        return parseGeneric(null, url);
    }
}

function detectPlatform(url: string): ProductData['platform'] {
    if (url.includes('mercadolivre') || url.includes('mercadolibre')) {
        return 'mercadolivre';
    }
    if (url.includes('shopee')) {
        return 'shopee';
    }
    if (url.includes('amazon')) {
        return 'amazon';
    }
    return 'generic';
}

function parseMercadoLivre($: cheerio.CheerioAPI, url: string): ProductData {
    const title = $('h1.ui-pdp-title').text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        'Produto do Mercado Livre';

    const price = $('.andes-money-amount__fraction').first().text().trim();

    const description = $('.ui-pdp-description__content').text().trim() ||
        $('meta[property="og:description"]').attr('content') ||
        '';

    const images: string[] = [];
    $('img.ui-pdp-image').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && !images.includes(src)) {
            images.push(src);
        }
    });

    // Extrair palavras-chave do título e descrição
    const keywords = extractKeywords(title + ' ' + description);

    return {
        title,
        price: price ? `R$ ${price}` : undefined,
        description,
        images,
        keywords,
        url,
        platform: 'mercadolivre'
    };
}

function parseShopee($: cheerio.CheerioAPI, url: string): ProductData {
    const title = $('meta[property="og:title"]').attr('content') ||
        $('._3g6KIr').text().trim() ||
        'Produto da Shopee';

    const description = $('meta[property="og:description"]').attr('content') || '';

    const images: string[] = [];
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(ogImage);

    const keywords = extractKeywords(title + ' ' + description);

    return {
        title,
        description,
        images,
        keywords,
        url,
        platform: 'shopee'
    };
}

function parseAmazon($: cheerio.CheerioAPI, url: string): ProductData {
    const title = $('#productTitle').text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        'Produto da Amazon';

    const price = $('.a-price-whole').first().text().trim();

    const description = $('#feature-bullets').text().trim() ||
        $('meta[property="og:description"]').attr('content') ||
        '';

    const images: string[] = [];
    $('#altImages img').each((_, el) => {
        const src = $(el).attr('src');
        if (src) images.push(src);
    });

    const keywords = extractKeywords(title + ' ' + description);

    return {
        title,
        price: price ? `R$ ${price}` : undefined,
        description,
        images,
        keywords,
        url,
        platform: 'amazon'
    };
}

function parseGeneric($: cheerio.CheerioAPI | null, url: string): ProductData {
    if (!$) {
        return {
            title: 'Produto',
            description: 'Não foi possível extrair informações do site',
            images: [],
            keywords: [],
            url,
            platform: 'generic'
        };
    }

    const title = $('meta[property="og:title"]').attr('content') ||
        $('title').text().trim() ||
        'Produto';

    const description = $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

    const images: string[] = [];
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(ogImage);

    const keywords = extractKeywords(title + ' ' + description);

    return {
        title,
        description,
        images,
        keywords,
        url,
        platform: 'generic'
    };
}

function extractKeywords(text: string): string[] {
    // Remover pontuação e converter para minúsculas
    const cleaned = text.toLowerCase()
        .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Palavras comuns a ignorar
    const stopWords = new Set([
        'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos',
        'em', 'no', 'na', 'nos', 'nas', 'para', 'com', 'por', 'e', 'ou',
        'que', 'se', 'mais', 'muito', 'muito', 'produto', 'comprar'
    ]);

    // Extrair palavras únicas
    const words = cleaned.split(' ')
        .filter(word => word.length > 3 && !stopWords.has(word));

    // Contar frequência
    const frequency: Record<string, number> = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Retornar top 10 palavras mais frequentes
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
}
