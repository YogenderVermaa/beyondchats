import { useEffect, useState } from "react";
import { fetchArticles } from "./api";
import ArticleCard from "./components/ArticlesCard";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles()
      .then((res) => {
        setArticles(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch articles");
        console.error("Error fetching articles:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📰</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Beyond<span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Chats</span>
            </h1>
          </div>
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Articles
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Insights
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Article Hub
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover AI-enhanced articles with improved content structure and competitive insights
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="mb-8">
              {/* Animated loading spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full opacity-20 blur-lg animate-pulse" />
                <div className="absolute inset-2 bg-white rounded-full border-4 border-slate-200" />
                <div className="absolute inset-2 border-4 border-transparent border-t-blue-600 border-r-cyan-600 rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-slate-600 font-medium">Loading articles...</p>
            <p className="text-slate-400 text-sm mt-2">This may take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0h2a2 2 0 012 2v.5a2 2 0 01-2 2h-2m0 0V9a2 2 0 00-2-2h-.5a2 2 0 00-2 2v2m0 0H5a2 2 0 01-2-2V7a2 2 0 012-2h.5A2 2 0 017 7v2m0 0v2m0-6V7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Failed to Load Articles
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-8 inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Articles Yet
            </h3>
            <p className="text-slate-600 max-w-sm mx-auto mb-6">
              Articles will appear here once you start creating and enhancing them with our AI-powered system
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Article
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Articles</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{articles.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Updated</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {articles.filter((a) => a.is_updated).length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Status</p>
                <p className="text-lg font-bold text-green-600 mt-2">Active</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Last Sync</p>
                <p className="text-sm font-bold text-slate-900 mt-2">Just now</p>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {articles.map((article, index) => (
                <div
                  key={article.id || index}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <p className="text-slate-600 text-sm text-center sm:text-left">
              Articles enhanced with AI-powered content rewriting and competitive analysis
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Docs
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;