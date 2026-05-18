'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Calendar, ExternalLink, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getNews();
      setArticles(res.data || []);
      setSource(res.source);
    } catch (err) {
      setError(err.message || 'Could not load news at this time.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-6 border border-gold-400/30">
            <Newspaper className="h-4 w-4" />
            Stay Informed
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            Learning <span className="gradient-text">News</span>
          </h1>
          <p className="text-navy-100 text-lg max-w-3xl mx-auto">
            The latest in education, homeschooling tips, and learning trends —
            curated for parents who care.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-gold-500 animate-spin mb-4" />
              <p className="text-navy-600 text-lg">Loading the latest news...</p>
            </div>
          )}

          {/* ERROR — backend unreachable */}
          {!loading && error && (
            <div className="mx-auto max-w-2xl rounded-2xl border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-white p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient">
                <AlertCircle className="h-8 w-8 text-navy-900" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                News will be here soon
              </h2>
              <p className="text-navy-600 mb-2">
                We're currently having trouble fetching the latest education news
                from our servers.
              </p>
              <p className="text-navy-500 text-sm mb-6">
                Don't worry — our team is on it. The news section will be back
                shortly. Please check again in a few minutes.
              </p>
              <button onClick={loadNews} className="btn-primary text-sm">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* SUCCESS — articles loaded */}
          {!loading && !error && articles.length > 0 && (
            <>
              {source === 'fallback' && (
                <div className="mx-auto mb-10 max-w-3xl rounded-xl border border-navy-200 bg-navy-50/50 p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      Showing curated learning insights
                    </p>
                    <p className="text-xs text-navy-600 mt-0.5">
                      Live news feed will return shortly. In the meantime, enjoy
                      these handpicked articles from our team.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target={article.url !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-2xl border-2 border-navy-100 bg-white overflow-hidden hover:border-gold-300 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    {article.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="aspect-video w-full object-cover bg-navy-100"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {article.source && (
                        <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-2">
                          {article.source}
                        </p>
                      )}
                      <h3 className="font-display font-bold text-navy-900 text-lg mb-2 group-hover:text-gold-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-3">
                          {article.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between text-xs text-navy-500 pt-3 border-t border-navy-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(article.publishedAt)}
                        </span>
                        {article.url !== '#' && (
                          <span className="flex items-center gap-1 text-gold-600 font-semibold group-hover:gap-2 transition-all">
                            Read more <ExternalLink className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* NO ARTICLES */}
          {!loading && !error && articles.length === 0 && (
            <div className="mx-auto max-w-2xl rounded-2xl border-2 border-navy-100 bg-navy-50/30 p-10 text-center">
              <Newspaper className="h-12 w-12 text-navy-400 mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-navy-900 mb-2">
                No articles available right now
              </h2>
              <p className="text-navy-600">
                Please check back soon — we'll have fresh learning news for you shortly.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
