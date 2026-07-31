import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SEARCH_SUGGESTIONS = [
  "Python Programming...",
  "Full Stack Web Dev...",
  "AI & Machine Learning...",
  "Data Science & Analytics...",
  "Digital Marketing...",
  "DCA & Computer Course...",
  "Cyber Security...",
  "MERN Stack Cohort..."
];

export function AnimatedSearchInput({ searchQuery, setSearchQuery, onSearchSubmit, className = "" }) {
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullPhrase = SEARCH_SUGGESTIONS[phraseIndex];
    
    let timer;
    if (!isDeleting) {
      if (placeholderText.length < currentFullPhrase.length) {
        timer = setTimeout(() => {
          setPlaceholderText(currentFullPhrase.substring(0, placeholderText.length + 1));
        }, 80);
      } else {
        // Pause at the end of word before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (placeholderText.length > 0) {
        timer = setTimeout(() => {
          setPlaceholderText(currentFullPhrase.substring(0, placeholderText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, phraseIndex]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 text-sky-600 pointer-events-none transition-colors" />
      <input
        type="text"
        placeholder={`Search "${placeholderText}"`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-9 py-2.5 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs transition-all outline-none font-medium"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
