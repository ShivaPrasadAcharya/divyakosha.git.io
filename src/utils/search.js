export const calculateRelevanceScore = (entry, searchTerms, isDoubleBar) => {
  let score = 0;
  const { term, content, sharedTerms } = entry;

  for (const searchTerm of searchTerms) {
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');

    // Title match
    if (term.toLowerCase().includes(searchTerm.toLowerCase())) {
      score += 10;
    }

    // Content match
    const contentMatches = (content.match(regex) || []).length;
    score += contentMatches * 3;

    // Shared terms match
    if (sharedTerms?.some(shared => 
      shared.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      score += 4;
    }
  }

  // Same-line bonus for double bar searches
  if (isDoubleBar && searchTerms.length > 1) {
    const lines = content.split('\n');
    for (const line of lines) {
      const matchCount = searchTerms.filter(term => 
        line.toLowerCase().includes(term.toLowerCase())
      ).length;
      if (matchCount === searchTerms.length) {
        score += 15;
      }
    }
  }

  return score;
};

export const highlightSearchTerms = (text, searchTerms) => {
  if (!searchTerms?.length) return text;

  const colors = [
    'bg-yellow-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-purple-200',
    'bg-pink-200'
  ];

  let highlightedText = text;
  searchTerms.forEach((term, index) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    const color = colors[index % colors.length];
    highlightedText = highlightedText.replace(
      regex,
      `<span class="${color} cursor-pointer hover:opacity-80">$1</span>`
    );
  });

  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};
