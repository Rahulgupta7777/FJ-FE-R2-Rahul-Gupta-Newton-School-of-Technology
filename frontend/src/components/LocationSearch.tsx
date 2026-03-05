'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
    place_id: number;
}

interface LocationSearchProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (lat: number, lon: number, name: string) => void;
}

export default function LocationSearch({ placeholder, value, onChange, onSelect }: LocationSearchProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`
                );
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => value.length >= 3 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium placeholder:text-slate-400"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-slate-400 animate-spin" />
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.place_id}
                            onClick={() => {
                                onSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon), suggestion.display_name);
                                setShowSuggestions(false);
                            }}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer flex items-start space-x-3 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                        >
                            <Search className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{suggestion.display_name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
