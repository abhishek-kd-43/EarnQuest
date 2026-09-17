import { db } from "@/lib/db";

export interface TaskFilterOptions {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  sourcePlatform?: string;
  maxMinutes?: number;
  minPayCents?: number;
  maxPayCents?: number;
  search?: string;
}

// 15 Realistic Client Archetypes
const TASK_ARCHETYPES = [
  {
    category: "AUDIO",
    titleTemplate: "Transcribe and create timestamped show notes for a [INDUSTRY] podcast episode",
    deliverable: "Clean Markdown show notes with speaker labels, timestamps every 5 mins, 5 key takeaways, and 3 tweetable quotes.",
    estimatedMinutes: 25,
    budgetRange: [3000, 6500],
    difficulty: "ZERO_SKILL",
    toolName: "GroqCloud Whisper + Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://console.groq.com",
    promptTemplate: `You are an expert podcast producer. I will provide a podcast transcript or audio summary for a [INDUSTRY] business.
Your goal is to output:
1. An engaging 2-paragraph episode summary
2. Detailed timestamped outline (key topic transitions)
3. 5 actionable bullet-point takeaways
4. 3 tweetable quotes with relevant hashtags

Here is the context: [PASTE_RAW_AUDIO_TRANSCRIPT_OR_TOPIC_HERE]`,
    guide: `1. Open GroqCloud (console.groq.com) and upload the client's audio file to the free Whisper endpoint for instant transcription.
2. Open Google AI Studio (aistudio.google.com) and paste the transcript with the prompt template above.
3. Review the generated show notes for formatting, ensure timestamps align with key topics.
4. Export as a clean PDF or Google Docs link and deliver to the client.`,
    proposal: `Hi there! I can format your [INDUSTRY] podcast episode into professional, publication-ready show notes complete with accurate timestamps, executive takeaways, and social quotes. I have quick turnaround time (under 2 hours) and ensure 100% clean formatting. Ready to start immediately!`
  },
  {
    category: "MARKETING",
    titleTemplate: "Complete an actionable local SEO and Google Maps optimization audit for a [INDUSTRY] business",
    deliverable: "10-point audit checklist covering NAP consistency, local keyword gaps, review response strategy, and Google Business Profile optimization.",
    estimatedMinutes: 35,
    budgetRange: [4500, 9500],
    difficulty: "BEGINNER",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a senior Local SEO specialist. Perform a comprehensive audit for a local [INDUSTRY] business located in [CITY/STATE].
Analyze:
1. Google Business Profile category & service selection recommendations
2. High-intent local search keywords to target in title & bio
3. Top 5 competitor differentiators in the area
4. Customer review response scripts (positive and negative)
5. 3 high-impact local citation sources to register

Deliver as a formatted client audit report with executive summary.`,
    guide: `1. Look up the client's local business name and category on Google Maps.
2. Note their current review count, categories, and business description.
3. Paste the details into Gemini 1.5 Flash using the audit prompt template.
4. Format the result into a clean Notion doc or Google Doc with checklist checkmarks.
5. Send the actionable report to the client.`,
    proposal: `Hello! I specialize in local SEO audits for [INDUSTRY] businesses. I will inspect your Google Business profile and competitors to deliver a clear 10-point checklist showing exactly how to rank higher on Google Maps and drive more inbound phone calls. I can deliver this report within 3 hours.`
  },
  {
    category: "WRITING",
    titleTemplate: "Write 5 high-converting SEO product descriptions for a [INDUSTRY] online store",
    deliverable: "5 unique product descriptions (150-200 words each) including sensory hooks, bullet benefits, and meta descriptions.",
    estimatedMinutes: 20,
    budgetRange: [2500, 5500],
    difficulty: "ZERO_SKILL",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `Act as a senior direct-response copywriter for high-growth e-commerce brands in the [INDUSTRY] space.
Write 5 distinct product descriptions for the following products: [PRODUCT_LIST_OR_SPECS].
For each product, include:
- A punchy 1-line hook
- Engaging sensory description (100 words)
- 4 bullet points highlighting user benefits (not just features)
- 1 SEO meta title (under 60 chars) and meta description (under 155 chars) with target keywords.`,
    guide: `1. Get the list of products or feature bullet points from the client brief.
2. Paste into Gemini 1.5 Flash or Claude Free using the e-commerce copy prompt.
3. Check that each description sounds natural, persuasive, and avoids fluff.
4. Paste into Google Sheets or Docs with columns for Title, Description, Bullets, and Meta Tag.`,
    proposal: `Hi! Boring product copy kills e-commerce conversions. I can write 5 punchy, benefit-driven product descriptions for your [INDUSTRY] store that capture attention and rank on Google. Delivered formatted and ready to paste into Shopify or WooCommerce today!`
  },
  {
    category: "MARKETING",
    titleTemplate: "Draft a 3-part cold email outreach sequence for a B2B [INDUSTRY] service",
    deliverable: "3 customized email templates (Icebreaker, Value Proposition, Soft Follow-up) with subject line variations.",
    estimatedMinutes: 30,
    budgetRange: [4000, 8500],
    difficulty: "BEGINNER",
    toolName: "Claude / ChatGPT Free / Gemini Flash",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are an elite B2B cold email strategist who writes emails that get 40%+ open rates and 12%+ reply rates.
Draft a 3-step cold email sequence targeting decision-makers at [TARGET_AUDIENCE] on behalf of a [INDUSTRY] company.
Requirements:
- Email 1: The Observation & Pain Point (Under 90 words, no generic compliments, specific low-friction CTA).
- Email 2: Social Proof & Quick Case Study (Under 75 words).
- Email 3: The Permission Follow-up / Break-up (Under 50 words).
- Provide 3 subject line options for each email (short, lowercase, intrigue-driven).`,
    guide: `1. Identify the client's core offering and target prospect title.
2. Run the prompt in Gemini 1.5 Flash.
3. Ensure emails are concise, conversational, and avoid spam trigger words.
4. Send to client in an organized Google Doc.`,
    proposal: `Hi! Most cold emails get deleted because they are too long and self-centered. I will craft a punchy, 3-step outreach sequence tailored to your [INDUSTRY] offering that feels 1-on-1 and drives genuine replies. Ready to write this for you right away.`
  },
  {
    category: "VIRTUAL_ASSISTANT",
    titleTemplate: "Build a customer support FAQ knowledge base and macro responses for a [INDUSTRY] company",
    deliverable: "20 categorized FAQ answers and 10 canned response templates for common customer support inquiries.",
    estimatedMinutes: 40,
    budgetRange: [3500, 7500],
    difficulty: "ZERO_SKILL",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a Customer Experience Director. Build a complete customer support knowledge base for a [INDUSTRY] brand.
Output:
1. 20 common customer inquiries grouped into 4 categories (Ordering/Billing, Service Delivery, Troubleshooting, Returns/Refunds) with warm, professional answers.
2. 10 rapid-response macros (canned emails/chat replies) for support tickets, including placeholders for customer names and order IDs.`,
    guide: `1. Review the client's website or product page to understand their common questions.
2. Run the prompt with Gemini Flash to generate comprehensive answers.
3. Organize into a searchable markdown file or Google Doc.
4. Deliver ready for import into Zendesk, Gorgias, or HelpScout.`,
    proposal: `Hello! I can build a clean, comprehensive 20-question FAQ database and 10 ready-to-use canned support macros for your [INDUSTRY] business. This will save your team dozens of hours every week and give customers instant, polite answers. Can deliver within 4 hours.`
  },
  {
    category: "MARKETING",
    titleTemplate: "Generate a 30-day social media content calendar with hooks for a [INDUSTRY] brand",
    deliverable: "Spreadsheet with 30 post concepts, scroll-stopping hooks, caption bodies, call-to-actions, and image concept notes.",
    estimatedMinutes: 45,
    budgetRange: [5000, 11000],
    difficulty: "BEGINNER",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a viral social media strategist specializing in [INDUSTRY].
Create a comprehensive 30-day content calendar designed for LinkedIn and Instagram.
For each day include:
- Day & Post Pillar (Educational, Authority, Story/Case Study, Engagement, Promotional)
- The Hook (First 2 lines to stop the scroll)
- Core Caption Outline / Script (100 words)
- Specific Call-to-Action (CTA)
- Visual Asset Recommendation (Photo, Carousel idea, or Screen Recording)
Format as a clean table.`,
    guide: `1. Run the prompt in Gemini 1.5 Flash with the client's specific niche.
2. Paste the output into Google Sheets with formatted columns.
3. Add 5 bonus viral hook variations for the client.
4. Share the view link with the client.`,
    proposal: `Hi! Consistency is the hardest part of social media growth. I will build you a complete 30-day content calendar for your [INDUSTRY] brand, including high-converting hooks, captions, and visual ideas. Turnkey ready to post. Let's get your audience growing!`
  },
  {
    category: "DATA",
    titleTemplate: "Clean, deduplicate, and format a raw 500-row lead list for a [INDUSTRY] sales team",
    deliverable: "Standardized CSV file with validated email formats, capitalized proper names, separated first/last names, and missing field flags.",
    estimatedMinutes: 25,
    budgetRange: [3000, 7000],
    difficulty: "ZERO_SKILL",
    toolName: "Google Sheets + Gemini Flash Data Assistant",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `I will provide messy tabular lead data for [INDUSTRY] contacts.
Please perform data hygiene:
1. Split full names into clean 'First Name' and 'Last Name' with proper title casing.
2. Normalize website URLs (strip trailing slashes, remove http/https prefixes for consistency).
3. Validate email formatting (flag invalid structures).
4. Standardize phone numbers into (XXX) XXX-XXXX format.
5. Return the clean data in CSV format.`,
    guide: `1. Import the client's messy CSV into Google Sheets.
2. Use Google Sheets formulas (SPLIT, PROPER, TRIM) or copy chunks into Gemini Flash for automatic cleaning.
3. Spot-check 20 rows to verify 100% accuracy.
4. Download as clean CSV and deliver.`,
    proposal: `Hello! I can clean, deduplicate, and standardize your [INDUSTRY] lead list into a pristine CSV ready for CRM import. I will separate names, fix formatting, and flag any incomplete entries within 1 hour.`
  },
  {
    category: "WRITING",
    titleTemplate: "Optimize a professional resume and LinkedIn summary for an executive in [INDUSTRY]",
    deliverable: "ATS-optimized resume bullet points using the Google XYZ formula ('Accomplished [X] as measured by [Y], by doing [Z]') and a 3-paragraph LinkedIn About section.",
    estimatedMinutes: 30,
    budgetRange: [4000, 9000],
    difficulty: "BEGINNER",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are an executive resume writer and career coach specializing in [INDUSTRY].
Rewrite the provided resume experience section:
1. Convert passive job duty descriptions into high-impact bullet points using the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.
2. Naturally integrate top ATS keywords for senior roles in [INDUSTRY].
3. Craft an engaging first-person LinkedIn 'About' summary that highlights leadership and career trajectory.
Context: [PASTE_RESUME_INFO]`,
    guide: `1. Paste the candidate's existing background into Gemini Flash.
2. Review the generated bullet points to ensure metrics and quantifiable impact are highlighted.
3. Format into a clean, modern doc without fancy tables that break ATS scanners.
4. Deliver with personalized LinkedIn summary.`,
    proposal: `Hi! In today's competitive job market, your resume needs to pass automated ATS filters and immediately impress hiring managers. I will rewrite your [INDUSTRY] resume bullet points using the proven Google XYZ achievement formula and write a standout LinkedIn summary. Ready to deliver within 3 hours!`
  },
  {
    category: "WRITING",
    titleTemplate: "Research and write a 1,500-word comprehensive SEO blog post on [INDUSTRY] trends",
    deliverable: "Complete Markdown article with H1, H2, H3 hierarchy, FAQ schema section, meta title, meta description, and internal linking suggestions.",
    estimatedMinutes: 40,
    budgetRange: [5000, 12000],
    difficulty: "BEGINNER",
    toolName: "Google AI Studio (Gemini 1.5 Flash) + OpenRouter Free",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are an expert tech and industry journalist specializing in [INDUSTRY].
Write a definitive, 1,500-word guide on the topic: [TOPIC_OR_TREND].
Structure:
- Compelling introduction citing recent industry data
- 4 comprehensive H2 sections with concrete examples and subheadings
- Actionable step-by-step checklist for readers
- 5-question FAQ section answering high-search-volume queries
- SEO title (under 60 chars) and meta description (under 155 chars)
Tone: Informative, authoritative, engaging, zero fluff.`,
    guide: `1. Clarify target keyword with the client brief.
2. Run the prompt in Gemini 1.5 Flash.
3. Review for readability, format subheadings with proper H2/H3 tags.
4. Add relevant external source citations.
5. Deliver in clean Google Docs or Markdown.`,
    proposal: `Hello! I will write an authoritative, in-depth 1,500-word article on [INDUSTRY] that ranks on Google and provides real value to your readers. Proper heading hierarchy, meta tags, and FAQ schema included. Quick turnaround guaranteed.`
  },
  {
    category: "AUDIO",
    titleTemplate: "Write 3 viral 60-second short-form video scripts (TikTok/Reels/Shorts) for a [INDUSTRY] business",
    deliverable: "3 structured video scripts with 3-second visual hooks, on-screen text directions, narration voiceover, and call to action.",
    estimatedMinutes: 20,
    budgetRange: [2500, 6000],
    difficulty: "ZERO_SKILL",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a viral TikTok and Instagram Reels scriptwriter for [INDUSTRY] brands.
Write 3 separate 60-second video scripts on [TOPIC_OR_PRODUCT].
Format each script with two columns:
- Column 1: Visual / On-Screen Action & B-roll direction (e.g. text overlays, camera angle, zoom)
- Column 2: Spoken Voiceover Audio (conversational, energetic, under 140 words total for a 60s read)
Include a 3-second psychological hook at the start of every script.`,
    guide: `1. Review client's target audience and product/service.
2. Generate 3 high-energy script concepts with Gemini Flash.
3. Ensure the spoken word count is under 140 words per script so it fits comfortably in 60 seconds.
4. Send to client in a formatted two-column table.`,
    proposal: `Hi! Short-form video requires a hook in the first 3 seconds or viewers swipe away. I will write 3 high-converting, 60-second scripts for your [INDUSTRY] brand with exact on-screen visual notes and voiceover text. Ready to deliver today!`
  },
  {
    category: "WRITING",
    titleTemplate: "Translate and localize website landing page copy into Spanish/French/German for [INDUSTRY]",
    deliverable: "Culturally accurate translation of landing page copy, maintaining brand tone, localized idioms, and translated UI button labels.",
    estimatedMinutes: 30,
    budgetRange: [3500, 8000],
    difficulty: "ZERO_SKILL",
    toolName: "DeepSeek / Gemini 1.5 Flash",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a professional bilingual localization expert and copywriter specializing in [TARGET_LANGUAGE] and the [INDUSTRY] domain.
Translate the following English landing page copy into natural, culturally resonant [TARGET_LANGUAGE]:
[PASTE_ENGLISH_COPY]
Guidelines:
- Do not translate word-for-word if an English idiom doesn't make sense; adapt it to the local cultural equivalent.
- Ensure CTAs remain punchy and action-oriented.
- Highlight any currency, date, or unit of measurement localizations needed.`,
    guide: `1. Paste client's English copy into Gemini 1.5 Flash with the localization prompt.
2. Compare side-by-side with original text to ensure no sections were missed.
3. Verify button labels and navigation links are concise.
4. Deliver side-by-side in Google Sheets.`,
    proposal: `Hello! Direct machine translation sounds robotic to international customers. I will provide a fluent, culturally localized translation of your [INDUSTRY] landing page that maintains your brand voice and drives conversions. Can deliver within 2 hours.`
  },
  {
    category: "CODING",
    titleTemplate: "Write and document a lightweight Python web scraper for [INDUSTRY] public data",
    deliverable: "Working Python script using requests and BeautifulSoup or Playwright, with README instructions and CSV export feature.",
    estimatedMinutes: 45,
    budgetRange: [6000, 15000],
    difficulty: "BEGINNER",
    toolName: "Project IDX / Trae Free AI IDE / VS Code Free",
    toolUrl: "https://idx.google.com",
    promptTemplate: `You are a Python automation engineer. Write a clean, well-commented Python script using requests and BeautifulSoup to extract public catalog data from [TARGET_WEBSITE_TYPE] in the [INDUSTRY] niche.
Requirements:
1. Include realistic User-Agent headers and rate limiting (sleep between requests).
2. Extract fields: Name, Price/Rating, Location, URL.
3. Automatically export extracted records into a clean UTF-8 CSV file.
4. Add try/except error handling and informative console print statements.
5. Provide a short README explaining how to run with 'pip install requests beautifulsoup4'.`,
    guide: `1. Open Google Project IDX (idx.google.com) or Trae IDE.
2. Use the built-in AI code assistant with the prompt above.
3. Run the script in the integrated terminal to verify it produces clean CSV output.
4. Package the .py file and README and deliver to client.`,
    proposal: `Hi! I can deliver a clean, well-documented Python scraper for your [INDUSTRY] project that runs error-free, handles pagination, and saves directly to CSV. Includes clear step-by-step setup instructions. Ready to build this now!`
  },
  {
    category: "DESIGN",
    titleTemplate: "Design 5 modern promotional social media banners for a [INDUSTRY] product launch",
    deliverable: "5 cohesive banner templates (1080x1080 for Instagram and 1200x628 for LinkedIn/Facebook) with modern typography and color palettes.",
    estimatedMinutes: 30,
    budgetRange: [3500, 7500],
    difficulty: "ZERO_SKILL",
    toolName: "Canva Free + Gemini Flash (Copy & Layout Prompts)",
    toolUrl: "https://www.canva.com",
    promptTemplate: `Act as a senior Art Director. I need a cohesive visual identity concept for 5 promotional banners for a [INDUSTRY] brand.
For each banner, provide:
1. Primary bold headline (under 5 words)
2. Sub-headline and CTA button text
3. Hex color palette suggestion (Background, Text, Accent)
4. Layout composition (Where image goes, where text aligns)
5. Search keywords to find the perfect free aesthetic background photo on Unsplash or Canva.`,
    guide: `1. Generate banner copy and composition concepts with Gemini Flash.
2. Open Canva Free (canva.com) and pick a sleek modern template matching the layout.
3. Apply the generated copy, adjust typography, and insert free high-res photos.
4. Export high-res PNG files and share the editable Canva template link with the client.`,
    proposal: `Hello! Eye-catching banners are critical for a successful launch. I will design 5 high-converting, modern banners tailored for your [INDUSTRY] brand using free professional design tools. You will receive high-res files plus the editable template link today.`
  },
  {
    category: "VIRTUAL_ASSISTANT",
    titleTemplate: "Format and summarize a 15-page PDF report into a clean executive slide outline for [INDUSTRY]",
    deliverable: "10-slide presentation outline with slide titles, 3 key bullet takeaways per slide, and suggested chart or visual metaphor.",
    estimatedMinutes: 30,
    budgetRange: [3500, 8000],
    difficulty: "ZERO_SKILL",
    toolName: "Google AI Studio (Gemini 1.5 Flash Multimodal)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a management consultant. I will provide text or document excerpts from a [INDUSTRY] report.
Convert this information into a high-impact, 10-slide executive presentation outline:
For each slide provide:
- Slide Number & Action Title (an informative sentence, e.g., 'Q3 Revenue Grew 24% Driven by Expansion')
- 3 concise bullet points with key data highlights
- Recommended visual (e.g. bar chart, 3-column comparison, flow diagram)
- Speaker note summary (what the presenter should say in 30 seconds).`,
    guide: `1. Upload the client's report or paste the text directly into Gemini 1.5 Flash.
2. Run the executive slide deck outline prompt.
3. Review slide flow to ensure a coherent narrative.
4. Paste into Google Slides or Docs and share with the client.`,
    proposal: `Hi! Executives don't have time to read long PDFs. I can distill your 15-page [INDUSTRY] document into a crisp, 10-slide executive presentation outline ready for Google Slides or PowerPoint. Delivered within 3 hours.`
  },
  {
    category: "DATA",
    titleTemplate: "Extract 50 competitor pricing points and feature matrices into a clean Google Sheet for [INDUSTRY]",
    deliverable: "Structured spreadsheet comparing 10 top competitors across pricing tiers, key features, free trial availability, and target audience.",
    estimatedMinutes: 35,
    budgetRange: [4000, 8500],
    difficulty: "ZERO_SKILL",
    toolName: "Google AI Studio (Gemini 1.5 Flash)",
    toolUrl: "https://aistudio.google.com",
    promptTemplate: `You are a competitive intelligence analyst in the [INDUSTRY] market.
Extract and synthesize a structured competitive pricing matrix for the top 10 players in this space.
Columns required:
1. Company Name & Website
2. Starter Plan Price (Monthly/Annual)
3. Pro/Business Plan Price
4. Key Unique Differentiator
5. Free Tier / Trial Availability
6. Target Customer Segment
Format as a clean markdown table ready to paste into Google Sheets.`,
    guide: `1. Use Gemini Flash with web search or paste competitor website URLs.
2. Run the competitive intelligence prompt.
3. Copy the table into Google Sheets, apply bold header row and freeze panes.
4. Share the sheet link with client.`,
    proposal: `Hello! Understanding competitor pricing is essential before launching or updating your rates. I will build a comprehensive, clean spreadsheet analyzing the top 10 competitors in [INDUSTRY] with exact pricing tiers and feature breakdowns. Delivered today!`
  }
];

// Diverse real industries to combine
const INDUSTRIES = [
  "B2B SaaS & Cloud Software",
  "Dental & Orthodontics Practices",
  "Real Estate & Property Management",
  "Boutique Fitness & Personal Training",
  "Roofing & Solar Energy Installation",
  "Organic Skincare & Clean Beauty",
  "Specialty Coffee Roasters & Cafes",
  "Family Law & Estate Planning",
  "Eco-Friendly Home Cleaning Services",
  "Independent Video Game Developers",
  "Accounting & Bookkeeping Services",
  "Veterinary & Specialty Pet Care",
  "Mobile Auto Detailing & Ceramic Coating",
  "High-End Wedding Photography",
  "E-learning & Online Tutoring Academies",
  "Commercial HVAC & Plumbing Contractors",
  "Cryptocurrency & Fintech Apps",
  "Artisan Bakeries & Catering Services",
  "Sustainable Fashion & Apparel",
  "Mental Health & Teletherapy Practices",
  "Craft Breweries & Local Distilleries",
  "Logistics & Freight Brokerage",
  "Interior Design & Home Staging",
  "Digital Marketing & SEO Agencies",
  "Architecture & Sustainable Construction"
];

// Sources
const SOURCES = [
  { name: "Upwork", url: "https://www.upwork.com" },
  { name: "Remotive", url: "https://remotive.com" },
  { name: "Freelancer", url: "https://www.freelancer.com" },
  { name: "RemoteOK", url: "https://remoteok.com" },
  { name: "WeWorkRemotely", url: "https://weworkremotely.com" },
  { name: "Reddit r/forhire", url: "https://reddit.com/r/forhire" },
  { name: "Direct Client Lead", url: "https://earnquest.local/leads" }
];

