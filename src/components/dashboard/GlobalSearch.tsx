"use client";

import axios from "axios";
import {
  ArrowRight,
  BookOpen,
  Command,
  FileText,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  type: "course" | "user" | "assignment" | "department";
  title: string;
  subtitle?: string;
  url: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/search?q=${query}`);
          setResults(res.data.results);
        } catch (_err) {
          console.error("Search failed");
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border rounded-xl cursor-text hover:bg-muted transition-all group"
      >
        <Search
          size={18}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
        <span className="text-sm text-muted-foreground grow">
          Search anything...
        </span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-black text-muted-foreground">
          <Command size={10} /> K
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search size={22} className="text-primary" />
              <input
                placeholder="Search resources, users, or settings..."
                className="bg-transparent border-none outline-none text-lg grow font-bold"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <Loader2
                  size={18}
                  className="animate-spin text-muted-foreground"
                />
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-2">
              {results.length > 0 ? (
                results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelect(res.url)}
                    className="flex items-center gap-4 p-3 hover:bg-muted rounded-2xl transition-all group text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {res.type === "user" && <User size={20} />}
                      {res.type === "course" && <BookOpen size={20} />}
                      {res.type === "assignment" && <FileText size={20} />}
                    </div>
                    <div className="grow">
                      <p className="font-bold text-sm">{res.title}</p>
                      {res.subtitle && (
                        <p className="text-[11px] text-muted-foreground">
                          {res.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                    />
                  </button>
                ))
              ) : query.length > 2 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold opacity-50">
                    No results found for "{query}"
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-30 italic">
                    Start typing to search...
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-muted/50 border-t border-border flex justify-between items-center px-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase">
                Pro Tip: Use ↑↓ and Enter
              </p>
              <div className="flex gap-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1">
                  ESC <ArrowRight size={8} /> Close
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
