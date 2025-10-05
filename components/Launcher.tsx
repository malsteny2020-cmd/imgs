
import React, { useState } from 'react';
import { AppView, DownloaderSource } from '../types';
import AboutModal from './AboutModal';
import HelpModal from './HelpModal';

interface LauncherProps {
    onNavigate: (view: AppView, source?: DownloaderSource) => void;
}

const Launcher: React.FC<LauncherProps> = ({ onNavigate }) => {
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);

    const buttonStyle = "w-full text-left text-lg font-bold p-5 rounded-3xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4";
    const googleStyle = "bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-blue-400";
    const pixabayStyle = "bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:ring-green-400";
    const footyStyle = "bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 focus:ring-orange-400";
    const historyStyle = "bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 focus:ring-yellow-400";
    const helpStyle = "bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 focus:ring-purple-400";
    const aboutStyle = "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 !text-base !p-3";

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6">
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-[#1ABC9C]">Image Downloader</h1>
                    <p className="text-gray-300 mt-2">Select your image source</p>
                </header>

                <main className="bg-black bg-opacity-20 p-6 rounded-2xl shadow-lg space-y-4">
                    <button className={`${buttonStyle} ${googleStyle}`} onClick={() => onNavigate('google', 'google')}>🔎 Google Images Downloader</button>
                    <button className={`${buttonStyle} ${pixabayStyle}`} onClick={() => onNavigate('pixabay', 'pixabay')}>📸 Pixabay Images Downloader</button>
                    <button className={`${buttonStyle} ${footyStyle}`} onClick={() => onNavigate('footy', 'footy')}>⚽ Footy Renders Downloader</button>
                    <button className={`${buttonStyle} ${historyStyle}`} onClick={() => onNavigate('history')}>📜 Download History</button>
                    <button className={`${buttonStyle} ${helpStyle}`} onClick={() => setHelpModalOpen(true)}>❓ Help</button>
                    <button className={`${buttonStyle} ${aboutStyle}`} onClick={() => setAboutModalOpen(true)}>ℹ️ About</button>
                </main>
            </div>
            {isAboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
            {isHelpModalOpen && <HelpModal onClose={() => setHelpModalOpen(false)} />}
        </div>
    );
};

export default Launcher;
