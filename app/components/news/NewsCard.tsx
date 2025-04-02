'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '../../lib/types/news';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Link 
      href={article.url || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 last:border-0"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-200 hover:text-teal-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{article.source?.name || 'Unknown Source'}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}