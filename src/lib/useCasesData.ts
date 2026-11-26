import type { UseCaseFlowStep, UseCaseRecord, UseCaseResultItem } from './types.ts'

export type UseCaseAccent = 'blue' | 'amber' | 'emerald' | 'violet' | 'cyan' | 'rose'

export interface UseCaseScenario {
  title: string
  trigger: string
  action: string
  outcome: string
}

export interface UseCaseDialogueTurn {
  speaker: 'AI' | 'Caller'
  text: string
}

export interface RichUseCaseSpec extends UseCaseRecord {
  industry_slug: string
  name: string
  categoryTag: string
  icon_name: string
  accent: UseCaseAccent
  cover_image_url: string
  headline: string
  subhead: string
  problem: string
  deepDive: {
    title: string
    paragraphs: string[]
  }
  scenarios: UseCaseScenario[]
  sampleDialogue: {
    context: string
    agentName: string
    turns: UseCaseDialogueTurn[]
  }
  features: string[]
  flow: UseCaseFlowStep[]
  results: UseCaseResultItem[]
  integrations: string[]
  vapiAgentId?: string
}

export const RICH_USE_CASES: RichUseCaseSpec[] = [
  {
    industry_slug: 'real-estate',
    name: 'Real Estate',
    categoryTag: 'Property & Brokerage AI',
    icon_name: 'Home',
    accent: 'blue',
    cover_image_url:
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop',
    headline: 'Speed-to-Lead Calling & Showing Automation for Brokerages',
    subhead:
      'Engage Zillow, Realtor.com, and Meta ad inquiries within 5 seconds, qualify buyer pre-approval and seller timelines, and book property tours straight onto agent calendars 24/7.',
    problem:
      'In residential and commercial real estate, 78% of commissions go to the first agent who speaks with the prospect. Yet inquiries arrive at 9 PM, during property showings, or over busy open-house weekends—causing average response times to stretch past two hours while high-intent buyers move on to competing listings.',
    deepDive: {
      title: 'How Voice AI Transforms Real Estate Lead Conversion',
      paragraphs: [
        'Traditional brokerage ISA (Inside Sales Agent) teams struggle with spiky portal volume, costly staffing overhead, and weekend coverage gaps. Our Real Estate Voice AI connects directly to your lead sources via webhook so the moment a prospect clicks "Request a Tour" or "Get Home Valuation," an outbound call initiates in under five seconds with full listing context.',
        'Rather than reading a robotic script, the agent references the exact property address, asks conversational qualification questions—pre-approval status, target move-in window, current lease or home-sale contingency, and preferred neighborhoods—then either live-transfers hot buyers to the listing agent or locks in a confirmed calendar slot with SMS confirmation.',
      ],
    },
    scenarios: [
      {
        title: 'Portal Buyer Speed-to-Lead',
        trigger: 'Buyer submits a "Schedule Tour" form on Zillow, Realtor.com, or IDX website.',
        action:
          'Calls in <5 seconds, confirms interest in the specific property address, checks lender pre-approval, and offers available showing windows.',
        outcome: 'Confirmed property tour on listing agent calendar + structured BANT summary in Follow Up Boss.',
      },
      {
        title: 'Homeowner Seller Valuation Intake',
        trigger: 'Homeowner requests an instant CMA / home equity valuation from a Facebook or Google ad.',
        action:
          'Asks about property upgrades, ideal selling timeframe, and whether they plan to buy locally after closing.',
        outcome: 'Listing consultation booked for motivated sellers; long-term nurtures tagged automatically in CRM.',
      },
      {
        title: 'After-Hours Sign-Rider & Listing Hotline',
        trigger: 'Drive-by buyer calls the yard sign number at 8:30 PM outside office hours.',
        action:
          'Answers immediately with bedrooms, HOA fees, school district, and pricing details pulled from MLS data.',
        outcome: 'Zero missed curb-side inquiries and instant private showing scheduled for the next morning.',
      },
    ],
    sampleDialogue: {
      context: 'Outbound call triggered 4 seconds after a Zillow inquiry on 412 Oakridge Ave',
      agentName: 'Aria — Brokerage Concierge',
      turns: [
        {
          speaker: 'AI',
          text: 'Hi Marcus, this is Aria calling from Apex Realty—saw you just requested details on 412 Oakridge Avenue. Did I catch you at an okay moment?',
        },
        {
          speaker: 'Caller',
          text: 'Oh wow, that was quick! Yeah, we wanted to see if it is still available this weekend.',
        },
        {
          speaker: 'AI',
          text: 'It is active and we have private tour slots open Saturday afternoon. Just so our agent prepares the right comps, are you already pre-approved with a lender or planning a cash purchase?',
        },
        {
          speaker: 'Caller',
          text: 'We are pre-approved up to $650k and hoping to move before August.',
        },
        {
          speaker: 'AI',
          text: 'Perfect—412 Oakridge is listed at $615k so that fits comfortably. Would Saturday at 1:30 PM or 3:15 PM work better for you and your family to tour?',
        },
        {
          speaker: 'Caller',
          text: 'Saturday at 1:30 PM works great.',
        },
      ],
    },
    features: [
      'Sub-5-second webhook callback on Zillow, Realtor.com & IDX leads',
      'Property-aware prompts referencing live MLS address, price & specs',
      'Buyer pre-approval, budget & contingency qualification',
      'Warm live-transfer to on-duty agents with whispered call summary',
      'Two-way calendar booking with SMS address & lockbox reminders',
      'Automatic Follow Up Boss, kvCORE & Lofty disposition logging',
    ],
    flow: [
      {
        step: 'Portal / IDX Webhook Fires',
        desc: 'Lead payload arrives from Zillow, Meta Lead Ads, or your IDX site with contact info and listing address.',
      },
      {
        step: 'Instant Contextual Outbound Call',
        desc: 'Voice AI dials within 5 seconds, greets the lead by name, and references the exact property they viewed.',
      },
      {
        step: 'Qualification & Intent Scoring',
        desc: 'Verifies financing readiness, move timeline, bed/bath criteria, and whether they have a home to sell.',
      },
      {
        step: 'Warm Transfer or Calendar Lock-In',
        desc: 'Ready-now buyers are bridged live to an agent; future tours are booked with automated SMS reminders.',
      },
    ],
    results: [
      { stat: '300%', label: 'Higher lead connect rate' },
      { stat: '<5s', label: 'Average speed to lead' },
      { stat: '21x', label: 'Higher tour conversion odds' },
    ],
    integrations: [
      'Follow Up Boss',
      'kvCORE',
      'Zillow Premier Agent',
      'Calendly',
      'GoHighLevel',
      'Google Calendar',
    ],
    vapiAgentId: '087efbdc-3fcf-4329-a12e-819eb64d3882',
  },
  {
    industry_slug: 'solar',
    name: 'Solar & Energy',
    categoryTag: 'Clean Energy & Residential Solar',
    icon_name: 'Sun',
    accent: 'amber',
    cover_image_url:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop',
    headline: 'High-Volume Homeowner Pre-Qualification for Solar Installers',
    subhead:
      'Screen thousands of solar ad leads automatically by homeownership, monthly kWh bill, roof condition, and sun exposure—so closers only sit with qualified homeowners.',
    problem:
      'Solar EPCs and dealers generate massive paid-social lead volume, but up to 65% of form fills turn out to be renters, mobile homes, shaded roofs, or sub-$100 electric bills. Human setters burn hours redialing voicemails while qualified homeowners book with faster competitors.',
    deepDive: {
      title: 'Eliminating Wasted Closer Appointments in Solar Sales',
      paragraphs: [
        'Solar unit economics depend on keeping closer calendars packed with sit-ready, utility-qualified homeowners. Manual setter floors suffer from high turnover, inconsistent objection handling, and missed callback windows when ad campaigns spike in peak summer months.',
        'Our Solar Voice AI dials every new lead immediately, verifies single-family homeownership, confirms average monthly electric bills ($150+ threshold), checks roof age and shading, collects the utility provider name for proposal modeling, and schedules a confirmed virtual or in-home design consultation.',
      ],
    },
    scenarios: [
      {
        title: 'Paid Social Lead Pre-Screen',
        trigger: 'Homeowner clicks a "Check Solar Incentives by ZIP Code" Facebook/YouTube ad.',
        action:
          'Verifies homeowner status, utility provider, average monthly bill, and credit/financing comfort.',
        outcome: 'Design proposal triggered in Aurora/Solo and closer appointment booked with utility bill upload link texted.',
      },
      {
        title: 'Aged Database Reactivation',
        trigger: 'Utility rate hike announced in a target territory with 10,000+ unconverted CRM leads.',
        action:
          'Runs TCPA-compliant outbound campaigns referencing the local utility rate increase to re-open conversations.',
        outcome: 'Dormant leads converted into fresh design sits at zero incremental ad spend.',
      },
      {
        title: 'Appointment Sit-Rate & Bill Collection',
        trigger: '24 hours prior to a scheduled solar consultation.',
        action:
          'Calls homeowner to confirm both decision-makers will attend and reminds them to upload their latest kWh statement.',
        outcome: 'Sit rates jump significantly because proposals are pre-built before the rep joins Zoom.',
      },
    ],
    sampleDialogue: {
      context: 'Outbound qualification call following a solar rebate eligibility form submission',
      agentName: 'Sol — Energy Advisor AI',
      turns: [
        {
          speaker: 'AI',
          text: 'Hiydia, this is Sol with SunPeak Energy—you just checked net-metering incentives for your home in Phoenix. Do you have sixty seconds to verify if your roof qualifies?',
        },
        {
          speaker: 'Caller',
          text: 'Sure, our summer APS electric bills have been brutal lately.',
        },
        {
          speaker: 'AI',
          text: 'APS summer peak rates definitely add up fast. Are you the homeowner on title, and roughly what does your monthly APS bill average across the year?',
        },
        {
          speaker: 'Caller',
          text: 'Yes, my husband and I own the house. It averages around $260 a month—over $400 in July.',
        },
        {
          speaker: 'AI',
          text: 'At $260 average with APS, homes typically see strong day-one offset. Does your south or west roof get clear afternoon sun without heavy tree shade?',
        },
        {
          speaker: 'Caller',
          text: 'Zero trees over the roof, full sun all day.',
        },
      ],
    },
    features: [
      'Homeowner vs. renter & property-type verification',
      'Monthly utility bill & electric provider screening',
      'Roof age, material & tree-shading qualification',
      'Automated SMS link to collect utility bill photos before the sit',
      'Both-spouses / decision-maker attendance confirmation',
      'Aged solar lead reactivation campaigns during utility rate hikes',
    ],
    flow: [
      {
        step: 'Ad Funnel Lead Ingested',
        desc: 'Lead enters from Meta, TikTok, Google, or landing page quiz with ZIP code and phone number.',
      },
      {
        step: 'Eligibility & Utility Screen',
        desc: 'AI confirms homeownership, utility company, $150+ monthly bill, and unshaded roof viability.',
      },
      {
        step: 'Utility Bill Capture via SMS',
        desc: 'Sends an instant text link during the call so the engineering team can model roof irradiance in Aurora.',
      },
      {
        step: 'Closer Calendar Handoff',
        desc: 'Books the solar consultation when all decision-makers are home and logs full call notes to CRM.',
      },
    ],
    results: [
      { stat: '12hrs', label: 'Saved per setter weekly' },
      { stat: '4x', label: 'Qualified sit throughput' },
      { stat: '38%', label: 'Higher consultation show rate' },
    ],
    integrations: [
      'Aurora Solar',
      'GoHighLevel',
      'HubSpot',
      'Salesforce',
      'Enerflo',
      'Calendly',
    ],
  },
  {
    industry_slug: 'home-services',
    name: 'Home Services',
    categoryTag: 'HVAC, Plumbing, Electrical & Roofing',
    icon_name: 'Hammer',
    accent: 'amber',
    cover_image_url:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    headline: '24/7 Emergency Triage, Booking & Dispatch for Trade Contractors',
    subhead:
      'Answer every plumbing, HVAC, electrical, and roofing call on the first ring—separating urgent emergencies from routine jobs and booking straight into your dispatch board.',
    problem:
      'When a homeowner has a burst pipe at 11 PM or a dead AC unit in August, they do not leave a voicemail—they call the next contractor on Google Local Services. Traditional answering services take messages without booking jobs, costing home-service companies thousands in lost emergency tickets.',
    deepDive: {
      title: 'First-Ring Dispatch Without Overnight Answering-Service Mistakes',
      paragraphs: [
        'Generic call centers read rigid intake sheets, misquote diagnostic fees, and dump unbooked message slips onto your morning CSRs—by which time the homeowner has already hired another truck. Worse, missed Google Local Services Ads (LSA) calls actively hurt your local search ranking.',
        'Our Home Services Voice AI understands trade-specific symptoms (no-cool vs. refrigerant leak, main-line backup vs. dripping faucet, panel breaker trip), verifies service-area ZIP codes, transparently communicates dispatch/diagnostic fees, routes true emergencies to your on-call tech, and books standard arrival windows directly into ServiceTitan, Housecall Pro, or Jobber.',
      ],
    },
    scenarios: [
      {
        title: 'After-Hours Emergency Triage & On-Call Escalation',
        trigger: 'Homeowner calls at 1:15 AM reporting water leaking through a ceiling.',
        action:
          'Confirms service ZIP, advises safe main shutoff step if appropriate, quotes emergency dispatch fee, and pages on-call plumber.',
        outcome: 'High-ticket emergency job captured and dispatched immediately instead of lost to voicemail.',
      },
      {
        title: 'Peak-Season HVAC Tune-Up & Repair Booking',
        trigger: 'First 95°F heatwave triggers 80 simultaneous inbound AC calls.',
        action:
          'Handles unlimited concurrent calls with zero hold music, checks real technician zone capacity, and books 2-hour arrival windows.',
        outcome: 'Every caller answered on ring one; dispatch board filled cleanly by geographic zone.',
      },
      {
        title: 'Club Membership & Seasonal Maintenance Recall',
        trigger: 'Spring/Fall maintenance due for 1,500 existing HVAC/plumbing customers.',
        action:
          'Places friendly outbound reminder calls to book included seasonal inspections before peak weather hits.',
        outcome: 'Shoulder-season tech utilization stays full and replacement opportunities surface early.',
      },
    ],
    sampleDialogue: {
      context: 'Inbound emergency HVAC call at 9:40 PM during a summer evening',
      agentName: 'dispatchAI — Apex Comfort',
      turns: [
        {
          speaker: 'AI',
          text: 'Thanks for calling Apex Heating & Air, 24/7 dispatch—this is Alex. How can we help get your home comfortable tonight?',
        },
        {
          speaker: 'Caller',
          text: 'Our AC is blowing warm air and it is already 84 degrees upstairs with two young kids.',
        },
        {
          speaker: 'AI',
          text: 'I am sorry you are dealing with that tonight—let us get a tech out to you. What is your 5-digit ZIP code so I can check our on-call truck in your area?',
        },
        {
          speaker: 'Caller',
          text: '75024 in Plano.',
        },
        {
          speaker: 'AI',
          text: 'We cover 75024. Our on-call senior tech has an emergency window tonight between 10:30 and 11:30 PM with a $99 diagnostic fee waived toward any repair, or tomorrow at 8:00 AM for $69. Which do you prefer?',
        },
        {
          speaker: 'Caller',
          text: 'Please send them tonight at 10:30—thank you!',
        },
      ],
    },
    features: [
      'Zero-hold concurrent answering for Google LSA & storm surges',
      'Service-area ZIP code & property-type validation',
      'Emergency vs. routine severity triage with on-call tech escalation',
      'Transparent diagnostic fee disclosure & arrival-window booking',
      'Direct job creation in ServiceTitan, Housecall Pro & Jobber',
      'Automated SMS tech-en-route confirmation to homeowners',
    ],
    flow: [
      {
        step: 'Inbound Call Answered on Ring 1',
        desc: 'Picks up 24/7/365—even when 20 homeowners call simultaneously during weather spikes.',
      },
      {
        step: 'Issue Triage & ZIP Verification',
        desc: 'Identifies trade category, urgency level, equipment age, and confirms the address is inside your territory.',
      },
      {
        step: 'Dispatch Board Slot Selection',
        desc: 'Quotes diagnostic pricing clearly and selects an available technician arrival window.',
      },
      {
        step: 'Job Logged & On-Call Alerted',
        desc: 'Pushes full job ticket to FSM software and pages the on-call tech via SMS/call for urgent dispatches.',
      },
    ],
    results: [
      { stat: '40%', label: 'More booked service tickets' },
      { stat: '0s', label: 'Caller hold time in peak surges' },
      { stat: '24/7', label: 'Live emergency dispatch' },
    ],
    integrations: [
      'ServiceTitan',
      'Housecall Pro',
      'Jobber',
      'FieldEdge',
      'Google Local Services',
      'Twilio',
    ],
  },
  {
    industry_slug: 'consulting',
    name: 'Consulting & Agencies',
    categoryTag: 'B2B Advisory, Legal & Professional Services',
    icon_name: 'Briefcase',
    accent: 'violet',
    cover_image_url:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    headline: 'Executive Discovery Intake & Consultation Qualification',
    subhead:
      'Conduct structured voice discovery interviews with prospective clients—capturing scope, budget floor, urgency, and practice-area fit before booking senior partners.',
    problem:
      'Partners, attorneys, and agency principals lose 8–12 billable hours every week sitting on discovery calls with under-budget or out-of-scope prospects, while high-retainer inquiries wait days for manual email back-and-forth.',
    deepDive: {
      title: 'Protecting Partner Calendars While Elevating Client Experience',
      paragraphs: [
        'Multi-page web intake forms suffer steep drop-off rates because busy executives prefer explaining their situation out loud rather than typing essays into form boxes. Conversely, letting anyone book a 45-minute calendar link floods senior advisors with unqualified tire-kickers.',
        'Our Professional Services Voice AI acts as a polished executive intake coordinator: it greets prospective clients immediately, asks nuanced scoping questions tailored to your practice areas, gracefully redirects out-of-budget inquiries to alternative resources, and delivers a structured executive brief ahead of every booked partner strategy call.',
      ],
    },
    scenarios: [
      {
        title: 'B2B Agency Retainer Qualification',
        trigger: 'CMO or founder submits a "Work With Us" inquiry on your agency site.',
        action:
          'Calls to explore current revenue stage, marketing bottleneck, target launch date, and monthly retainer alignment.',
        outcome: 'Qualified prospects booked with managing partner + executive brief posted to Slack & HubSpot.',
      },
      {
        title: 'Law Firm Case Intake & Conflict Pre-Check',
        trigger: 'Prospective client calls a legal practice regarding a business dispute, injury, or estate matter.',
        action:
          'Captures incident dates, jurisdiction, opposing party names for conflict screening, and matter urgency.',
        outcome: 'Structured case file created in Clio/Lawmatics and attorney consultation scheduled.',
      },
      {
        title: 'Webinar & Executive Event Follow-Up',
        trigger: '150 B2B leaders attend a live workshop or download a benchmark whitepaper.',
        action:
          'Places personalized follow-up calls offering a 15-minute diagnostic audit based on the topic they engaged with.',
        outcome: '3x higher workshop-to-pipeline conversion without manual SDR chasing.',
      },
    ],
    sampleDialogue: {
      context: 'Inbound consultation intake for a B2B growth & automation advisory firm',
      agentName: 'Clara — Executive Intake',
      turns: [
        {
          speaker: 'AI',
          text: 'Hello, thank you for reaching out to Vanguard Advisory. I am Clara, our intake coordinator—I would love to capture a quick overview so we pair you with the right partner.',
        },
        {
          speaker: 'Caller',
          text: 'Great—we are a 45-person logistics company looking to automate our customer quoting and dispatch calls.',
        },
        {
          speaker: 'AI',
          text: 'That is right in our wheelhouse. Roughly how many inbound quote or dispatch calls does your team handle weekly right now?',
        },
        {
          speaker: 'Caller',
          text: 'Around 1,200 calls a week across three regional offices.',
        },
        {
          speaker: 'AI',
          text: 'Got it—at 1,200 weekly calls, custom ERP integration makes a major impact. Are you targeting deployment this quarter, and have you allocated budget in our typical $10k–$25k implementation range?',
        },
        {
          speaker: 'Caller',
          text: 'Yes, Q2 rollout is our priority and that budget works for us.',
        },
      ],
    },
    features: [
      'Nuanced budget-floor, authority & scope qualification',
      'Polished redirection for out-of-scope or sub-minimum inquiries',
      'Structured executive intake briefs sent to Slack, Notion & CRM',
      'Legal & advisory jurisdiction / conflict-check data capture',
      'Round-robin partner calendar routing by specialty',
      'Post-webinar & whitepaper executive pipeline follow-up',
    ],
    flow: [
      {
        step: 'Inquiry Received (Web or Phone)',
        desc: 'Prospect calls your main advisory line or submits a consultation request form.',
      },
      {
        step: 'Structured Voice Discovery',
        desc: 'AI conducts a natural 2–3 minute intake covering company size, pain point, timeline, and budget fit.',
      },
      {
        step: 'Fit Scoring & Routing',
        desc: 'High-fit prospects unlock direct partner calendar slots; non-fit leads receive helpful self-serve resources.',
      },
      {
        step: 'Partner Brief Delivered',
        desc: 'Full transcript, extracted summary, and CRM deal record arrive before the strategy call begins.',
      },
    ],
    results: [
      { stat: '60%', label: 'Faster client onboarding' },
      { stat: '9hrs', label: 'Partner time saved weekly' },
      { stat: '3x', label: 'Qualified discovery calls' },
    ],
    integrations: [
      'HubSpot',
      'Clio',
      'Lawmatics',
      'Slack',
      'Calendly',
      'Notion',
    ],
  },
  {
    industry_slug: 'finance',
    name: 'Finance & Insurance',
    categoryTag: 'Lending, Wealth & Insurance Carriers',
    icon_name: 'BarChart',
    accent: 'emerald',
    cover_image_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    headline: 'Compliance-Guardrailed Voice AI for Finance & Insurance',
    subhead:
      'Automate borrower pre-qualification, policy renewal outreach, and First-Notice-of-Loss (FNOL) claims intake with deterministic disclosures, DNC checks, and full audit logs.',
    problem:
      'Financial institutions, mortgage brokers, and insurance agencies face strict TCPA, disclosures, and audit rules. Human reps occasionally skip mandatory verbatim disclosures or mislog consent, while borrowers and policyholders wait on hold during rate drops or storm claim surges.',
    deepDive: {
      title: 'Deterministic Compliance Meets Zero-Wait Policyholder Care',
      paragraphs: [
        'In regulated financial workflows, improvisation is a liability: every rate inquiry, loan pre-screen, or insurance quote requires consistent recording disclosures, explicit opt-in verification, and zero unauthorized financial advice.',
        'Our Finance & Insurance Voice AI enforces strict prompt guardrails: it delivers verbatim regulatory disclosures at call start, checks Do-Not-Call (DNC) and time-of-day calling windows automatically, gathers structured underwriting or FNOL data without hallucinating policy coverage, and transfers licensed discussions seamlessly to NMLS/state-licensed advisors.',
      ],
    },
    scenarios: [
      {
        title: 'Mortgage & Lending Rate-Drop Pre-Screen',
        trigger: 'Borrower requests refinance or DSCR loan options online.',
        action:
          'Reads required recording disclosure, verifies property state, estimated LTV/credit tier, and bridges to a state-licensed loan officer.',
        outcome: 'Licensed MLOs receive pre-vetted live transfers with complete 1003 starter notes.',
      },
      {
        title: 'Insurance First-Notice-of-Loss (FNOL) Claims Intake',
        trigger: 'Policyholder calls after an auto collision or severe weather event.',
        action:
          'Verifies policy number, confirms everyone is safe, captures incident time/location/photos via SMS, and opens claim ticket.',
        outcome: ' empathetic zero-wait FNOL filing even during regional storm claim spikes.',
      },
      {
        title: 'Policy Renewal & Lapse Prevention',
        trigger: '15 days before auto, life, or commercial policy renewal deadline.',
        action:
          'Reminds policyholder of upcoming renewal, answers billing schedule questions, or books an annual coverage review.',
        outcome: 'Higher policy retention and reduced involuntary payment lapses.',
      },
    ],
    sampleDialogue: {
      context: 'Inbound mortgage refinance pre-qualification with mandatory verbatim disclosure',
      agentName: 'Evelyn — Lending Intake Desk',
      turns: [
        {
          speaker: 'AI',
          text: 'Thank you for calling Meridian Home Lending. Please note this call is recorded for quality and regulatory compliance. I am Evelyn, an automated intake assistant—are you looking into a new home purchase or a refinance today?',
        },
        {
          speaker: 'Caller',
          text: 'We are looking to refinance our primary residence in Texas.',
        },
        {
          speaker: 'AI',
          text: 'Wonderful—we have Texas-licensed loan officers available right now. Roughly what is your estimated home value and current mortgage balance?',
        },
        {
          speaker: 'Caller',
          text: 'Home is worth around $520,000 and we owe about $360,000.',
        },
        {
          speaker: 'AI',
          text: 'Thank you—that puts you right around 69% loan-to-value. Are you looking simply to lower your rate and payment, or also take cash out at closing?',
        },
        {
          speaker: 'Caller',
          text: 'Just lower our monthly rate—no cash out.',
        },
      ],
    },
    features: [
      '100% verbatim recording & regulatory disclosure delivery',
      'Automated TCPA time-zone window & DNC list enforcement',
      'Strict anti-hallucination guardrails (never gives unlicensed advice)',
      'State-by-state routing to NMLS or state-licensed producers',
      '24/7 First-Notice-of-Loss (FNOL) claims intake & photo link SMS',
      'Immutable call audio, timestamped consent & transcript archiving',
    ],
    flow: [
      {
        step: 'Compliance Pre-Check & Disclosure',
        desc: 'Validates calling window/consent status and delivers mandatory verbatim disclosures at connection.',
      },
      {
        step: 'Structured Fact-Finding',
        desc: 'Collects state, product type, coverage/loan parameters, or FNOL claim details within strict guardrails.',
      },
      {
        step: 'Licensed Advisor Bridge',
        desc: 'Routes rate quotes or coverage binding live to an advisor licensed in the caller’s exact jurisdiction.',
      },
      {
        step: 'Immutable Audit Trail',
        desc: 'Archives audio, full transcript, consent flags, and structured JSON into your LOS, AMS, or CRM.',
      },
    ],
    results: [
      { stat: '100%', label: 'Verbatim disclosure adherence' },
      { stat: '50%', label: 'Lower intake cost per file' },
      { stat: '<15s', label: 'FNOL & borrower pickup time' },
    ],
    integrations: [
      'Salesforce Financial Services',
      'Encompass / Arive',
      'Applied Epic',
      'HawkSoft',
      'HubSpot',
      'Twilio',
    ],
  },
  {
    industry_slug: 'customer-support',
    name: 'Customer Support',
    categoryTag: 'Inbound CX, SaaS & E-Commerce',
    icon_name: 'Headphones',
    accent: 'cyan',
    cover_image_url:
      'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1200&auto=format&fit=crop',
    headline: 'Autonomous Tier-1 Voice Support & Live API Resolution',
    subhead:
      'Resolve order tracking, subscription changes, account troubleshooting, and refund eligibility in real time via API—escalating edge cases to human agents with full context.',
    problem:
      'Support queues spike unpredictably around product launches, holidays, and outages. Customers hate waiting 18 minutes on hold just to check an order status, reschedule a delivery, or reset account access—driving up churn and support payroll.',
    deepDive: {
      title: 'Real Action-Taking Support, Not Just FAQ Reading',
      paragraphs: [
        'Legacy voice bots fail because they can only recite static help-center articles; the moment a caller asks "Where is my order #48291?" or "Pause my subscription for a month," they dump the caller back into a human queue to repeat everything from scratch.',
        'Our Customer Support Voice AI integrates directly with Shopify, Stripe, Zendesk, Intercom, and internal REST/GraphQL APIs via secure tool calls. During a live phone call, it authenticates the customer via caller ID or SMS OTP, looks up live order/account records, executes approved actions (address updates, RMA labels, subscription pauses), and passes complex escalations to Tier-2 humans with a complete summary.',
      ],
    },
    scenarios: [
      {
        title: 'Live Order Tracking, Returns & Address Updates',
        trigger: 'Customer calls asking why package #88412 has not arrived or needs a return label.',
        action:
          'Queries Shopify/carrier API live during the call, reads real-time transit status, or texts a prepaid RMA label.',
        outcome: 'Resolved in under 45 seconds without touching the human ticket queue.',
      },
      {
        title: 'SaaS Account Troubleshooting & Billing Care',
        trigger: 'Subscriber calls regarding an invoice charge, seat adjustment, or login lock.',
        action:
          'Verifies identity via SMS code, checks Stripe billing state, resends invoice PDF, or triggers guided reset.',
        outcome: 'Instant 24/7 resolution and higher CSAT scores.',
      },
      {
        title: 'Sentiment-Aware VIP & Escalation Handoff',
        trigger: 'Caller expresses frustration or reports a complex defective-hardware edge case.',
        action:
          'Detects frustrated tone or policy threshold, creates a prioritized Zendesk ticket, and warm-transfers to Tier-2.',
        outcome: 'Human agent greets caller already knowing their account ID, issue, and troubleshooting history.',
      },
    ],
    sampleDialogue: {
      context: 'Inbound e-commerce support call with live Shopify & carrier API lookup',
      agentName: 'Nova — Customer Care AI',
      turns: [
        {
          speaker: 'AI',
          text: 'Hi Jordan! Thanks for calling Lumina Gear—I recognize your number linked to order #49210. Are you calling about the trail pack shipment, or something else today?',
        },
        {
          speaker: 'Caller',
          text: 'Yes, that order! We leave for Colorado Friday and tracking has not updated since yesterday.',
        },
        {
          speaker: 'AI',
          text: 'Let me check the live UPS scan for #49210 right now... Good news: it cleared the Denver hub twenty minutes ago and is scheduled for delivery tomorrow by 4:00 PM.',
        },
        {
          speaker: 'Caller',
          text: 'Oh thank goodness! Can you also text me that tracking link?',
        },
        {
          speaker: 'AI',
          text: 'Just sent the live UPS tracking link to your mobile ending in 4419. Anything else I can help get ready for your trip?',
        },
        {
          speaker: 'Caller',
          text: 'That was everything—super helpful, thank you!',
        },
      ],
    },
    features: [
      'Caller-ID lookup & optional SMS OTP account verification',
      'Live mid-call API tool calls to Shopify, Stripe & ERPs',
      'Autonomous RMA return labels, subscription pauses & reschedules',
      'Knowledge-base RAG grounded strictly in your official docs',
      'Real-time caller sentiment detection & VIP escalation rules',
      'Warm human handoff with full Zendesk / Intercom ticket context',
    ],
    flow: [
      {
        step: 'Instant Greeting & Caller Match',
        desc: 'Answers in <1 second, matches phone number to CRM/order profile, and verifies identity when needed.',
      },
      {
        step: 'Live Backend Tool Execution',
        desc: 'Queries shipping carriers, billing APIs, or product docs in milliseconds while conversing naturally.',
      },
      {
        step: 'Autonomous Resolution or Action',
        desc: 'Completes approved account updates, sends SMS confirmation links, and verifies caller satisfaction.',
      },
      {
        step: 'Context-Rich Human Escalation',
        desc: 'If policy requires human review, transfers smoothly with an auto-generated ticket summary.',
      },
    ],
    results: [
      { stat: '70%', label: 'Tier-1 calls auto-resolved' },
      { stat: '<30s', label: 'Average resolution time' },
      { stat: '24/7', label: 'Zero-queue phone coverage' },
    ],
    integrations: [
      'Zendesk',
      'Shopify',
      'Intercom',
      'Gorgias',
      'Stripe',
      'Salesforce Service Cloud',
    ],
  },
  {
    industry_slug: 'sales',
    name: 'Sales Automation',
    categoryTag: 'Outbound SDR & Pipeline Acceleration',
    icon_name: 'PhoneOutgoing',
    accent: 'blue',
    cover_image_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    headline: 'Autonomous AI SDRs for Instant Inbound & Outbound Pipeline',
    subhead:
      'Call every demo request, pricing-page lead, and outbound list in seconds—handling objections naturally, qualifying BANT criteria, and filling AE calendars.',
    problem:
      'B2B and high-ticket B2C sales teams lose pipeline in the gap between marketing capture and human dial: SDRs spend 70% of their day hitting voicemails, researching tabs, and manually logging dispositions while high-intent prospects go cold.',
    deepDive: {
      title: 'Scaling Consistent, Zero-Latency Outbound & Inbound Qualification',
      paragraphs: [
        'Hiring, ramping, and managing an outbound SDR pod takes months and tens of thousands per rep—yet call blocks still only happen a few hours a day. Meanwhile, warm demo-request or lead-magnet prospects contacted after 30 minutes convert at a fraction of 1-minute callbacks.',
        'Our Sales Automation Voice AI acts as an always-on SDR engine: it triggers instant callbacks on inbound funnel events, executes structured multi-touch follow-up cadences paired with SMS, navigates common objections ("send me an email," "we already use a vendor," "bad timing") with dynamic playbooks, and books qualified discovery meetings straight onto Account Executive calendars.',
      ],
    },
    scenarios: [
      {
        title: 'Instant Demo-Form & Lead-Magnet Callback',
        trigger: 'Prospect downloads an ROI calculator or requests pricing on your website.',
        action:
          'Calls within 5 seconds while your brand is still open on their screen, qualifies team size & use case, and books an AE.',
        outcome: '5x more live conversations from existing marketing spend.',
      },
      {
        title: 'Closed-Lost & Stalled Pipeline Revival',
        trigger: '90+ days since a deal stalled on timing or budget in HubSpot/Salesforce.',
        action:
          'Checks in conversationally referencing their prior evaluation notes to see if priorities reopened this quarter.',
        outcome: 'Dormant CRM opportunities recycled into active AE meetings automatically.',
      },
      {
        title: 'High-Intent Event & Trade-Show Badge Follow-Up',
        trigger: '400 booth scans uploaded at the end of a conference day.',
        action:
          'Calls every attendee the next morning referencing the conference to schedule post-show product walkthroughs.',
        outcome: '100% of event leads contacted within 24 hours before competitors even upload CSVs.',
      },
    ],
    sampleDialogue: {
      context: 'Outbound SDR call 8 seconds after a visitor completes an ROI calculator',
      agentName: 'Liam — Growth SDR AI',
      turns: [
        {
          speaker: 'AI',
          text: 'Hi Devon, this is Liam from NexaCloud—saw you just ran our call-automation ROI estimate for a 15-seat team. Did those savings numbers line up with what you expected?',
        },
        {
          speaker: 'Caller',
          text: 'Honestly yes, we are missing a lot of inbound leads after 5 PM right now.',
        },
        {
          speaker: 'AI',
          text: 'After-hours leakage is usually the biggest quick win. What CRM are your 15 reps working out of today?',
        },
        {
          speaker: 'Caller',
          text: 'Everything is in HubSpot Sales Hub.',
        },
        {
          speaker: 'AI',
          text: 'Perfect—we have a native two-way HubSpot integration. Let us get you a 20-minute live build walkthrough with our solutions architect—does tomorrow at 11:00 AM or Thursday at 2:00 PM Eastern work better?',
        },
        {
          speaker: 'Caller',
          text: 'Thursday at 2:00 PM Eastern works.',
        },
      ],
    },
    features: [
      'Sub-5-second speed-to-lead dialing from forms, ads & calculators',
      'Dynamic objection-handling playbooks trained on top closers',
      'BANT / MEDDIC qualification before unlocking AE calendar slots',
      'Live warm-transfer with whispered prospect summary for hot buyers',
      'Coordinated voice + SMS follow-up cadences for missed calls',
      'Automatic CRM stage, call disposition & recording sync',
    ],
    flow: [
      {
        step: 'Funnel Signal or Campaign Trigger',
        desc: 'Fires immediately on form submit, pricing-page webhook, or scheduled CRM outbound list.',
      },
      {
        step: 'Conversational Pitch & Objection Navigation',
        desc: 'Opens with personalized context and handles brush-offs naturally with sub-600ms voice latency.',
      },
      {
        step: 'Qualification & Scoring',
        desc: 'Confirms ICP fit—team size, tech stack, timeline, and decision authority.',
      },
      {
        step: 'AE Calendar Booking or Hot Transfer',
        desc: 'Books round-robin AE meetings with calendar invites or transfers ready buyers live.',
      },
    ],
    results: [
      { stat: '5x', label: 'More prospects reached live' },
      { stat: '<5s', label: 'Inbound speed to lead' },
      { stat: '32%', label: 'Qualified meeting set rate' },
    ],
    integrations: [
      'HubSpot',
      'Salesforce',
      'GoHighLevel',
      'Close CRM',
      'Pipedrive',
      'Chili Piper / Calendly',
    ],
  },
  {
    industry_slug: 'ivr',
    name: 'Interactive Voice Response',
    categoryTag: 'Conversational Telephony & Smart Routing',
    icon_name: 'MessageSquare',
    accent: 'cyan',
    cover_image_url:
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop',
    headline: 'Conversational IVR 2.0 — Kill "Press 1 for Sales" Forever',
    subhead:
      'Replace rigid touch-tone phone trees with natural-language voice routing that understands caller intent in one sentence, resolves routine requests, and eliminates misrouted transfers.',
    problem:
      'Multi-level DTMF phone menus ("Press 1 for..., Press 4 for...") frustrate callers, cause high hang-up rates, and still misroute 30%+ of calls—forcing customers to repeat their story across three departments.',
    deepDive: {
      title: 'From Rigid Touch-Tone Trees to Intent-Aware Voice Reception',
      paragraphs: [
        'Legacy PBX phone trees force callers to guess which internal department owns their problem. Callers mash "0" to escape the maze, overwhelming front-desk receptionists and landing billing questions in the sales queue.',
        'Conversational IVR 2.0 greets every caller in natural speech: "How can I help you today?" Callers speak normally—even interrupting mid-sentence (barge-in)—and the AI classifies intent, answers hours/location/status questions directly, or SIP-transfers the call to the exact specialist extension with a screen-pop summary.',
      ],
    },
    scenarios: [
      {
        title: 'Multi-Location & Multi-Department Smart Reception',
        trigger: 'Caller dials the main corporate or clinic switchboard.',
        action:
          'Understands free-form requests ("I need to reschedule my Austin appointment and check parking") in a single turn.',
        outcome: 'Answers the parking question immediately and routes directly to the Austin scheduling queue.',
      },
      {
        title: 'Self-Service Status, Balance & FAQ Deflection',
        trigger: 'Routine calls asking about business hours, application status, or invoice portals.',
        action:
          'Resolves 100% of informational queries conversationally and texts helpful links on request.',
        outcome: 'Up to 80% fewer repetitive calls hitting human extensions.',
      },
      {
        title: 'Zero-Repeat Warm SIP Department Transfer',
        trigger: 'Caller needs a specialized billing, VIP, or technical engineering desk.',
        action:
          'Captures account ID and issue summary once, then SIP-transfers with webhook context to the agent desktop.',
        outcome: 'Zero cold transfers and dramatically shorter average handle time (AHT).',
      },
    ],
    sampleDialogue: {
      context: 'Main switchboard call replacing a 6-option legacy touch-tone menu',
      agentName: 'Maya — Smart Switchboard AI',
      turns: [
        {
          speaker: 'AI',
          text: 'Welcome to Metro Health Partners. You can speak naturally—how can I direct your call or help you today?',
        },
        {
          speaker: 'Caller',
          text: 'Hi, I need to get a copy of my MRI imaging sent over to my orthopedic specialist.',
        },
        {
          speaker: 'AI',
          text: 'I can get you straight to Medical Records for imaging release—no phone menu needed. Was your MRI completed at our Downtown or Northside imaging center?',
        },
        {
          speaker: 'Caller',
          text: 'At the Northside center last Tuesday.',
        },
        {
          speaker: 'AI',
          text: 'Got it. Would you also like me to text you our 60-second online release form link right now in case you want instant electronic transfer, or connect you live to Northside Records?',
        },
        {
          speaker: 'Caller',
          text: 'Oh, text me the instant online form—that is way easier!',
        },
      ],
    },
    features: [
      'Natural-language intent classification in a single spoken sentence',
      'Sub-second barge-in & interruption handling over SIP / PSTN',
      'Direct self-service resolution + instant SMS link deflection',
      'Multi-location, skill-based & business-hours routing logic',
      'SIP REFER / warm transfer with CRM & CTI screen-pop payload',
      'Drop-in compatibility with Twilio, RingCentral, Zoom Phone & 3CX',
    ],
    flow: [
      {
        step: 'Caller Dials Existing Business Number',
        desc: 'Connects over SIP trunk or call forwarding with zero changes to your published phone numbers.',
      },
      {
        step: 'Open-Ended Natural Greeting',
        desc: 'Caller states what they need in plain speech instead of listening to a 45-second button menu.',
      },
      {
        step: 'Self-Serve or Intent Classification',
        desc: 'Resolves routine requests directly via API/SMS or identifies the exact target skill group.',
      },
      {
        step: 'Context-Attached SIP Handoff',
        desc: 'Routes complex calls to the right specialist first try with caller context attached.',
      },
    ],
    results: [
      { stat: '80%', label: 'Routine inquiry self-service' },
      { stat: '60%', label: 'Fewer misrouted transfers' },
      { stat: '4.8★', label: 'Caller experience rating' },
    ],
    integrations: [
      'Twilio Elastic SIP',
      'RingCentral',
      'Zoom Phone',
      'Five9 / Genesys',
      '3CX',
      'Webhooks / REST CTI',
    ],
  },
  {
    industry_slug: 'scheduling',
    name: 'Appointment Scheduling',
    categoryTag: 'Calendar Automation & No-Show Prevention',
    icon_name: 'Calendar',
    accent: 'violet',
    cover_image_url:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
    headline: '24/7 Voice Appointment Booking, Rescheduling & No-Show Recovery',
    subhead:
      'Check real-time availability across staff calendars, handle timezones and buffer rules automatically, confirm upcoming visits, and backfill last-minute cancellations.',
    problem:
      'Clinics, med-spas, dealerships, and service firms lose 15–30% of revenue to unbooked after-hours calls, phone-tag scheduling friction, and unconfirmed no-shows that leave expensive provider chairs and bays empty.',
    deepDive: {
      title: 'Full-Lifecycle Calendar Management Over the Phone',
      paragraphs: [
        'Static booking links only convert prospects who want to self-schedule online; millions of high-value clients still pick up the phone to ask a quick question before committing to an appointment time, or call in while driving to move an existing slot.',
        'Our Scheduling Voice AI reads live availability across Google Calendar, Outlook/Microsoft 365, Calendly, Acuity, or practice-management calendars, negotiates natural time preferences ("anything Thursday afternoon after 3?"), enforces appointment-type durations and buffer rules, and runs proactive 24-hour confirmation & waitlist-backfill calls.',
      ],
    },
    scenarios: [
      {
        title: 'Inbound Multi-Provider Appointment Booking',
        trigger: 'Client calls to book a consultation, demo, or treatment session.',
        action:
          'Matches service type to required duration & provider availability, negotiates preferred day/time, and locks the slot.',
        outcome: 'Calendar invite + SMS confirmation sent before the call even ends.',
      },
      {
        title: 'Frictionless Voice Rescheduling & Cancellations',
        trigger: 'Existing client calls running late or needing to move tomorrow’s 10 AM slot.',
        action:
          'Locates their existing booking by phone number, frees up the old slot, and moves them into the next open window.',
        outcome: 'Zero front-desk interruption and open slot immediately available for waitlist backfill.',
      },
      {
        title: 'Proactive Confirmation & No-Show Prevention',
        trigger: '24 hours before high-value scheduled appointments.',
        action:
          'Places a brief confirmation call/SMS check; if the client cannot make it, reschedules on the spot.',
        outcome: 'Up to 70% reduction in unannounced no-shows.',
      },
    ],
    sampleDialogue: {
      context: 'Inbound call to reschedule an existing consultation and check afternoon slots',
      agentName: 'Sora — Scheduling Coordinator',
      turns: [
        {
          speaker: 'AI',
          text: 'Hi Rachel! Thanks for calling Elevate Wellness—I see you have a 60-minute consultation booked tomorrow at 10:00 AM. Are you calling about that visit?',
        },
        {
          speaker: 'Caller',
          text: 'Yes, a work meeting came up tomorrow morning. Do you have anything Thursday afternoon instead?',
        },
        {
          speaker: 'AI',
          text: 'No problem at all—let me check Thursday afternoon for a 60-minute slot... I have 2:00 PM or 4:15 PM open with Dr. Miller. Would either of those work?',
        },
        {
          speaker: 'Caller',
          text: '4:15 PM on Thursday is perfect.',
        },
        {
          speaker: 'AI',
          text: 'All set! I have moved your appointment from tomorrow morning to Thursday at 4:15 PM and sent an updated calendar invite and text confirmation.',
        },
        {
          speaker: 'Caller',
          text: 'That took thirty seconds—thank you!',
        },
      ],
    },
    features: [
      'Real-time multi-calendar availability & conflict checking',
      'Automatic timezone detection & appointment-duration rules',
      'Instant caller lookup for 30-second reschedules & cancellations',
      '24-hour voice + SMS confirmation & prep-instruction reminders',
      'Automated waitlist outreach to backfill canceled slots',
      'Missed-appointment recovery calls to rebook no-shows',
    ],
    flow: [
      {
        step: 'Caller & Service Identification',
        desc: 'Recognizes returning callers by phone number or asks new callers which appointment type they need.',
      },
      {
        step: 'Live Calendar Slot Negotiation',
        desc: 'Queries real-time free/busy windows with buffer rules and offers natural time options.',
      },
      {
        step: 'Instant Booking & Invite Dispatch',
        desc: 'Writes the event directly to your calendar system and sends SMS/email confirmation.',
      },
      {
        step: 'Confirmation & Waitlist Loop',
        desc: 'Confirms attendance ahead of time and automatically fills any freed-up cancellations.',
      },
    ],
    results: [
      { stat: '45%', label: 'More appointments captured' },
      { stat: '70%', label: 'Reduction in no-shows' },
      { stat: '24/7', label: 'Live booking & rescheduling' },
    ],
    integrations: [
      'Google Calendar',
      'Calendly',
      'Cal.com',
      'Microsoft Outlook 365',
      'GoHighLevel',
      'Acuity Scheduling',
    ],
  },
  {
    industry_slug: 'crm-integration',
    name: 'CRM & ERP Integration',
    categoryTag: 'Data Pipelines, Middleware & Sync',
    icon_name: 'Database',
    accent: 'emerald',
    cover_image_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    headline: 'Two-Way CRM, ERP & Webhook Connectivity for Every Call',
    subhead:
      'Turn unstructured voice conversations into clean, structured JSON—updating CRM stages, enriching contact records, querying ERP inventory live, and triggering downstream automations.',
    problem:
      'Even great phone conversations lose value when reps forget to log notes, mistype emails, leave deal stages stale, or lack live ERP data during the call—creating revenue blind spots and hours of manual admin work.',
    deepDive: {
      title: 'Voice Agents Wired Directly Into Your System of Record',
      paragraphs: [
        'A standalone voice bot that emails you a wall-of-text transcript still creates manual data-entry chores for your ops team. Enterprise voice automation only compounds ROI when the agent can both READ live context before speaking and WRITE structured fields back the second the call ends.',
        'We architect bi-directional middleware pipelines (via n8n, Make, custom TypeScript webhooks, and native REST/GraphQL connectors) so your AI voice agents pull caller history, open orders, or assigned rep owners in <200ms at call start—and push extracted custom fields, sentiment scores, recordings, and pipeline stage transitions automatically upon hangup.',
      ],
    },
    scenarios: [
      {
        title: 'Pre-Call CRM Context Hydration',
        trigger: 'Inbound or outbound call connects with an existing phone number.',
        action:
          'Fetches contact owner, lifecycle stage, last purchase, and open ticket status in <200ms to personalize the greeting.',
        outcome: 'Every caller is greeted like a known VIP with zero repetitive basic questions.',
      },
      {
        title: 'Post-Call Structured Schema Extraction',
        trigger: 'Voice call finishes.',
        action:
          'Extracts typed JSON fields (budget, timeline, product interest, call outcome, next action date) from the transcript.',
        outcome: '100% clean CRM property updates, deal stage progression, and rep task creation.',
      },
      {
        title: 'Downstream Multi-System Orchestration',
        trigger: 'AI marks a call outcome as "Qualified — Proposal Requested" or "Urgent Escalation".',
        action:
          'Fires webhooks to generate a draft quote in Stripe/PandaDoc, post a Slack deal alert, and enroll follow-up sequences.',
        outcome: 'End-to-end revenue operations execute in seconds with zero human copy-pasting.',
      },
    ],
    sampleDialogue: {
      context: 'Live mid-call ERP inventory check + automated HubSpot deal update',
      agentName: 'Sync — Wholesale Desk AI',
      turns: [
        {
          speaker: 'AI',
          text: 'Hi Carlos, welcome back to Atlas Supply—I see your last pallet order for 3/4-inch copper fittings shipped last month. Looking to restock or quote a new job?',
        },
        {
          speaker: 'Caller',
          text: 'Need to check if you have 400 units of SKU CP-750 in stock at the Dallas warehouse for Friday pickup.',
        },
        {
          speaker: 'AI',
          text: 'Checking live Dallas warehouse inventory on CP-750 now... We have 620 units on the shelf at your contractor tier of $4.80 per unit.',
        },
        {
          speaker: 'Caller',
          text: 'Awesome, can you put a 24-hour hold on 400 units and send the quote to my email?',
        },
        {
          speaker: 'AI',
          text: 'Done—reserved 400 units of CP-750 under your Atlas account and emailed quote #Q-9042 to carlos@texmech.com, plus notified your rep Sam.',
        },
        {
          speaker: 'Caller',
          text: 'Spot on, appreciate it!',
        },
      ],
    },
    features: [
      'Sub-200ms pre-call CRM & ERP context lookup on caller ID',
      'Strict JSON-schema post-call field extraction & validation',
      'Two-way HubSpot, Salesforce, GoHighLevel & Pipedrive sync',
      'Live mid-call ERP inventory, pricing & order-status tool calls',
      'Idempotent webhook pipelines via n8n, Make & custom APIs',
      'Automated Slack deal-room alerts & follow-up task creation',
    ],
    flow: [
      {
        step: 'Pre-Call Context Fetch',
        desc: 'Queries CRM/ERP by phone number as the call rings to inject account history into the agent prompt.',
      },
      {
        step: 'Mid-Call Function Calling',
        desc: 'Executes secure authenticated API requests for live inventory, pricing, or account updates.',
      },
      {
        step: 'Structured Transcript Parsing',
        desc: 'Transforms raw conversation into validated custom CRM fields, tags, and disposition codes.',
      },
      {
        step: 'Multi-App Webhook Fan-Out',
        desc: 'Updates CRM deal stages, archives recording URLs, and triggers Slack/email/ERP workflows.',
      },
    ],
    results: [
      { stat: '100%', label: 'Calls logged with zero typing' },
      { stat: '99.2%', label: 'Structured field accuracy' },
      { stat: '10hrs', label: 'Admin work saved per rep/wk' },
    ],
    integrations: [
      'HubSpot',
      'Salesforce',
      'GoHighLevel',
      'n8n',
      'Make.com',
      'NetSuite / Custom REST',
    ],
  },
  {
    industry_slug: 'multi-language',
    name: 'Multi-Language Support',
    categoryTag: 'Global Voice CX & Real-Time Localization',
    icon_name: 'Globe',
    accent: 'rose',
    cover_image_url:
      'https://images.unsplash.com/photo-1526280760714-f9e8b26f318f?q=80&w=1200&auto=format&fit=crop',
    headline: 'Fluent 30+ Language Voice Agents with Bilingual CRM Notes',
    subhead:
      'Detect a caller’s spoken language automatically in the first sentence, converse with native pronunciation and cultural nuance, and log English + native summaries to your team.',
    problem:
      'Serving Spanish, French, Mandarin, Arabic, German, or Portuguese-speaking callers traditionally requires separate staffing rosters, expensive per-minute interpreter lines, and long hold queues—leaving diverse local and global markets underserved.',
    deepDive: {
      title: 'Native Multilingual Fluency Without Separate Call-Center Teams',
      paragraphs: [
        'Third-party over-the-phone interpreter services charge steep per-minute fees and make every 3-minute call drag out to 10 awkward minutes. Worse, non-English leads on local service or healthcare websites frequently bounce when nobody on shift speaks their preferred language.',
        'Our Multi-Language Voice AI pairs multilingual speech recognition (ASR) with native neural voices across 30+ languages—automatically switching mid-call if a caller responds in Spanish, French, Portuguese, German, Hindi, Arabic, or Mandarin—while translating all extracted CRM notes and summaries cleanly into English for your operations team.',
      ],
    },
    scenarios: [
      {
        title: 'Automatic Mid-Call Language Detection & Switch',
        trigger: 'Caller dials your main English number and asks "¿Hablan español?" or starts speaking French.',
        action:
          'Switches voice and language model seamlessly in <500ms without transferring or hanging up.',
        outcome: 'Complete qualification or booking completed in the caller’s native language.',
      },
      {
        title: 'International Time-Zone Coverage',
        trigger: 'Prospects in LATAM, Europe, MENA, or APAC call outside US business hours.',
        action:
          'Answers 24/7 in regional native accents, qualifies enterprise inquiries, and books localized AE calendars.',
        outcome: 'Global pipeline expansion without opening overseas call centers.',
      },
      {
        title: 'Bilingual Transcript & English CRM Translation',
        trigger: 'Call conducted entirely in Spanish, Portuguese, or Mandarin concludes.',
        action:
          'Stores original-language transcript for QA AND writes a clean English structured summary into your CRM.',
        outcome: 'Monolingual internal teams can fulfill every international or bilingual order effortlessly.',
      },
    ],
    sampleDialogue: {
      context: 'Seamless mid-call switch from English greeting to fluent Spanish booking + English CRM sync',
      agentName: 'Elena — Bilingual Concierge',
      turns: [
        {
          speaker: 'AI',
          text: 'Thank you for calling BrightSmile Dental—how can I help you today?',
        },
        {
          speaker: 'Caller',
          text: 'Hola, disculpe—¿tienen a alguien que hable español para agendar una cita?',
        },
        {
          speaker: 'AI',
          text: '¡Claro que sí! Con mucho gusto le ayudo en español. ¿Busca agendar una limpieza general o tiene alguna molestia dental urgente?',
        },
        {
          speaker: 'Caller',
          text: 'Una limpieza y revisión para mi mamá esta semana por la tarde, por favor.',
        },
        {
          speaker: 'AI',
          text: 'Perfecto. Tenemos espacio este jueves a las 3:30 PM con la Dra. Gómez. ¿Le reservo ese horario y le envío la confirmación por mensaje de texto?',
        },
        {
          speaker: 'Caller',
          text: 'Sí, el jueves a las 3:30 PM está excelente. ¡Muchas gracias!',
        },
      ],
    },
    features: [
      'Automatic language detection & mid-call switching (<500ms)',
      'Native neural voices across 30+ languages & regional accents',
      'Accent-tolerant speech recognition for noisy mobile connections',
      'Dual-output logging: original transcript + English CRM summary',
      'Localized date, currency, address & honorific formatting',
      'Zero per-minute interpreter bridge fees or hold delays',
    ],
    flow: [
      {
        step: 'Universal Line Connection',
        desc: 'Caller dials your primary phone number or regional local DID from anywhere in the world.',
      },
      {
        step: 'Instant Language & Accent Match',
        desc: 'Detects spoken language automatically in the opening turn and adapts voice + grammar immediately.',
      },
      {
        step: 'Full Workflow Execution',
        desc: 'Completes qualification, support lookup, or calendar booking natively in that language.',
      },
      {
        step: 'Translated Operations Handoff',
        desc: 'Writes clean English fields + bilingual transcripts into your CRM so any team member can act on it.',
      },
    ],
    results: [
      { stat: '30+', label: 'Languages spoken natively' },
      { stat: '98%', label: 'Multilingual ASR accuracy' },
      { stat: '3x', label: 'Non-English lead conversion' },
    ],
    integrations: [
      'ElevenLabs Multilingual',
      'Deepgram Nova',
      'Twilio Global Voice',
      'HubSpot',
      'Salesforce',
      'Zendesk',
    ],
  },
  {
    industry_slug: 'custom-dashboards',
    name: 'Custom AI Dashboards',
    categoryTag: 'Voice Telemetry, QA & ROI Analytics',
    icon_name: 'BarChart',
    accent: 'rose',
    cover_image_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    headline: 'Real-Time Voice AI Telemetry, QA Scoring & Attribution Dashboards',
    subhead:
      'Monitor live call outcomes, booking rates, per-minute unit costs, caller sentiment, and top objections in custom executive dashboards built for your exact KPIs.',
    problem:
      'Default voice-platform logs only show raw call durations and technical webhooks—leaving founders, agencies, and ops leaders blind to true booking conversion rates, cost-per-qualified-appointment, objection trends, and prompt regressions.',
    deepDive: {
      title: 'Turn Every Voice Conversation Into Measurable Business Intelligence',
      paragraphs: [
        'You cannot optimize a voice agent’s conversion rate if insights are buried inside thousands of individual MP3 recordings. Ops leaders and agency clients need clear answers at a glance: How many appointments were booked today? Which ad campaign drove the highest connect rate? Where in the script are callers dropping off?',
        'We build bespoke Next.js & Supabase analytics portals connected to Vapi, Retell, Twilio, and your CRM—featuring searchable call players, automated LLM quality-assurance rubrics (0–100 call scoring), objection frequency charts, live cost/ROI tracking, and white-label client reporting views.',
      ],
    },
    scenarios: [
      {
        title: 'Executive ROI & Cost-per-Booked-Call Command Center',
        trigger: 'Leadership reviews daily/weekly voice automation performance.',
        action:
          'Aggregates telephony spend, LLM minutes, connect rates, and booked revenue attribution in one live view.',
        outcome: 'Crystal-clear proof of ROI down to exact cost per booked appointment.',
      },
      {
        title: 'Automated 100%-Call QA & Prompt Optimization',
        trigger: 'Every completed call is evaluated asynchronously by an QA rubric.',
        action:
          'Flags calls with high latency, interruptions, unanswered objections, or negative caller sentiment automatically.',
        outcome: 'Engineers spot and fix prompt edge cases in hours instead of listening to random 2% call samples.',
      },
      {
        title: 'Client-Facing Agency Reporting Portals',
        trigger: 'AI automation agencies or multi-branch brands need transparent stakeholder reporting.',
        action:
          'Provides role-scoped dashboards with audio playback, searchable transcripts, and weekly digest exports.',
        outcome: 'Higher client retention and effortless executive stakeholder trust.',
      },
    ],
    sampleDialogue: {
      context: 'Example post-call AI QA telemetry insight surfaced automatically on the dashboard',
      agentName: 'Pulse — Voice QA Engine',
      turns: [
        {
          speaker: 'Caller',
          text: 'Wait—do you integrate with ServiceTitan or only Google Calendar?',
        },
        {
          speaker: 'AI',
          text: 'We integrate natively with ServiceTitan—jobs, customer records, and technician zones sync in real time.',
        },
        {
          speaker: 'Caller',
          text: 'Oh nice, that was our main blocker with the last vendor. Let us book a demo.',
        },
        {
          speaker: 'AI',
          text: 'Awesome—I have Tuesday at 10:00 AM Central open with our solutions lead. Shall I lock that in?',
        },
        {
          speaker: 'Caller',
          text: 'Yes, book Tuesday at 10 AM.',
        },
        {
          speaker: 'AI',
          text: '[Dashboard Telemetry Tagged → Outcome: Booked | Key Objection Overcome: ServiceTitan Integration | Sentiment: +0.92 | Call Cost: $0.19]',
        },
      ],
    },
    features: [
      'Live KPI cards: calls, connect %, booked meetings & cost/outcome',
      'Searchable audio player with synchronized speaker transcripts',
      'Automated 100%-coverage QA rubric & hallucination alerts',
      'Top caller objections & drop-off stage funnel analytics',
      'Campaign / UTM source attribution tied to CRM revenue',
      'Scheduled Slack & email weekly executive summary digests',
    ],
    flow: [
      {
        step: 'End-of-Call Webhook Ingestion',
        desc: 'Captures audio URL, stereo transcript, latency telemetry, tool calls, and token costs in Supabase.',
      },
      {
        step: 'Automated QA & Topic Tagging',
        desc: 'Scores script adherence, sentiment, objection category, and conversion disposition.',
      },
      {
        step: 'Live Dashboard Aggregation',
        desc: 'Updates real-time charts, funnel conversion stages, and searchable call tables.',
      },
      {
        step: 'Proactive Alerts & Weekly Digests',
        desc: 'Sends Slack notifications on flagged calls and delivers automated ROI reports to stakeholders.',
      },
    ],
    results: [
      { stat: '100%', label: 'Calls automatically QA-scored' },
      { stat: '+24%', label: 'Prompt conversion lift' },
      { stat: 'Real-time', label: 'Cost & ROI attribution' },
    ],
    integrations: [
      'Vapi Webhooks',
      'Retell Analytics',
      'Supabase / Postgres',
      'Next.js Portals',
      'Slack Alerts',
      'HubSpot / Stripe',
    ],
  },
]

