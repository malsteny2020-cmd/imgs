import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DownloaderSource, ImageResult } from '../types';
import { fetchGoogleImages, fetchPixabayImages, fetchFootyPlayerLinks, downloadFootyImages } from '../services/apiService';
import { addHistoryEntry } from '../services/historyService';
import ImageItem from './ImageItem';
import Spinner from './Spinner';
import LinkSelectorModal from './LinkSelectorModal';

declare var JSZip: any;

interface ImageDownloaderViewProps {
    source: DownloaderSource;
    onBack: () => void;
}

const TITLES: Record<DownloaderSource, string> = {
    google: '🔎 Google Images Downloader',
    pixabay: '📸 Pixabay Images Downloader',
    footy: '⚽ Footy Renders Downloader',
};

const ImageDownloaderView: React.FC<ImageDownloaderViewProps> = ({ source, onBack }) => {
    const [keywords, setKeywords] = useState('');
    const [teamUrl, setTeamUrl] = useState('');
    const [numImages, setNumImages] = useState(5);
    const [maxPages, setMaxPages] = useState(3);
    
    const [images, setImages] = useState<ImageResult[]>([]);
    const [logs, setLogs] = useState<string[]>(['Log is ready...']);
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [sortBySize, setSortBySize] = useState(false);

    const [showLinkSelector, setShowLinkSelector] = useState(false);
    const [playerLinks, setPlayerLinks] = useState<string[]>([]);
    
    useEffect(() => {
        setIsSelectionMode(false);
        setSelectedImages(new Set());
    }, [images]);

    const addLog = useCallback((message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    }, []);
    
    const downloadFile = useCallback((url: string, filename: string) => {
        fetch(url, { mode: 'cors' })
            .then(res => res.blob())
            .then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(e => {
                console.error("Download failed for", url, e);
                addLog(`⚠️ Failed to download ${filename}. This might be a CORS issue. Try opening the image in a new tab and saving from there.`);
                window.open(url, '_blank');
            });
    }, [addLog]);

    const handleDownload = async () => {
        const queries = keywords.split(',').map(q => q.trim()).filter(Boolean);
        if ((source === 'google' || source === 'pixabay') && queries.length === 0) {
            addLog('⚠️ Please enter at least one keyword.');
            return;
        }
         if (source === 'footy' && !teamUrl) {
            addLog('⚠️ Please enter a team name/URL.');
            return;
        }

        setIsLoading(true);
        setImages([]);
        setLogs(['🚀 Starting download...']);
        setProgress({ current: 0, total: 1 });
        
        try {
            let results: ImageResult[] = [];
            if (source === 'google') {
                const total = queries.length * numImages;
                setProgress({ current: 0, total });
                addLog(`Fetching ${total} images from Google...`);
                for (const query of queries) {
                    const res = await fetchGoogleImages(query, numImages);
                    results.push(...res);
                    setProgress(p => ({ ...p, current: p.current + res.length }));
                    addLog(`✅ Fetched ${res.length} images for "${query}"`);
                }
                addHistoryEntry({ source: 'Google', keywords: keywords, imageCount: results.length });
            } else if (source === 'pixabay') {
                const total = queries.length * numImages;
                setProgress({ current: 0, total });
                 addLog(`Fetching ${total} images from Pixabay...`);
                for (const query of queries) {
                    const res = await fetchPixabayImages(query, numImages);
                    results.push(...res);
                    setProgress(p => ({ ...p, current: p.current + res.length }));
                    addLog(`✅ Fetched ${res.length} images for "${query}"`);
                }
                 addHistoryEntry({ source: 'Pixabay', keywords: keywords, imageCount: results.length });
            } else if (source === 'footy') {
                 addLog(`Collecting player links for "${teamUrl}"...`);
                 const links = await fetchFootyPlayerLinks(teamUrl, maxPages);
                 addLog(`✅ Collected ${links.length} potential player links.`);
                 if (links.length > 0) {
                     setPlayerLinks(links);
                     setShowLinkSelector(true);
                 } else {
                     addLog('No links found.');
                 }
                 // The download continues in handleLinksSelected
                 return; // Prevent isLoading from being set to false yet
            }
            setImages(results);
            addLog('🎯 Download complete!');
        } catch (error) {
            console.error(error);
            addLog(`❌ Error: ${(error as Error).message}`);
        }
        setIsLoading(false);
    };

    const zipAndDownloadImages = async (imagesToZip: ImageResult[], zipName: string) => {
        if (imagesToZip.length === 0) return;
        setIsZipping(true);
        addLog(`📦 Creating ZIP file with ${imagesToZip.length} images... this may take a while.`);
        const zip = new JSZip();
        let downloadedCount = 0;

        // Use a copy of the images array for progress tracking
        const imagesToProcess = [...imagesToZip];
        
        for (let i = 0; i < imagesToProcess.length; i++) {
            const image = imagesToProcess[i];
            try {
                const response = await fetch(image.url, { mode: 'cors' });
                const blob = await response.blob();
                zip.file(image.name, blob);
                downloadedCount++;
                addLog(`Zipping ${i + 1}/${imagesToProcess.length}: ${image.name}`);
            } catch (e) {
                addLog(`⚠️ Skipping ${image.name} due to CORS or network error.`);
                console.error(`Failed to fetch ${image.url} for zipping`, e);
            }
        }
        
        if (downloadedCount > 0) {
            zip.generateAsync({ type: "blob" })
            .then(function(content) {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(content);
                a.download = `${zipName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                addLog("✅ ZIP file download initiated.");
            });
        } else {
            addLog("❌ No images could be downloaded for the ZIP file.");
        }
        
        setIsZipping(false);
    };
    
    const handleLinksSelected = async (selectedLinks: string[]) => {
        setShowLinkSelector(false);
        if (selectedLinks.length === 0) {
            addLog('No links selected. Aborting download.');
            setIsLoading(false);
            return;
        }

        addLog(`🚀 Generating ${selectedLinks.length} player images... This may take a moment.`);
        setIsLoading(true);
        setImages([]); // Clear previous results for a clean slate
        setProgress({ current: 0, total: selectedLinks.length });
        
        const fetchedImages: ImageResult[] = [];
        for (let i = 0; i < selectedLinks.length; i++) {
            const link = selectedLinks[i];
            const playerName = link.split('/').pop()?.replace(/-/g, ' ').replace('render ', '') || 'player';
            addLog(`[${i + 1}/${selectedLinks.length}] Generating render for ${playerName}...`);
            try {
                const result = await downloadFootyImages(link, teamUrl);
                if (result) {
                    fetchedImages.push(result);
                } else {
                     addLog(`⚠️ No image generated for ${playerName}.`);
                }
            } catch (error) {
                addLog(`❌ Error processing link for ${playerName}: ${(error as Error).message}`);
            }
            setProgress(p => ({ ...p, current: i + 1 }));
        }

        setImages(fetchedImages);
        
        if (fetchedImages.length > 0) {
            addLog(`✅ Process complete! ${fetchedImages.length} images are now displayed in the results panel.`);
            addHistoryEntry({ source: 'Footy Renders', keywords: teamUrl, imageCount: fetchedImages.length });
        } else {
             addLog('❌ No images could be fetched from the selected links.');
        }
        
        setIsLoading(false);
    };

    const clearAll = () => {
        setImages([]);
        setLogs(['Log and images cleared.']);
        setProgress({ current: 0, total: 0 });
        setKeywords('');
        setTeamUrl('');
    };

    const deleteImage = useCallback((id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    }, []);

    const toggleSelectImage = (id: string) => {
        const newSelection = new Set(selectedImages);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedImages(newSelection);
    };

    const deleteSelectedImages = () => {
        setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
        setIsSelectionMode(false);
        setSelectedImages(new Set());
    };

    const downloadAllAsZip = async () => {
        await zipAndDownloadImages(images, keywords || teamUrl || 'images');
    };

    const sortedImages = useMemo(() => {
        if (!sortBySize) {
            return images;
        }
        return [...images].sort((a, b) => b.size - a.size);
    }, [images, sortBySize]);

    const inputSection = useMemo(() => {
        if (source === 'footy') {
            return (
                <>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="text" value={teamUrl} onChange={e => setTeamUrl(e.target.value)} placeholder="Enter Team Name (e.g., Real Madrid)" className="flex-grow bg-[#34495E] border border-[#566573] rounded-lg p-3 focus:ring-2 focus:ring-[#1ABC9C] focus:outline-none" />
                        <div className="flex items-center gap-2">
                            <label htmlFor="maxPages">Max Pages:</label>
                            <input id="maxPages" type="number" min="1" max="50" value={maxPages} onChange={e => setMaxPages(parseInt(e.target.value, 10))} className="w-20 bg-[#34495E] border border-[#566573] rounded-lg p-3" />
                        </div>
                    </div>
                </>
            );
        }
        return (
             <div className="flex flex-col md:flex-row gap-4">
                <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Enter keywords (e.g., cats, dogs)" className="flex-grow bg-[#34495E] border border-[#566573] rounded-lg p-3 focus:ring-2 focus:ring-[#1ABC9C] focus:outline-none" />
                <div className="flex items-center gap-2">
                    <label htmlFor="numImages">Images/Keyword:</label>
                    <input id="numImages" type="number" min="1" max="100" value={numImages} onChange={e => setNumImages(parseInt(e.target.value, 10))} className="w-20 bg-[#34495E] border border-[#566573] rounded-lg p-3" />
                </div>
            </div>
        );
    }, [source, keywords, numImages, teamUrl, maxPages]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {showLinkSelector && <LinkSelectorModal links={playerLinks} onClose={() => setShowLinkSelector(false)} onSelect={handleLinksSelected} />}
            <h1 className="text-3xl font-bold text-center mb-6 text-[#1ABC9C]">{TITLES[source]}</h1>
            
            <div className="bg-[#34495E] p-6 rounded-lg shadow-xl space-y-4 mb-6">
                {inputSection}
                <div className="flex items-center gap-4">
                    <progress value={progress.current} max={progress.total} className="w-full h-4 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:bg-[#1ABC9C]"></progress>
                    <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={handleDownload} disabled={isLoading} className="bg-[#E67E22] hover:bg-[#F39C12] text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-500 transition-colors text-lg col-span-1 md:col-span-3">
                        {isLoading ? <Spinner /> : `▶ Start ${source === 'footy' ? 'Collecting Links' : 'Download'}`}
                    </button>
                    <button onClick={onBack} className="bg-[#7F8C8D] hover:bg-[#95A5A6] text-white font-bold py-3 px-4 rounded-lg transition-colors">⬅ Back</button>
                    <button onClick={clearAll} className="bg-[#E74C3C] hover:bg-[#C0392B] text-white font-bold py-3 px-4 rounded-lg transition-colors">🗑 Clear All</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Results ({images.length})</h2>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-[#34495E] p-2 rounded-lg">
                                <input type="checkbox" checked={sortBySize} onChange={e => setSortBySize(e.target.checked)} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[#1ABC9C] focus:ring-[#1ABC9C]"/>
                                <span>Sort by size</span>
                            </label>
                             <button onClick={downloadAllAsZip} disabled={isZipping || images.length === 0} className="bg-[#9B59B6] hover:bg-[#AF7AC5] text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 transition-colors">
                                {isZipping ? <Spinner /> : '📂 Download All (.zip)'}
                            </button>
                            {!isSelectionMode ? (
                                <button onClick={() => setIsSelectionMode(true)} disabled={images.length === 0} className="bg-[#3498DB] hover:bg-[#5DADE2] text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 transition-colors">
                                    ☑️ Select & Delete
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={deleteSelectedImages} className="bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded-lg">Delete ({selectedImages.size})</button>
                                    <button onClick={() => setIsSelectionMode(false)} className="bg-gray-500 hover:bg-gray-600 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-[#34495E] p-4 rounded-lg min-h-[400px]">
                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {sortedImages.map(img => (
                                    <ImageItem 
                                        key={img.id} 
                                        image={img} 
                                        onDelete={deleteImage} 
                                        onDownload={downloadFile}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedImages.has(img.id)}
                                        onToggleSelect={toggleSelectImage}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>Images will appear here once downloaded.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <h2 className="text-2xl font-bold mb-4">Log</h2>
                     <div ref={(el) => { el?.scrollTo(0, el.scrollHeight); }} className="bg-[#34495E] p-4 rounded-lg h-[440px] overflow-y-auto text-sm font-mono space-y-1">
                        {logs.map((log, i) => <p key={i} className={log.startsWith('❌') || log.startsWith('⚠️') ? 'text-red-400' : 'text-gray-300'}>{log}</p>)}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDownloaderView;