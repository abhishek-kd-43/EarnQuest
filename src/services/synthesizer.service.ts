import { db } from "@/lib/db";

export interface SynthesizeMissionParams {
  opportunityId: string;
  opportunityTitle: string;
  category: string;
  targetMarket: string;
  potentialRevenue: string;
  primaryToolName: string;
  primaryToolUrl: string;
  hardwareTier?: string;
}

export class SynthesizerService {
  /**
   * Generates a realistic, structured 8-step guided mission for an opportunity,
   * complete with exact copy-paste prompt templates, troubleshooting, and client outreach scripts.
   */
  async synthesizeMissionForOpportunity(params: SynthesizeMissionParams) {
    const slug = `mission-${params.opportunityTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;

    // 1. Check if mission already exists
    const existing = await db.mission.findUnique({
      where: { slug },
      include: { steps: true },
    });

    if (existing) {
      return existing;
    }

    const hardwareTier = params.hardwareTier || "TIER_1_LITE";

    // 2. Generate the 8 structured beginner-friendly steps
    const stepsData = [
      {
        stepNumber: 1,
        title: `Calibrate Environment & Access Free ${params.primaryToolName}`,
        objective: `Open ${params.primaryToolName} without paying anything or entering credit card details.`,
        instruction: `Navigate to ${params.primaryToolUrl}. Sign in using your free Google or GitHub account. Verify you are on the free plan tier.`,
        promptTemplate: null,
        expectedOutput: `An active, verified free account and access to the main dashboard of ${params.primaryToolName}.`,
        troubleshooting: `Never enter credit card details. If prompted for a paid upgrade, click 'Skip' or 'Continue with Free Tier'.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 2,
        title: "Define Target Deliverable & Source Raw Client Input",
        objective: `Prepare the raw assets or text needed to produce the client deliverable.`,
        instruction: `Identify a target client in ${params.targetMarket}. Create a working project folder on your PC named 'deliverable-workspace'. Prepare sample input files or find a public sample matching client requirements.`,
        promptTemplate: `Act as a senior consultant in ${params.category}. Detail the exact standard deliverables expected by ${params.targetMarket} for this service:`,
        expectedOutput: `Clean raw input file and a clear checklist of client deliverable specifications.`,
        troubleshooting: `If you do not have an active client yet, create a high-quality portfolio sample piece to showcase on your profile.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 3,
        title: `Execute AI Generation Using ${params.primaryToolName}`,
        objective: `Generate the first complete draft of the deliverable using precision AI prompts.`,
        instruction: `Copy and paste the exact prompt template below into ${params.primaryToolName}. Replace the bracketed variables with your project details.`,
        promptTemplate: `You are an expert ${params.category} specialist. Transform the following input into a polished, production-ready deliverable for ${params.targetMarket}:
[INPUT DATA HERE]
Requirements:
1. Format with clear headings, bullet points, and zero filler text.
2. Tone must be professional, authoritative, and immediately useful for the client.
3. Include an executive summary and actionable implementation checklist.`,
        expectedOutput: `A complete, structured AI-generated draft meeting all client specifications.`,
        troubleshooting: `If the AI response cuts off or sounds too generic, reply: 'Be more specific, remove cliches, and give concrete industry examples.'`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 4,
        title: "Manual Polish & Quality Assurance Review",
        objective: `Review the output to ensure 100% human-level accuracy, correctness, and brand voice.`,
        instruction: `Read through every line of the AI output. Fact-check any statistics or links, fix unnatural phrasing, and ensure all client constraints are strictly respected.`,
        promptTemplate: `Proofread the following draft. Correct any awkward sentences, tone inconsistencies, or repetitive words while preserving the core message:
[PASTE DRAFT HERE]`,
        expectedOutput: `Final approved deliverable file (PDF, Markdown, HTML, or MP4) ready for presentation.`,
        troubleshooting: `Never send unedited raw AI output to a client. 5 minutes of human polish separates a $20 gig from a $200 retainer.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 5,
        title: "Package Deliverables on Free Cloud Storage",
        objective: `Store your deliverable on free cloud infrastructure with view/download access.`,
        instruction: `Upload the final files to a free Google Drive folder, GitHub Pages repository, or Notion page. Set the share permissions to 'Anyone with the link can view'.`,
        promptTemplate: null,
        expectedOutput: `A shareable public URL that allows the client to preview and download their deliverable instantly.`,
        troubleshooting: `Verify the link by opening it in an Incognito/Private browser window to ensure no login is required to view.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 6,
        title: "Set Up Monetization (EarnQuest Direct Checkout / External Listing)",
        objective: `Create a direct checkout link where the client or buyer can pay you for this deliverable.`,
        instruction: `In your EarnQuest Project Workspace, click 'Monetize Deliverable'. Set your price (e.g. $25 - $150). Copy your public EarnQuest checkout link. Alternatively, list the deliverable on Gumroad, Upwork, or Fiverr.`,
        promptTemplate: null,
        expectedOutput: `A live checkout link where you receive 80% (on-platform) or 100% (external).`,
        troubleshooting: `Start with a competitive intro price to secure your first 3 5-star testimonials.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 7,
        title: "Execute Client Outreach with High-Conversion Pitch",
        objective: `Send a direct, value-first message to prospective clients in ${params.targetMarket}.`,
        instruction: `Identify 5 prospective clients on LinkedIn, Twitter, Google Maps, or Upwork. Send the personalized pitch message below.`,
        promptTemplate: `Hi [Name],

I noticed you are currently expanding your [specific business area]. I put together a quick, complimentary sample showing how you can [solve problem / improve outcome]:

Link: [YOUR DELIVERABLE PREVIEW URL]

If you find this helpful, I can deliver the full package for your brand this week for [PRICE]. Let me know if you'd like me to send over the complete files!

Best,
[Your Name]`,
        expectedOutput: `At least 5 personalized outreach messages sent to relevant business owners or buyers.`,
        troubleshooting: `Never send mass spam. Personalize the first two sentences to mention something specific about the recipient's website or business.`,
        isBeginnerEssential: true,
      },
      {
        stepNumber: 8,
        title: "Deliver Final Work & Submit Proof for Platform XP",
        objective: `Deliver final files to the client, receive payment, and submit proof to EarnQuest.`,
        instruction: `Upon payment confirmation, send the client the final files. Take a screenshot of the receipt or checkout confirmation and upload it to your EarnQuest Earnings page to earn XP and level up.`,
        promptTemplate: null,
        expectedOutput: `Completed transaction, funds deposited into your account, and XP awarded in your EarnQuest profile.`,
        troubleshooting: `Always ask the client for a 1-sentence testimonial: 'If you were happy with the speed and quality, would you mind sharing a quick testimonial I can quote?'`,
        isBeginnerEssential: true,
      },
    ];

    // 3. Create the mission and its steps in the database
    return db.mission.create({
      data: {
        slug,
        opportunityId: params.opportunityId,
        title: `Execute: ${params.opportunityTitle}`,
        tagLine: `Step-by-step blueprint to build and monetize ${params.opportunityTitle}.`,
        description: `Complete guided mission using free ${params.primaryToolName} to produce high-value deliverables for ${params.targetMarket}. Potential earnings: ${params.potentialRevenue}.`,
        category: params.category,
        difficulty: "BEGINNER",
        estimatedTime: "2-4 hours",
        hardwareTier,
        whyThisExists: `High market demand in ${params.targetMarket} combined with zero-cost AI tooling allows beginners to offer this service profitably.`,
        whatYouWillBuild: `A client-ready deliverable package and live checkout link to monetize ${params.opportunityTitle}.`,
        potentialMonetization: params.potentialRevenue,
        riskNotes: "Zero upfront software cost. Adhere to client privacy policies and platform guidelines.",
        steps: {
          create: stepsData,
        },
      },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
      },
    });
  }
}

export const synthesizerService = new SynthesizerService();
