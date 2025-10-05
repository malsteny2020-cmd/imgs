
import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/historyService';
import { HistoryEntry } from '../types';

interface HistoryViewProps {
    onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-[#1ABC9C]">Download History</h1>
            <div className="bg-[#34495E] rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1ABC9C] text-white uppercase text-sm">
                            <tr>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold">Source</th>
                                <th className="p-4 font-semibold">Keywords</th>
                                <th className="p-4 font-semibold">Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2C3E50]">
                            {history.length > 0 ? (
                                history.map(entry => (
                                    <tr key={entry.id} className="hover:bg-[#4A6572] transition-colors">
                                        <td className="p-4 whitespace-nowrap">{entry.timestamp}</td>
                                        <td className="p-4">{entry.source}</td>
                                        <td className="p-4 break-all">{entry.keywords}</td>
                                        <td className="p-4 text-center">{entry.imageCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-400">No history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-center mt-8">
                <button onClick={onBack} className="bg-[#7F8C8D] hover:bg-[#95A5A6] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                    ⬅ Back to Launcher
                </button>
            </div>
        </div>
    );
};

export default HistoryView;
