
import { IssueType } from "@/types/issueTypes";

export const knownIssues: IssueType[] = [
  {
    id: "PUZZLE-01",
    title: "Puzzle Piece Touch Controls",
    description: "Mobile touch controls for puzzle pieces need improvement for better accuracy and responsiveness.",
    status: "in-progress",
    severity: "high",
    category: "ui",
    workaround: "Use desktop browser for best puzzle gameplay experience"
  },
  {
    id: "AUTH-01",
    title: "Session Management Edge Cases",
    description: "Authentication flow has edge cases that need handling, particularly around session management.",
    status: "open",
    severity: "medium",
    category: "security"
  },
  {
    id: "PERF-01",
    title: "Data Loading Optimization",
    description: "Multiple components fetch the same data without proper caching mechanisms.",
    status: "open",
    severity: "medium",
    category: "performance"
  },
  {
    id: "SEC-01",
    title: "Admin Access Control",
    description: "System relies on email checking rather than proper role-based security.",
    status: "open",
    severity: "critical",
    category: "security"
  },
  {
    id: "MOBILE-01",
    title: "Incomplete Mobile Responsiveness",
    description: "Some components lack proper mobile responsive design.",
    status: "in-progress",
    severity: "high",
    category: "ui"
  }
];
