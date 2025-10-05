
export type DownloaderSource = 'google' | 'pixabay' | 'footy';
export type AppView = DownloaderSource | 'launcher' | 'history';

export interface ImageResult {
    id: string;
    name: string;
    url: string;
    thumbUrl: string;
    width: number;
    height: number;
    size: number;
}

export interface HistoryEntry {
    id: string;
    timestamp: string;
    source: string;
    keywords: string;
    imageCount: number;
}
