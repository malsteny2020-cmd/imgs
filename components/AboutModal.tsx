
import React from 'react';

interface AboutModalProps {
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-[#2C3E50] rounded-xl shadow-2xl p-8 max-w-md w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-[#1ABC9C]">About Developer</h2>
                <div className="text-lg text-gray-200">
                    <p>Developer: Mohamed Ismail</p>
                    <p>Email: malsteny2020@gmail.com</p>
                    <p>Purpose: Easy Image Downloader</p>
                </div>
                <button onClick={onClose} className="mt-6 bg-[#7F8C8D] hover:bg-[#95A5A6] text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};

export default AboutModal;
