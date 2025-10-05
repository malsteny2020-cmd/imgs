
import React, { useState, useCallback } from 'react';
import { AppView, DownloaderSource } from './types';
import Launcher from './components/Launcher';
import ImageDownloaderView from './components/ImageDownloaderView';
import HistoryView from './components/HistoryView';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('launcher');
    const [downloaderSource, setDownloaderSource] = useState<DownloaderSource>('google');

    const handleNavigate = useCallback((newView: AppView, source?: DownloaderSource) => {
        if (source) {
            setDownloaderSource(source);
        }
        setView(newView);
    }, []);

    const renderView = () => {
        switch (view) {
            case 'google':
            case 'pixabay':
            case 'footy':
                return <ImageDownloaderView source={view} onBack={() => handleNavigate('launcher')} />;
            case 'history':
                return <HistoryView onBack={() => handleNavigate('launcher')} />;
            case 'launcher':
            default:
                return <Launcher onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-[#2C3E50] min-h-screen text-[#ECF0F1] font-sans">
            {renderView()}
        </div>
    );
};

export default App;
