export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  // Additional fields that might be present
  author?: string;
  content?: string;
  urlToImage?: string;
} 