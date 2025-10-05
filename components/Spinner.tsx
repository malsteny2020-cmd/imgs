
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="inline-flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Loading...</span>
        </div>
    );
};

export default Spinner;
