
import React from 'react';
import { ImageResult } from '../types';

interface ImageItemProps {
    image: ImageResult;
    onDelete: (id: string) => void;
    onDownload: (url: string, filename: string) => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ image, onDelete, onDownload, isSelectionMode, isSelected, onToggleSelect }) => {
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this image?')) {
            onDelete(image.id);
        }
    };

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDownload(image.url, image.name);
    };
    
    const handleClick = () => {
        if (isSelectionMode) {
            onToggleSelect(image.id);
        }
    };

    return (
        <div 
            className={`group relative bg-[#2C3E50] rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isSelectionMode && 'border-4'} ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
            onClick={handleClick}
        >
            <img src={image.thumbUrl} alt={image.name} className="w-full h-32 object-cover" loading="lazy" />
            
            <div className="p-2 text-xs">
                <p className="font-bold text-white truncate">{image.name}</p>
                <p className="text-gray-400">{image.width}x{image.height}px</p>
            </div>
            
            <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-2 transition-opacity duration-300 ${isSelectionMode ? (isSelected ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'}`}>
                {isSelectionMode ? (
                     <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                ) : (
                    <>
                        <button onClick={handleDownloadClick} title="Download Image" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <button onClick={handleDeleteClick} title="Delete Image" className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageItem;
