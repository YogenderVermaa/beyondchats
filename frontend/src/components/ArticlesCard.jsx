export default function ArticleCard({ article }) {
  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200 hover:border-slate-300">
      {/* Subtle top accent bar */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500" />

      <div className="p-6 sm:p-8">
        {/* Header with title and badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-300 flex-1">
            {article.title}
          </h2>

          {/* Updated Badge */}
          {article.is_updated && (
            <div className="flex-shrink-0 animate-pulse">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 2v5h.01V4H4v5h12V4z" />
                </svg>
                Updated
              </span>
            </div>
          )}
        </div>

        {/* Content preview with elegant truncation */}
        <p className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
          {article.content.slice(0, 300)}
          {article.content.length > 300 && (
            <span className="text-slate-400">…</span>
          )}
        </p>

        {/* Source link with icon */}
        <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Source:</span>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
          >
            Original Article
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}