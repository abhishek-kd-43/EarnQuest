import { LiveSearchProvider } from "./live-search.provider";

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
  confidence: number;
}

export interface SearchProvider {
  name: string;
  searchTools(query: string): Promise<SearchResultItem[]>;
  searchOpportunities(category: string): Promise<SearchResultItem[]>;
}

export class MockSearchProvider implements SearchProvider {
  name = "MockSearchProvider";

  async searchTools(query: string): Promise<SearchResultItem[]> {
    return [
      {
        title: "Audacity: Free Audio Editor and Recorder",
        url: "https://www.audacityteam.org/",
        snippet: "Audacity is the world's most popular free software for recording and editing audio.",
        sourceDomain: "audacityteam.org",
        confidence: 0.98,
      },
      {
        title: "Ollama: Get up and running with Llama 3 and Mistral locally",
        url: "https://ollama.com/",
        snippet: "Download and run open-source large language models locally on macOS, Linux, and Windows.",
        sourceDomain: "ollama.com",
        confidence: 0.96,
      },
      {
        title: "Canva: Free Design Tool for Presentations & Video",
        url: "https://www.canva.com/",
        snippet: "Canva makes design amazingly simple with thousands of free templates.",
        sourceDomain: "canva.com",
        confidence: 0.95,
      },
    ];
  }

  async searchOpportunities(category: string): Promise<SearchResultItem[]> {
    return [
      {
        title: "Upwork: Freelance Video Repurposing & Subtitling Jobs",
        url: "https://www.upwork.com/freelance-jobs/video-subtitles/",
        snippet: "Browse high-demand video subtitle and vertical short-form editing jobs for local businesses.",
        sourceDomain: "upwork.com",
        confidence: 0.92,
      },
    ];
  }
}

/**
 * Factory to retrieve the active SearchProvider.
 * If BRAVE_SEARCH_API_KEY is configured in environment, utilizes live Brave Search.
 * Otherwise uses LiveSearchProvider with verified open repository live feed.
 */
export function getSearchProvider(): SearchProvider {
  const braveKey = process.env.BRAVE_SEARCH_API_KEY;
  if (braveKey && braveKey.trim().length > 0) {
    return new LiveSearchProvider(braveKey.trim());
  }
  return new LiveSearchProvider();
}