export class DailyTasksService {
  /**
   * Fetches real live remote gigs from public APIs (e.g. Remotive API)
   * and maps them into actionable AI tasks.
   */
  async fetchLiveExternalGigs(limit: number = 30): Promise<Array<any>> {
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?limit=${limit}`, {
        headers: { "User-Agent": "EarnQuest-OpportunityEngine/1.0" },
        next: { revalidate: 3600 }
      });
      if (!res.ok) return [];
      const data = await res.json();
      const jobs = data.jobs || [];

      return jobs.map((job: any, index: number) => {
        const budgetCents = Math.floor(Math.random() * (12000 - 3500 + 1) + 3500); // $35 - $120
        const platformFeeCents = Math.round(budgetCents * 0.20);
        const netPayoutCents = budgetCents - platformFeeCents;

        let category = "WRITING";
        if (job.category?.toLowerCase().includes("design")) category = "DESIGN";
        else if (job.category?.toLowerCase().includes("dev") || job.category?.toLowerCase().includes("software")) category = "CODING";
        else if (job.category?.toLowerCase().includes("data")) category = "DATA";
        else if (job.category?.toLowerCase().includes("marketing")) category = "MARKETING";

        const cleanTitle = job.title.replace(/[^\w\s-]/g, "").slice(0, 90);
        const slug = `remotive-${job.id || index}-${cleanTitle.toLowerCase().replace(/\s+/g, "-")}`.slice(0, 100);

        return {
          title: `Deliverable: ${cleanTitle}`,
          slug,
          category,
          description: `Real remote client gig posted by ${job.company_name}. Complete the project brief using free AI tools and submit your proposal.`,
          deliverable: `Completed deliverable matching ${job.company_name}'s requirements, accompanied by a professional proposal.`,
          sourcePlatform: "Remotive",
          sourceUrl: job.url || "https://remotive.com",
          budgetInCents: budgetCents,
          platformFeeCents,
          netPayoutCents,
          estimatedMinutes: 30,
          difficulty: "BEGINNER",
          hardwareTier: "TIER_1_LITE",
          recommendedToolName: "Google AI Studio (Gemini 1.5 Flash)",
          recommendedToolUrl: "https://aistudio.google.com",
          aiPromptTemplate: `You are an expert ${category.toLowerCase()} specialist. I need to complete this client job brief for ${job.company_name}:
Brief: ${job.description ? job.description.replace(/<[^>]*>/g, "").slice(0, 400) : "Complete requested deliverable."}
Provide a polished, complete deliverable draft that can be presented to the client.`,
          stepByStepGuide: `1. Open the original job post at ${job.url || 'Remotive'} to review full requirements.
2. Use Google AI Studio (aistudio.google.com) to generate the requested work sample.
3. Review and tailor the draft with the company's brand voice.
4. Submit your proposal and sample to the client directly.`,
          clientProposalTemplate: `Hi ${job.company_name} team! I saw your posting for ${cleanTitle}. I have prepared a preliminary draft deliverable aligned with your specifications. I can turn around high-quality work immediately. Looking forward to discussing!`,
          status: "OPEN",
          isFeatured: index < 5,
          postedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
          expiresAt: new Date(Date.now() + 86400000 * 3), // 3 days expiry
        };
      });
    } catch (err) {
      console.warn("[DailyTasksService] Failed to fetch external jobs, falling back to procedural generator:", err);
      return [];
    }
  }

  /**
   * Generates a realistic, diverse task based on real client archetypes and industries.
   */
  generateProceduralTask(index: number, dateOffsetHours: number = 0): any {
    const archetype = TASK_ARCHETYPES[index % TASK_ARCHETYPES.length];
    const industry = INDUSTRIES[Math.floor(index / TASK_ARCHETYPES.length) % INDUSTRIES.length];
    const source = SOURCES[index % SOURCES.length];

    const title = archetype.titleTemplate.replace("[INDUSTRY]", industry);
    const minBudget = archetype.budgetRange[0];
    const maxBudget = archetype.budgetRange[1];
    // Random budget within range rounded to nearest 500 cents ($5)
    const rawBudget = Math.floor(Math.random() * (maxBudget - minBudget) + minBudget);
    const budgetInCents = Math.round(rawBudget / 500) * 500;
    
    // Strict 20% platform fee, 80% user net payout in integer cents
    const platformFeeCents = Math.round(budgetInCents * 0.20);
    const netPayoutCents = budgetInCents - platformFeeCents;

    const slug = `task-${Date.now().toString(36)}-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}`;

    const prompt = archetype.promptTemplate.replace(/\[INDUSTRY\]/g, industry);
    const proposal = archetype.proposal.replace(/\[INDUSTRY\]/g, industry);
    const guide = archetype.guide.replace(/\[INDUSTRY\]/g, industry);

    const postedAt = new Date(Date.now() - (dateOffsetHours * 3600000) - ((index % 60) * 60000));
    const expiresAt = new Date(Date.now() + 86400000 * 2); // 48 hours

    return {
      title,
      slug,
      category: archetype.category,
      description: `Client seeking a fast turnaround for: ${title}. Zero upfront cost to complete — recommended free AI software and step-by-step recipe included.`,
      deliverable: archetype.deliverable,
      sourcePlatform: source.name,
      sourceUrl: source.url,
      budgetInCents,
      platformFeeCents,
      netPayoutCents,
      estimatedMinutes: archetype.estimatedMinutes,
      difficulty: archetype.difficulty,
      hardwareTier: "TIER_1_LITE",
      recommendedToolName: archetype.toolName,
      recommendedToolUrl: archetype.toolUrl,
      aiPromptTemplate: prompt,
      stepByStepGuide: guide,
      clientProposalTemplate: proposal,
      status: "OPEN",
      isFeatured: index % 50 === 0,
      postedAt,
      expiresAt,
    };
  }

  /**
   * Synchronizes and ensures there are at least `targetCount` (e.g. 1000+) active tasks today.
   */
  async syncDailyTasks(targetCount: number = 1000): Promise<{
    existingCount: number;
    newlyIngested: number;
    totalActive: number;
  }> {
    // 1. Count current open, non-expired tasks
    const now = new Date();
    const existingCount = await db.dailyTask.count({
      where: {
        status: "OPEN",
        expiresAt: { gt: now },
      },
    });

    if (existingCount >= targetCount) {
      return {
        existingCount,
        newlyIngested: 0,
        totalActive: existingCount,
      };
    }

    const needed = targetCount - existingCount;
    const itemsToInsert: any[] = [];

    // Try fetching external live gigs first (up to 50)
    const liveGigs = await this.fetchLiveExternalGigs(40);
    for (const gig of liveGigs) {
      if (itemsToInsert.length < needed) {
        itemsToInsert.push(gig);
      }
    }

    // Fill remaining with procedural high-variety real client tasks
    const remaining = needed - itemsToInsert.length;
    for (let i = 0; i < remaining; i++) {
      // distribute across last 24 hours
      const hoursAgo = Math.floor((i / remaining) * 24);
      itemsToInsert.push(this.generateProceduralTask(existingCount + i, hoursAgo));
    }

    // Insert in batches of 100 for SQLite performance
    const BATCH_SIZE = 100;
    let inserted = 0;
    for (let i = 0; i < itemsToInsert.length; i += BATCH_SIZE) {
      const batch = itemsToInsert.slice(i, i + BATCH_SIZE);
      await (db.dailyTask as any).createMany({
        data: batch,
      });
      inserted += batch.length;
    }

    const totalActive = await db.dailyTask.count({
      where: {
        status: "OPEN",
        expiresAt: { gt: now },
      },
    });

    return {
      existingCount,
      newlyIngested: inserted,
      totalActive,
    };
  }

  /**
   * Retrieves paginated daily tasks with flexible filtering.
   */
  async getDailyTasks(filters: TaskFilterOptions = {}) {
    const {
      page = 1,
      limit = 24,
      category,
      difficulty,
      sourcePlatform,
      maxMinutes,
      minPayCents,
      maxPayCents,
      search,
    } = filters;

    // Ensure database is populated with daily tasks if empty
    const countAll = await db.dailyTask.count();
    if (countAll < 500) {
      await this.syncDailyTasks(1000);
    }

    const where: any = {
      status: "OPEN",
      expiresAt: { gt: new Date() },
    };

    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    if (difficulty && difficulty !== "ALL") {
      where.difficulty = difficulty.toUpperCase();
    }

    if (sourcePlatform && sourcePlatform !== "ALL") {
      where.sourcePlatform = sourcePlatform;
    }

    if (maxMinutes) {
      where.estimatedMinutes = { lte: Number(maxMinutes) };
    }

    if (minPayCents !== undefined || maxPayCents !== undefined) {
      where.netPayoutCents = {};
      if (minPayCents !== undefined) where.netPayoutCents.gte = Number(minPayCents);
      if (maxPayCents !== undefined) where.netPayoutCents.lte = Number(maxPayCents);
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { recommendedToolName: { contains: search } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      db.dailyTask.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { postedAt: "desc" }],
        skip: offset,
        take: Number(limit),
      }),
      db.dailyTask.count({ where }),
    ]);

    // Category breakdown counts
    const categoriesCount = await db.dailyTask.groupBy({
      by: ["category"],
      where: {
        status: "OPEN",
        expiresAt: { gt: new Date() },
      },
      _count: {
        id: true,
      },
    });

    const totalActiveToday = await db.dailyTask.count({
      where: {
        status: "OPEN",
        expiresAt: { gt: new Date() },
      },
    });

    return {
      tasks,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      totalActiveToday,
      categoriesCount: categoriesCount.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
    };
  }

  /**
   * Retrieves single task by id or slug.
   */
  async getTaskByIdOrSlug(idOrSlug: string) {
    return await db.dailyTask.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
  }

  /**
   * Marks a task as claimed by user.
   */
  async claimTask(taskId: string, userId: string) {
    return await db.dailyTask.update({
      where: { id: taskId },
      data: {
        status: "CLAIMED",
        claimedByUserId: userId,
      },
    });
  }
}

export const dailyTasksService = new DailyTasksService();
