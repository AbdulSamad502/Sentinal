/**
 * Site copy, kept in one place so the voice stays consistent: plain,
 * declarative, specific. The product's own voice is dry and precise.
 */

export interface Feature {
  id: string;
  name: string;
  summary: string;
  body: string;
  /** A concrete detail that shows the feature is real, shown in mono. */
  detail: string;
  /**
   * A one-line signal from a single coherent example session, used by the
   * scroll-driven sequence in Features.tsx. These six read as one real
   * change under supervision, not six unrelated illustrations -- see
   * `featureSequenceVerdict` below for how they resolve.
   */
  signal: string;
}

export const features: Feature[] = [
  {
    id: "action-monitor",
    name: "Action Monitor",
    summary: "Every file write, delete, dependency change and git command.",
    body: "Sentinel enforces a per-project path policy — an allow-list and a deny-list — and checks every action the coding agent takes against it. The git hooks are real hooks, so they capture what git was actually told, flags included, rather than what the agent says it ran.",
    detail: "git push --force origin main   → caught at the hook, as it happened",
    signal: "3 files touched — all inside declared scope",
  },
  {
    id: "risk-analyzer",
    name: "Code Risk Analyzer",
    summary: "Scores the change on signals that predict trouble.",
    body: "Security-sensitive paths, missing tests, unusually large diffs, and how often these particular files have churned recently. Each signal is recorded separately, so the score can always be taken apart and explained rather than trusted on faith.",
    detail: "auth/session.py  ·  security-sensitive  ·  no test touched  ·  4 changes this week",
    signal: "auth/middleware.py — security-sensitive, no test touched",
  },
  {
    id: "change-explainer",
    name: "Change Explainer",
    summary: 'Answers "what did it just do?" from independent observation.',
    body: "The explanation is built from what Sentinel watched happen, not from the coding agent's account of its own work. Asking the agent to summarise its changes is asking the suspect to write the report.",
    detail: "12 files, 340 insertions, 61 deletions, 2 outside the declared scope",
    signal: "Diff matches the stated task — no scope drift",
  },
  {
    id: "project-norms",
    name: "Project Norms",
    summary: "Your project's rules, written in plain English, checked every time.",
    body: 'Declare the rules once — "no hardcoded model ids", "don\'t make frontend design calls without asking" — and they are checked on every change. Rules a regex can catch are checked deterministically and for free. The rest are judged by a model. How serious a violation is, is always written by a human.',
    detail: 'norms.yaml → "no hardcoded model ids"  ·  deterministic  ·  severity: high',
    signal: "No hardcoded model IDs — norm satisfied",
  },
  {
    id: "natural-language",
    name: "Natural-Language Control",
    summary: "Ask in words, from wherever you are.",
    body: "From a terminal, from a Telegram bot on your phone, or from the web dashboard: what went wrong, why it was stopped, whether it can ship. There is also an MCP server, so the coding agent can consult Sentinel before it writes — and every consultation is reported back to you.",
    detail: '"Why did you stop it?"  ·  terminal · Telegram · dashboard · MCP',
    signal: "Agent consulted Sentinel before writing — logged",
  },
  {
    id: "reliability-verdict",
    name: "Reliability Verdict",
    summary: "One verdict, in plain English, with its reasons attached.",
    body: "Every signal combines into a single verdict and the reasons that produced it. It is deterministic: identical signals produce an identical verdict on every run. A supervisor whose answer changes between runs on the same input is not a supervisor.",
    detail: "STOP — deny-listed path written; 1 check could not be verified",
    signal: "5 signals combined — 1 flagged, 4 clear",
  },
];

/**
 * How the six signals above resolve, in the Features scroll sequence. One
 * flagged signal (the untested security-sensitive file) is enough to land
 * on REVIEW rather than SAFE -- deliberately not a clean pass, since an
 * always-green demo would undercut the point the site keeps making about
 * honesty over a good-looking verdict.
 */
export const featureSequenceVerdict = {
  verdict: "review" as const,
  reason: "A human should look at auth/middleware.py before this merges.",
};

export interface Principle {
  id: string;
  title: string;
  body: string;
  /** The failure this principle exists to prevent. */
  consequence: string;
}

export const principles: Principle[] = [
  {
    id: "llm-never-decides",
    title: "The LLM never decides the verdict.",
    body: "The verdict is computed deterministically from the signals. The model narrates what was decided; it never decides.",
    consequence:
      "A supervisor that answers SAFE on one run and STOP on the next, for the same input, is not a supervisor.",
  },
  {
    id: "never-acts",
    title: "Sentinel never acts.",
    body: "It reports. Nothing in it reverts, deletes, blocks, or pushes anything. Even the git hooks are built so that they can never abort your push.",
    consequence:
      "A tool that watches your work should not be able to damage it.",
  },
  {
    id: "unverified-is-not-a-pass",
    title: "An unverified check is never a pass.",
    body: 'Anything Sentinel could not check is shown as "could not verify" — as prominently as the verdict itself — and caps the result at REVIEW.',
    consequence:
      "A clean-looking SAFE while we know we did not look is the worst thing this tool could do.",
  },
];

export interface Runtime {
  id: string;
  name: string;
  detail: string;
  privacy: string;
}

export const runtimes: Runtime[] = [
  {
    id: "local",
    name: "Local",
    detail: "Ollama, running a model on your own machine.",
    privacy: "Nothing leaves the machine.",
  },
  {
    id: "bedrock",
    name: "AWS Bedrock",
    detail: "Your own AWS account and credentials.",
    privacy: "Stays inside your AWS account.",
  },
  {
    id: "hosted",
    name: "Hosted",
    detail: "Bedrock AgentCore, managed for you.",
    privacy: "Zero setup, no AWS account needed.",
  },
];
