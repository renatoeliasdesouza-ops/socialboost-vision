import axios from 'axios';

export async function downloadImageFromUrl(imageUrl: string): Promise<File> {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        // Detectar tipo de imagem
        const contentType = response.headers['content-type'] || 'image/jpeg';

        // Converter para Blob e depois para File
        const blob = new Blob([response.data], { type: contentType });

        // Extrair nome do arquivo da URL ou usar genérico
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0] || 'product-image.jpg';

        // Criar File object
        const file = new File([blob], fileName, { type: contentType });

        return file;
    } catch (error) {
        console.error('Erro ao baixar imagem:', error);
        throw new Error('Não foi possível baixar a imagem do produto');
    }
}

export async function urlToFile(url: string): Promise<File> {
    return downloadImageFromUrl(url);
}