export const RICH_USE_CASES_BY_SLUG: Record<string, RichUseCaseSpec> = Object.fromEntries(
  RICH_USE_CASES.map((item) => [item.industry_slug, item])
)

/**
 * Merges a database UseCaseRecord (if present) with rich domain-specific content
 * so admin edits always override core fields while every use case retains bespoke
 * deep-dive copy, realistic dialogue, scenarios, and ecosystem integrations.
 */
export function resolveRichUseCase(
  slug: string,
  dbRecord?: Partial<UseCaseRecord> | null
): RichUseCaseSpec | null {
  const preset = RICH_USE_CASES_BY_SLUG[slug]
  if (!dbRecord && !preset) {
    return null
  }

  if (preset && !dbRecord) {
    return preset
  }

  if (preset && dbRecord) {
    return {
      ...preset,
      id: dbRecord.id || preset.id,
      created_at: dbRecord.created_at || preset.created_at,
      name: dbRecord.name?.trim() || preset.name,
      headline: dbRecord.headline?.trim() || preset.headline,
      subhead: dbRecord.subhead?.trim() || preset.subhead,
      problem: dbRecord.problem?.trim() || preset.problem,
      cover_image_url: dbRecord.cover_image_url?.trim() || preset.cover_image_url,
      icon_name: dbRecord.icon_name?.trim() || preset.icon_name,
      features:
        Array.isArray(dbRecord.features) && dbRecord.features.length > 0
          ? dbRecord.features
          : preset.features,
      flow:
        Array.isArray(dbRecord.flow) && dbRecord.flow.length > 0
          ? dbRecord.flow
          : preset.flow,
      results:
        Array.isArray(dbRecord.results) && dbRecord.results.length > 0
          ? dbRecord.results
          : preset.results,
    }
  }

  // Custom use case created in Admin that does not match one of the 12 presets:
  // synthesize tailored, non-generic sections directly from its specific fields!
  const custom = dbRecord!
  const customName = custom.name?.trim() || slug
  const customFeatures =
    Array.isArray(custom.features) && custom.features.length > 0
      ? custom.features
      : ['24/7 autonomous call handling', 'Instant qualification & routing', 'Real-time CRM logging']
  const customFlow =
    Array.isArray(custom.flow) && custom.flow.length > 0
      ? custom.flow
      : [
          {
            step: 'Inbound or Outbound Trigger',
            desc: `Caller connects or submits an inquiry for ${customName}.`,
          },
          {
            step: 'Conversational Qualification',
            desc: `AI captures structured ${customName} requirements naturally.`,
          },
          {
            step: 'Action & System Sync',
            desc: 'Books calendar slots, routes urgent calls, and logs data to CRM.',
          },
        ]

  return {
    id: custom.id,
    created_at: custom.created_at,
    industry_slug: custom.industry_slug || slug,
    name: customName,
    categoryTag: `${customName} Voice Automation`,
    icon_name: custom.icon_name?.trim() || 'Briefcase',
    accent: 'blue',
    cover_image_url:
      custom.cover_image_url?.trim() ||
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
    headline: custom.headline || `${customName} AI Voice Automation`,
    subhead:
      custom.subhead ||
      `Custom AI voice agents engineered specifically for ${customName} workflows.`,
    problem:
      custom.problem ||
      `Manual call handling slows down ${customName} response times and leaves revenue on the table.`,
    deepDive: {
      title: `How AI Voice Agents Operate in ${customName}`,
      paragraphs: [
        custom.subhead ||
          `Every ${customName} conversation carries domain-specific context, qualification rules, and scheduling logic that generic answering services miss.`,
        `By combining low-latency neural voice synthesis with real-time tool calling, this ${customName} deployment executes ${customFeatures
          .slice(0, 3)
          .join(', ')
          .toLowerCase()} seamlessly around the clock.`,
      ],
    },
    scenarios: customFlow.slice(0, 3).map((item, idx) => ({
      title: item.step,
      trigger: `Stage ${idx + 1} of the ${customName} workflow`,
      action: item.desc,
      outcome: customFeatures[idx] || 'Automated resolution & instant CRM sync.',
    })),
    sampleDialogue: {
      context: `Live ${customName} voice automation flow`,
      agentName: `${customName} AI Specialist`,
      turns: [
        {
          speaker: 'AI',
          text: `Hello! Thanks for reaching out to our ${customName} desk—how can I help you today?`,
        },
        {
          speaker: 'Caller',
          text: `Hi, I wanted to get started and check availability this week.`,
        },
        {
          speaker: 'AI',
          text: `I can take care of that right now. Let me ask two quick questions so we tailor everything to your exact needs.`,
        },
        {
          speaker: 'Caller',
          text: `Sounds great, go ahead.`,
        },
      ],
    },
    features: customFeatures,
    flow: customFlow,
    results:
      Array.isArray(custom.results) && custom.results.length > 0
        ? custom.results
        : [{ stat: '24/7', label: 'Autonomous coverage' }],
    integrations: ['CRM Webhooks', 'Google Calendar', 'Calendly', 'Twilio SIP', 'n8n'],
  }
}

/**
 * Merges published DB use cases with the 12 rich defaults (preserving DB order & edits first,
 * then appending any remaining built-in slugs that haven't been added to the DB yet).
 */
export function mergePublishedUseCases(
  dbRecords?: Partial<UseCaseRecord>[] | null
): RichUseCaseSpec[] {
  if (!dbRecords || dbRecords.length === 0) {
    return RICH_USE_CASES
  }

  const seen = new Set<string>()
  const merged: RichUseCaseSpec[] = []

  for (const row of dbRecords) {
    const slug = row.industry_slug?.trim()
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    const resolved = resolveRichUseCase(slug, row)
    if (resolved) merged.push(resolved)
  }

  for (const preset of RICH_USE_CASES) {
    if (!seen.has(preset.industry_slug)) {
      seen.add(preset.industry_slug)
      merged.push(preset)
    }
  }

  return merged
}
