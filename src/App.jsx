import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { calculateRelevanceScore, highlightSearchTerms } from './utils/search';
import { formatDate } from './utils/date';
import entries from './data/entries.json';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    
    const terms = searchQuery.split(/\|\||\|/).map(term => term.trim());
    const isDoubleBar = searchQuery.includes('||');
    
    return entries
      .map(entry => ({
        ...entry,
        score: calculateRelevanceScore(entry, terms, isDoubleBar)
      }))
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">DivyaKosha</h1>
        
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search terms (use | for multiple terms, || for same-line matches)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="space-y-4">
          {searchResults.map(entry => (
            <Card key={entry.id} id={entry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {searchQuery ? 
                    highlightSearchTerms(entry.term, searchQuery.split(/\|\||\|/)) :
                    entry.term
                  }
                </h2>
                <div className="text-sm text-gray-500">
                  Compiled: {formatDate(entry.compiledDate)} | 
                  Last Modified: {formatDate(entry.modifiedDate)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose">
                  {searchQuery ? 
                    highlightSearchTerms(entry.content, searchQuery.split(/\|\||\|/)) :
                    entry.content
                  }
                </div>
                {entry.sharedTerms?.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    Related terms: {entry.sharedTerms.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
