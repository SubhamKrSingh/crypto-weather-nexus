'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks/reduxHooks';
import { fetchNewsData } from '../lib/redux/slices/newsSlice';
import NewsCard from '../components/news/NewsCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Link from 'next/link';

export default function NewsIndexPage() {
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useAppSelector(state => state.news);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    // Fetch news data if not available
    if (articles.length === 0) {
      dispatch(fetchNewsData());
    }
    
    // Refresh news data every 10 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchNewsData());
    }, 10 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [dispatch, articles.length]);
  
  // Get categories from articles
  const getCategories = () => {
    const categories = new Set<string>();
    articles.forEach(article => {
      const tag = getTagName(article.title);
      categories.add(tag);
    });
    return Array.from(categories);
  };
  
  // Helper to get tag name from title
  const getTagName = (title: string) => {
    if (title.includes('Bitcoin')) return 'Market';
    if (title.includes('Ethereum')) return 'Technology';
    if (title.includes('Regulatory')) return 'Regulation';
    if (title.includes('Bank')) return 'Business';
    if (title.includes('NFT')) return 'NFTs';
    if (title.includes('DeFi')) return 'Funding';
    return 'News';
  };
  
  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      getTagName(article.title) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const renderContent = () => {
    if (loading && articles.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error && articles.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <ErrorMessage message={error} />
        </div>
      );
    }
    
    if (filteredArticles.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M8 6h1" />
            </svg>
            <p className="text-gray-400 text-lg">
              {articles.length === 0 
                ? "No news articles available." 
                : "No articles match your criteria."}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
            {selectedCategory === 'all' ? 'Latest News' : `${selectedCategory} News`}
            <span className="ml-2 text-sm text-gray-400">({filteredArticles.length} articles)</span>
          </h2>
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
            {filteredArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        </section>
      </div>
    );
  };
  
  const categories = getCategories();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/" 
              className="mr-4 p-2 rounded-full bg-purple-900/30 text-purple-400 hover:bg-purple-800/40 hover:text-purple-300 transition-all"
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight">Crypto News</h1>
          </div>
          <p className="text-gray-400 ml-11">Latest cryptocurrency and financial market news.</p>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 px-4 py-3 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600/40 text-purple-100'
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200'
              }`}
            >
              All
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600/40 text-purple-100'
                    : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
} 