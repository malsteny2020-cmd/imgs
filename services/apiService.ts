import { GoogleGenAI, Type } from "@google/genai";
import { ImageResult } from '../types';

const PIXABAY_API_KEY = "26268642-36bfee31018fde17bfc90b30b";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseGeminiResponse = (responseText: string, count: number): Omit<ImageResult, 'id' | 'size'>[] => {
    try {
        const cleanedText = responseText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        // Handle both single object and array responses
        const dataArray = Array.isArray(parsed) ? parsed : [parsed];

        if (Array.isArray(dataArray) && dataArray.length > 0 && typeof dataArray[0] === 'object' && dataArray[0] !== null) {
            return dataArray.slice(0, count).map((item: any) => ({
                name: item.name || 'untitled.jpg',
                url: item.url || `https://picsum.photos/${item.width || 1200}/${item.height || 800}`,
                thumbUrl: item.thumbUrl || item.url || `https://picsum.photos/200/150`,
                width: item.width || 1200,
                height: item.height || 800,
            }));
        }
    } catch (error) {
        console.error("Failed to parse Gemini JSON response:", error);
    }
    return [];
};


export const fetchPixabayImages = async (query: string, count: number): Promise<ImageResult[]> => {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${count}&safesearch=true`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch from Pixabay');
    }
    const data = await response.json();
    return data.hits.map((hit: any) => ({
        id: hit.id.toString(),
        name: `${query.replace(/\s+/g, '_')}_${hit.id}.jpg`,
        url: hit.largeImageURL,
        thumbUrl: hit.webformatURL,
        width: hit.imageWidth,
        height: hit.imageHeight,
        size: hit.imageWidth * hit.imageHeight,
    }));
};

export const fetchGoogleImages = async (query: string, count: number): Promise<ImageResult[]> => {
    const MAX_IMAGES_PER_REQUEST = 4;
    let imagesToGenerate = count;
    const allGeneratedImages = [];

    while (imagesToGenerate > 0) {
        const batchSize = Math.min(imagesToGenerate, MAX_IMAGES_PER_REQUEST);

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, photorealistic image of: ${query}. Cinematic lighting, professional photograph.`,
            config: {
                numberOfImages: batchSize,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            allGeneratedImages.push(...response.generatedImages);
        }

        imagesToGenerate -= batchSize;
    }


    if (allGeneratedImages.length === 0) {
        throw new Error("The image generation model failed to create images for your query. Please try a different search term.");
    }

    const width = 1024;
    const height = 576;

    return allGeneratedImages.map((img, i) => {
        const dataUrl = `data:image/jpeg;base64,${img.image.imageBytes}`;
        return {
            id: `google_generated_${Date.now()}_${i}`,
            name: `${query.replace(/\s+/g, '_').substring(0, 50)}_${i + 1}.jpeg`,
            url: dataUrl,
            thumbUrl: dataUrl,
            width: width,
            height: height,
            size: width * height,
        };
    });
};


export const fetchFootyPlayerLinks = async (teamName: string, maxPages: number): Promise<string[]> => {
    const prompt = `Simulate scraping footyrenders.com for the team "${teamName}". Generate a realistic list of player page links. Generate about 15 links per page, for ${maxPages} pages. Return a JSON array of strings, where each string is a plausible unique URL like 'https://www.footyrenders.com/render/player-name-123'. Ensure player names are varied and realistic for the team.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
             responseMimeType: "application/json",
             responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
             }
        }
    });

    try {
        const cleanedText = response.text.replace(/```json|```/g, '').trim();
        const links = JSON.parse(cleanedText);
        return Array.isArray(links) ? links : [];
    } catch (e) {
        console.error("Failed to parse player links:", e);
        return [];
    }
};

export const downloadFootyImages = async (link: string, teamName: string): Promise<ImageResult | null> => {
    const playerName = link.split('/').pop()?.replace('render-', '').replace(/-/g, ' ') || 'player';
    const prompt = `Professional photo render of the football player ${playerName} from the team ${teamName}. The player is wearing the team's official kit. The image should have a transparent or clean, neutral background, in the style of a "footy render". High resolution, photorealistic.`;
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '3:4', // Renders are often portrait
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const dataUrl = `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
            const width = 768;
            const height = 1024;
            
            return {
                id: `footy_${Date.now()}_${Math.random()}`,
                name: `${playerName.replace(/\s+/g, '_')}.png`,
                url: dataUrl,
                thumbUrl: dataUrl,
                width: width,
                height: height,
                size: width * height,
            };
        }
        return null;
    } catch (e) {
        console.error(`Failed to generate image for ${link}:`, e);
        return null;
    }
};