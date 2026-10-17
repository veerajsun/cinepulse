import React from "react";
import { notFound } from "next/navigation";
import { getNewsBySlug, getRelatedNews, getTrendingNews } from "@/lib/api";
import { ArticleHero } from "@/components/ArticleHero";
import { RelatedArticles } from "@/components/RelatedArticles";
import { Sidebar } from "@/components/Sidebar";
import { Tag, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getNewsBySlug(params.slug);
  if (!article) return { title: "Dispatch Not Found — CinePulse" };

  return {
    title: `${article.title} — CinePulse`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, trendingArticles] = await Promise.all([
    getRelatedNews(article.slug, article.category, 3),
    getTrendingNews(5),
  ]);

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-metadata text-metadata text-tertiary">
          <Link href="/" className="hover:text-on-surface">Home</Link>
          <span>/</span>
          <Link href={`/${article.category}`} className="capitalize hover:text-on-surface">{article.category}</Link>
          <span>/</span>
          <span className="text-on-surface-variant truncate max-w-xs sm:max-w-md">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Main Article Reader Body (8 cols) */}
          <article className="lg:col-span-8 flex flex-col gap-space-xl bg-surface-container-lowest/30 p-space-md sm:p-space-lg rounded-xl border border-surface-container-highest/30 shadow-lg">
            <ArticleHero article={article} />

            {/* Article Main Prose Body */}
            <div
              className="prose prose-invert max-w-none font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-6 pt-space-md"
              dangerouslySetInnerHTML={{ __html: article.content || "<p>Full dispatch content coming from syndicated wire feeds...</p>" }}
            />

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-space-md border-t border-surface-container-highest/40 flex flex-wrap items-center gap-space-xs">
                <div className="flex items-center gap-1.5 text-tertiary font-metadata text-metadata mr-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Dispatch Index:</span>
                </div>
                {article.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-space-md py-1 rounded-full bg-surface-container-low border border-surface-container-highest/50 font-metadata text-metadata text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Bottom Read Original Source Action */}
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/60 flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-md">
              <div className="flex flex-col gap-1">
                <h4 className="font-playfair text-headline-sm text-on-surface">Original Syndicate Source</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Published by <strong>{article.sourceName}</strong> on {new Date(article.publishedAt).toLocaleDateString()}.
                </p>
              </div>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-container/90 transition-all flex items-center gap-2 shadow-md shrink-0"
              >
                <span>Visit {article.sourceName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </article>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <Sidebar trendingArticles={trendingArticles} />
          </div>
        </div>

        {/* Related Articles Row */}
        <RelatedArticles articles={relatedArticles} />
      </div>
    </div>
  );
}
