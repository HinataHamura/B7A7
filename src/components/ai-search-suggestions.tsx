'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Search } from 'lucide-react';

interface Suggestion {
  query: string;
  category: string;
}

const SUGGESTION_MAP: Record<string, Suggestion[]> = {
  'd': [
    { query: 'Dhanmondi', category: 'Neighborhood' },
    { query: 'Dhaka', category: 'City' },
  ],
  'g': [
    { query: 'Gulshan', category: 'Neighborhood' },
    { query: 'Green Road, Dhanmondi', category: 'Area' },
  ],
  'b': [
    { query: 'Banani', category: 'Neighborhood' },
    { query: 'Bashundhara', category: 'Neighborhood' },
    { query: 'Budget room Mirpur', category: 'Smart search' },
  ],
  'm': [
    { query: 'Mirpur', category: 'Neighborhood' },
    { query: 'Mohammadpur', category: 'Neighborhood' },
  ],
  'u': [
    { query: 'Uttara', category: 'Neighborhood' },
  ],
  'r': [
    { query: 'Room near university', category: 'Smart search' },
    { query: 'Rayer Bazar', category: 'Neighborhood' },
  ],
  'n': [
    { query: 'Near BUET', category: 'Smart search' },
    { query: 'Near Dhaka University', category: 'Smart search' },
  ],
  's': [
    { query: 'Shared room Dhanmondi', category: 'Smart search' },
    { query: 'Studio apartment Gulshan', category: 'Smart search' },
  ],
  'p': [
    { query: 'Private room under 10000', category: 'Smart search' },
    { query: 'Pet-friendly room', category: 'Smart search' },
  ],
  'a': [
    { query: 'AC room Banani', category: 'Smart search' },
    { query: 'Affordable room Mirpur', category: 'Smart search' },
  ],
};

const POPULAR: Suggestion[] = [
  { query: 'Dhanmondi', category: 'Trending' },
  { query: 'Gulshan', category: 'Trending' },
  { query: 'Room near BUET', category: 'AI pick' },
  { query: 'Shared room under ৳8000', category: 'AI pick' },
  { query: 'Mirpur furnished room', category: 'AI pick' },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}

export function AISearchSuggestions({ value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions(POPULAR);
      return;
    }
    const firstChar = value[0].toLowerCase();
    const mapped = SUGGESTION_MAP[firstChar] ?? [];
    const filtered = mapped.filter((s) => s.query.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(
      filtered.length > 0
        ? filtered
        : [{ query: value, category: 'Search for' }],
    );
  }, [value]);

  const handleSelect = (query: string) => {
    onSelect(query);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search by title, area, or city…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
        />
        {!value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Bot size={11} /> AI
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-700">
            <Bot size={14} className="text-primary-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">AI-powered suggestions</span>
          </div>
          <ul>
            {suggestions.slice(0, 6).map((s, i) => (
              <li key={`${s.query}-${i}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(s.query)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <div className="flex items-center gap-2.5">
                    <Search size={13} className="text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-200">{s.query}</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-600 dark:text-slate-400">{s.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
