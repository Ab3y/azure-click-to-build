import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  onFilterChange: (filter: string) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [value, setValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      onFilterChange(value);
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [value, onFilterChange]);

  return (
    <div className="relative px-3 py-2">
      <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search resources..."
        className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-8 text-sm text-zinc-700 placeholder-zinc-400 outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
