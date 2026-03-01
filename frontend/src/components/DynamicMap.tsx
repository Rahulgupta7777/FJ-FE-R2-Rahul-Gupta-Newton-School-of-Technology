'use client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-gray-500 font-medium tracking-wide">Loading Map...</span>
        </div>
    )
});

export default DynamicMap;
