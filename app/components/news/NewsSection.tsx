'use client';

import { useAppSelector } from '../../lib/hooks/reduxHooks';
import NewsCard from './NewsCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function NewsSection({ className }: { className?: string }) {
  const { articles, loading, error } = useAppSelector(state => state.news);
  
  const renderContent = () => {
    if (loading && articles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error && articles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage message={error} />
        </div>
      );
    }
    
    if (articles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-center py-6">No news articles available.</p>
        </div>
      );
    }
    
    return (
      <div className="flex-1 flex flex-col">
        <div className="space-y-0 flex-1 overflow-hidden">
          {articles.slice(0, 5).map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
        
        <div className="px-4 pb-4 pt-2 mt-auto">
          <Link 
            href="/news" 
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center py-2"
          >
            View all news →
          </Link>
        </div>
      </div>
    );
  };
  
  return (
    <section className={cn("", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
          Latest News
        </h2>
        <Link
          href="/news"
          className="text-xs text-teal-400 hover:text-teal-300 flex items-center transition-colors"
        >
          View all
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-800/50 animate-pulse rounded-sm">
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-sm">
          <p className="text-red-400 text-sm">Failed to load news data</p>
        </div>
      ) : (
        <div className="space-y-px">
          {articles.slice(0, 5).map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
      )}
    </section>
  );
} 