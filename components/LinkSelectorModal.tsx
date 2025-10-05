
import React, { useState, useMemo } from 'react';

interface LinkSelectorModalProps {
    links: string[];
    onClose: () => void;
    onSelect: (selectedLinks: string[]) => void;
}

const LinkSelectorModal: React.FC<LinkSelectorModalProps> = ({ links, onClose, onSelect }) => {
    const initialSelection = useMemo(() => new Set(links), [links]);
    const [selectedLinks, setSelectedLinks] = useState<Set<string>>(initialSelection);

    const toggleLink = (link: string) => {
        const newSelection = new Set(selectedLinks);
        if (newSelection.has(link)) {
            newSelection.delete(link);
        } else {
            newSelection.add(link);
        }
        setSelectedLinks(newSelection);
    };

    const handleSelectAll = () => setSelectedLinks(new Set(links));
    const handleDeselectAll = () => setSelectedLinks(new Set());

    const handleSubmit = () => {
        onSelect(Array.from(selectedLinks));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#2C3E50] rounded-xl shadow-2xl p-6 max-w-2xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-[#1ABC9C] mb-4">Select Players to Download</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button onClick={handleSelectAll} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Select All</button>
                        <button onClick={handleDeselectAll} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">Deselect All</button>
                    </div>
                    <p className="font-bold">Selected: {selectedLinks.size} / {links.length}</p>
                </div>
                <div className="flex-grow overflow-y-auto bg-[#34495E] rounded-lg p-2 space-y-1">
                    {links.map(link => {
                        const isSelected = selectedLinks.has(link);
                        return (
                            <div key={link} onClick={() => toggleLink(link)} className={`p-2 rounded cursor-pointer flex items-center gap-3 transition-colors ${isSelected ? 'bg-blue-600' : 'hover:bg-gray-600'}`}>
                                <input type="checkbox" readOnly checked={isSelected} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 pointer-events-none"/>
                                <span className="truncate">{link.split('/').pop()?.replace(/-/g, ' ')}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-end items-center mt-6 gap-4">
                    <button onClick={onClose} className="bg-[#7F8C8D] hover:bg-[#95A5A6] text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="bg-[#3498DB] hover:bg-[#2980B9] text-white font-bold py-2 px-6 rounded-lg">Download Selected</button>
                </div>
            </div>
        </div>
    );
};

export default LinkSelectorModal;
