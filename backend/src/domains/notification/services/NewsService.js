const axios = require('axios');
const logger = require('../../../shared/logger');

/**
 * Fetches educational news.
 * Primary source: NewsAPI.org (requires NEWS_API_KEY)
 * Fallback: returns curated mock/static articles so the frontend always has something.
 */
class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.apiUrl = process.env.NEWS_API_URL || 'https://newsapi.org/v2/everything';
    this.cache = { data: null, fetchedAt: null };
    this.cacheTtlMs = 60 * 60 * 1000; // 1 hour
  }

  async getEducationNews() {
    // Return cached results if fresh
    if (
      this.cache.data &&
      this.cache.fetchedAt &&
      Date.now() - this.cache.fetchedAt < this.cacheTtlMs
    ) {
      return { source: 'cache', articles: this.cache.data };
    }

    if (!this.apiKey || this.apiKey === 'your_news_api_key_here') {
      logger.warn('NEWS_API_KEY not configured — returning fallback articles');
      return { source: 'fallback', articles: this._fallbackArticles() };
    }

    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: '(homeschooling OR "online tutoring" OR "kids learning" OR "education trends" OR CBC OR IGCSE)',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 12,
          apiKey: this.apiKey,
        },
        timeout: 8000,
      });

      const articles = (response.data.articles || [])
        .filter((a) => a.title && a.url && !a.title.includes('[Removed]'))
        .map((a) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          imageUrl: a.urlToImage,
          source: a.source?.name,
          publishedAt: a.publishedAt,
        }));

      this.cache = { data: articles, fetchedAt: Date.now() };
      return { source: 'newsapi', articles };
    } catch (err) {
      logger.error('NewsAPI fetch failed:', err.message);
      return { source: 'fallback', articles: this._fallbackArticles() };
    }
  }

  _fallbackArticles() {
    return [
      {
        title: '5 Proven Ways to Build Confidence in Young Learners',
        description:
          'Confidence is the foundation of academic success. Discover practical strategies parents can use at home to nurture self-belief in their children.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'CBC vs IGCSE: Which Curriculum Suits Your Child?',
        description:
          'A side-by-side comparison of Kenya\'s CBC and the international IGCSE — strengths, focus areas, and how to choose wisely.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: 'The Rise of Homeschooling in Kenya: What Parents Need to Know',
        description:
          'Homeschooling is no longer a fringe choice. Here\'s how Kenyan families are designing personalized education paths that work.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        title: 'Why One-on-One Tutoring Outperforms Classroom Learning',
        description:
          'Personalized attention can transform struggling students into confident achievers. The science behind it is clearer than ever.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        title: 'Supporting Special Needs Learners: A Parent\'s Toolkit',
        description:
          'Every child learns differently. Practical, compassionate strategies for parents of children with learning differences.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        title: 'Effective Homework Routines That Actually Work',
        description:
          'Turn homework battles into productive sessions. A practical guide to building habits that stick.',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800',
        source: 'JIV Learning Insights',
        publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];
  }
}

module.exports = new NewsService();
