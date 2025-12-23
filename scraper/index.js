import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://beyondchats.com/blogs/";
const REQUIRED_COUNT = 5;
const BACKEND_API = "http://127.0.0.1:8000/api/articles";



async function getLastPageNumber() {
  const { data } = await axios.get(BASE_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);
  let maxPage = 1;

  $(".ct-pagination .page-numbers").each((_, el) => {
    const num = parseInt($(el).text());
    if (!isNaN(num) && num > maxPage) {
      maxPage = num;
    }
  });

  return maxPage;
}

/**
 * Scrape article list from a page
 */
async function scrapePage(pageNumber) {
  const url =
    pageNumber === 1 ? BASE_URL : `${BASE_URL}page/${pageNumber}/`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);
  const articles = [];

  $("article.entry-card").each((_, el) => {
    const title = $(el).find(".entry-title a").text().trim();
    const link = $(el).find(".entry-title a").attr("href");

    if (title && link) {
      articles.push({ title, link });
    }
  });

  return articles;
}

/**
 * Scrape full content of a single article
 */
async function scrapeArticleContent(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);

  const content =
    $("article").text().trim() ||
    $(".entry-content").text().trim() ||
    $("main").text().trim();

  return content.replace(/\s+/g, " ").trim().slice(0, 8000);
}

/**
 * Save article to Laravel backend
 */
async function saveToBackend(article) {
  await axios.post(BACKEND_API, {
    title: article.title,
    content: article.content,
    source_url: article.link,
    is_updated: false,
  });
}

/**
 * MAIN FLOW – Phase 1 complete
 */
async function scrapeAndStoreOldestBlogs() {
  try {
    const collected = new Map();
    const lastPage = await getLastPageNumber();
    let page = lastPage;

    while (collected.size < REQUIRED_COUNT && page >= 1) {
      console.log(`Scraping page ${page}...`);
      const pageArticles = await scrapePage(page);
      pageArticles.reverse(); // oldest first

      for (const art of pageArticles) {
        if (!collected.has(art.link)) {
          collected.set(art.link, art);
        }
        if (collected.size >= REQUIRED_COUNT) break;
      }
      page--;
    }

    const oldestFive = Array.from(collected.values());

    for (const article of oldestFive) {
      console.log(`Fetching content: ${article.title}`);
      const content = await scrapeArticleContent(article.link);

      console.log(`Saving to DB: ${article.title}`);
      await saveToBackend({ ...article, content });
    }

    console.log(" Articles stored in database");
  } catch (error) {
    console.error(" Error:", error.message);
  }
}

// Run
scrapeAndStoreOldestBlogs();
