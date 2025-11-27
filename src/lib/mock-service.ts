import { AnalysisResult } from './types';
import { scrapeProduct } from './scraper/product-scraper';
import { generateIntelligentContent } from './ai/content-generator';

export async function analyzeContent(
    content: File | string,
    type: 'image' | 'link'
): Promise<AnalysisResult> {

    if (type === 'link' && typeof content === 'string') {
        return await analyzeLink(content);
    } else {
        return await analyzeImage(content as File);
    }
}

async function analyzeLink(url: string): Promise<AnalysisResult> {
    try {
        // Fazer scraping do produto
        const productData = await scrapeProduct(url);

        // Tentar baixar e analisar a primeira imagem com Gemini
        let imageAnalysis = null;
        if (productData.images.length > 0) {
            try {
                const { downloadImageFromUrl } = await import('./utils/image-downloader');
                const { analyzeImageWithAI } = await import('./ai/gemini-vision');

                const imageFile = await downloadImageFromUrl(productData.images[0]);
                imageAnalysis = await analyzeImageWithAI(imageFile);
            } catch (error) {
                console.error('Erro ao analisar imagem do produto:', error);
            }
        }

        // Gerar conteúdo inteligente baseado nos dados + análise de imagem
        const generatedContent = generateIntelligentContent(productData, imageAnalysis);

        // Usar primeira imagem do produto como preview
        const previewUrl = productData.images[0] ||
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop";

        // Se temos análise de imagem, usar o score dela
        const score = imageAnalysis
            ? Math.round((imageAnalysis.commercialAppeal.score + generatedContent.score) / 2)
            : generatedContent.score;

        return {
            type: 'link',
            previewUrl,
            score,
            title: generatedContent.title,
            caption: generatedContent.caption,
            hashtags: generatedContent.hashtags,
            improvements: imageAnalysis
                ? [...imageAnalysis.improvements, ...generatedContent.improvements].slice(0, 5)
                : generatedContent.improvements
        };
    } catch (error) {
        console.error('Erro na análise do link:', error);

        // Fallback para análise básica
        return {
            type: 'link',
            previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
            score: 65,
            title: "🔥 Produto Incrível - Você Precisa Ver!",
            caption: "Encontrei esse produto e preciso compartilhar! ✨\n\nQualidade surpreendente e preço justo.\n\n👉 Link na bio para comprar!\n💬 Comenta aqui o que achou!",
            hashtags: ["#produtobom", "#recomendo", "#comprasonline", "#valedinheiro", "#dicasdecompras"],
            improvements: [
                "Adicione mais imagens do produto para melhor visualização",
                "Inclua depoimentos de clientes na descrição",
                "Use emojis estratégicos para destacar benefícios"
            ]
        };
    }
}

async function analyzeImage(file: File): Promise<AnalysisResult> {
    try {
        // Tentar análise com Gemini Vision
        const { analyzeImageWithAI, generateContentWithAI } = await import('./ai/gemini-vision');

        const imageAnalysis = await analyzeImageWithAI(file);
        const generatedContent = await generateContentWithAI(
            {
                title: "Imagem para redes sociais",
                description: "",
                keywords: []
            },
            imageAnalysis
        );

        const previewUrl = URL.createObjectURL(file);

        return {
            type: 'image',
            previewUrl,
            score: imageAnalysis.commercialAppeal.score,
            title: generatedContent.titles[0] || "✨ Conteúdo Incrível!",
            caption: generatedContent.captions[0] || "Veja essa postagem incrível!",
            hashtags: generatedContent.hashtags.slice(0, 10),
            improvements: imageAnalysis.improvements
        };

    } catch (error) {
        console.error('Erro ao usar Gemini, usando análise básica:', error);

        // Fallback para análise básica
        return await analyzeImageBasic(file);
    }
}

async function analyzeImageBasic(file: File): Promise<AnalysisResult> {
    // Simular delay de análise
    await new Promise(resolve => setTimeout(resolve, 3500));

    const previewUrl = URL.createObjectURL(file);
    const score = Math.floor(Math.random() * (92 - 70) + 70);

    const titles = [
        "✨ Essa imagem está INCRÍVEL! Vem ver...",
        "🔥 Conteúdo que vai bombar nas redes!",
        "💎 Qualidade profissional - Aproveita!",
        "🚀 Isso aqui vai viralizar, tenho certeza!",
        "⚡ Visual impecável! Salva esse post!"
    ];

    const captions = [
        "Quando a qualidade fala por si só! 😍\n\nEsse visual ficou simplesmente perfeito.\n\n✅ Composição impecável\n✅ Cores vibrantes\n✅ Profissionalismo total\n\n👉 Salva esse post!\n💬 Marca aquele amigo que precisa ver isso!",
        "Olha que SHOW ficou isso! 🎨\n\nCada detalhe pensado com carinho para entregar o melhor resultado.\n\n💯 Qualidade garantida\n💯 Visual atrativo\n💯 Engajamento certo\n\n🔗 Quer saber mais? Me chama no direct!\n❤️ Deixa aquele like se curtiu!",
        "Isso aqui é o que eu chamo de CONTEÚDO! 🌟\n\nQuando você capricha nos detalhes, o resultado aparece.\n\n✨ Profissionalismo\n✨ Criatividade\n✨ Impacto visual\n\n📲 Compartilha com quem precisa ver!\n💭 Comenta aqui sua opinião!"
    ];

    const hashtagSets = [
        ["#conteudodqualidade", "#marketingdigital", "#redesociais", "#criacaodeconteudo", "#designgrafico", "#visualidentity", "#branding", "#socialmedia"],
        ["#fotografiaprofissional", "#producaodeconteudo", "#contentcreator", "#instagramtips", "#socialmediamarketing", "#digitalmarketing", "#contentmarketing", "#visualcontent"],
        ["#criatividadesemfim", "#designinspiration", "#marketingdeconteudo", "#estrategiadigital", "#conteudocriativo", "#socialmediatips", "#brandingdesign", "#visualmarketing"]
    ];

    const improvements = [
        "Aumente o contraste em 10-15% para destacar melhor os elementos principais",
        "Considere adicionar texto overlay com call-to-action visível",
        "Experimente aplicar filtro de saturação +20% para cores mais vibrantes",
        "Adicione logo/marca d'água discreta no canto inferior",
        "Use regra dos terços para reposicionar elemento focal"
    ];

    return {
        type: 'image',
        previewUrl,
        score,
        title: titles[Math.floor(Math.random() * titles.length)],
        caption: captions[Math.floor(Math.random() * captions.length)],
        hashtags: hashtagSets[Math.floor(Math.random() * hashtagSets.length)],
        improvements: improvements.sort(() => 0.5 - Math.random()).slice(0, 3)
    };
}
