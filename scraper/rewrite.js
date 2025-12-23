import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio"
import { GoogleGenerativeAI } from "@google/generative-ai";


const BACKEND_API = process.env.BACKEND_API || "http://127.0.0.1:8000/api/articles";


const ai  = new GoogleGenerativeAI(process.env.GENAI_API_KEY)
const model = ai.getGenerativeModel({model: "gemini-2.5-flash-lite"})

const fetchLatestArticle = async() => {
  try {
    const res = await axios.get(BACKEND_API, {
      timeout: 10000,
    })
    if(!res.data.length) throw new Error("No articles found");
    return res.data[0];
  } catch (error) {
    throw new Error(`Failed to fetch latest article: ${error.message}`);
  }
}

const googleSearch = async (query) => {
  try {
    const url = "https://serpapi.com/search.json";
    const res = await axios.get(url, {
      params:{
        q: query,
        engine: "google",
        api_key: process.env.SERP_API_KEY,
      },
      timeout: 10000,
    })

    const result = res.data.organic_results
    .filter(r => r.link && r.title)
    .slice(0, 2)
    .map(r => ({
      title: r.title,
      url: r.link,
    }));

    if(result.length < 2){
      throw new Error("Less than 2 google results found");
    }

    return result
  } catch (error) {
    throw new Error(`Google search failed: ${error.message}`);
  }
}

const scrapeCompetitorContent = async(url) => {
  try {
    const {data} = await axios.get(url, {
      headers: {"User-Agent": "Mozilla/5.0"},
      timeout: 10000,
    })
    const $ = cheerio.load(data);

    const content =
    $("article").text().trim() ||
    $(".entry-content").text().trim() ||
    $("main").text().trim() ||
    $("body").text().trim();

    if (!content) {
      throw new Error("No content found on page");
    }

    return content.replace(/\s+/g, " ").slice(0, 6000);
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

const rewriteWithGemini = async (original, competitors) => {
  try {
    const prompt = `
You are a professional content editor.

Rewrite the ORIGINAL ARTICLE by improving structure, clarity, and formatting.
Make the writing style similar to the competitor articles.
The content must be original (no copying).
Use proper headings and subheadings.
At the end, add a "References" section citing competitor URLs.

ORIGINAL ARTICLE:
${original.content}

COMPETITOR ARTICLE 1:
${competitors[0].content}

COMPETITOR ARTICLE 2:
${competitors[1].content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const rewrittenText =
      response.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") || "";

    if (!rewrittenText) {
      throw new Error("Gemini returned empty rewritten content");
    }

    const references = `

---
### References
- ${competitors[0].url}
- ${competitors[1].url}
`;

    return rewrittenText + references;
  } catch (error) {
    throw new Error(`Gemini rewrite failed: ${error.message}`);
  }
}

const saveUpdatedArticle = async(original, updatedContent) => {
  try {
    await axios.post(BACKEND_API, {
      title: original.title + " (updated)",
      content: updatedContent,
      source_url: original.source_url,
      is_updated: true,
    }, {
      timeout: 10000,
    })

    console.log("✓ Updated article saved in DB")
  } catch (error) {
    throw new Error(`Failed to save updated article: ${error.message}`);
  }
}

(async() => {
  try {
    console.log("Starting article rewriting process...\n");

    console.log("1. Fetching latest article...");
    const latestArticle = await fetchLatestArticle()
    console.log(`   ✓ Found article: "${latestArticle.title}"\n`);

    console.log("2. Searching for competitor articles...");
    const googleResult = await googleSearch(latestArticle.title)
    console.log(`   ✓ Found ${googleResult.length} results\n`);

    console.log("3. Scraping competitor content...");
    const competitors = [];
    for (const result of googleResult){
      try {
        const content = await scrapeCompetitorContent(result.url)
        competitors.push({...result, content});
        console.log(`   ✓ Scraped: ${result.title}`);
      } catch (error) {
        console.warn(`   ⚠ Skipped: ${result.url} - ${error.message}`);
      }
    }

    if (competitors.length < 2) {
      throw new Error("Could not scrape enough competitor articles (need at least 2)");
    }
    console.log("");

    console.log("4. Rewriting with Gemini 2.0...");
    const rewrittenContent = await rewriteWithGemini(
      latestArticle,
      competitors
    );
    console.log("   ✓ Content rewritten successfully\n");

    console.log("5. Saving updated article...");
    await saveUpdatedArticle(latestArticle, rewrittenContent);
    
    console.log("\n✅ Process completed successfully!");
  } catch (error) {
    console.error("\n❌ Scraping failed:", error.message)
    process.exit(1);
  }
})();

