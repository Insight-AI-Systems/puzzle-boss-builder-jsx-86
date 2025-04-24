
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
  },
  {
    id: "AUTH-02",
    title: "Email Verification Flow",
    description: "Need to redirect verified users to login page instead of homepage after email verification for clearer user flow.",
    status: "open",
    severity: "medium",
    category: "ui",
    workaround: "Manually guide users to the login page after verification"
  },
  {
    id: "ADMIN-01",
    title: "User Management Table Sorting",
    description: "Add column sorting functionality to the user management table for better data organization.",
    status: "open",
    severity: "low",
    category: "feature"
  },
  {
    id: "PUZZLE-02",
    title: "Dynamic Puzzle Pricing",
    description: "Implement increasing puzzle prices as closing date approaches to enhance game dynamics and revenue.",
    status: "open",
    severity: "medium",
    category: "feature"
  },
  {
    id: "ADMIN-02",
    title: "User Search Reset",
    description: "Clear user management search after search completion to improve user experience.",
    status: "open",
    severity: "low",
    category: "ui"
  },
  {
    id: "ADMIN-03",
    title: "Dashboard Tab Cleanup",
    description: "Remove monitoring and overview tabs from super admin dashboard for streamlined interface.",
    status: "open",
    severity: "low",
    category: "ui"
  },
  {
    id: "UI-01",
    title: "Account Section Consolidation",
    description: "Merge profile and membership sections in My Account for better user experience.",
    status: "open",
    severity: "medium",
    category: "ui"
  },
  {
    id: "UI-02",
    title: "Admin Dashboard Link Removal",
    description: "Remove admin dashboard tab from account dropdown for cleaner navigation.",
    status: "open",
    severity: "low",
    category: "ui"
  },
  {
    id: "FEATURE-01",
    title: "Adult Content Section",
    description: "Implement age-restricted puzzle section requiring credit card verification for access.",
    status: "open",
    severity: "medium",
    category: "feature"
  },
  {
    id: "PAYMENT-01",
    title: "Cryptocurrency Payments",
    description: "Add support for cryptocurrency payments to expand payment options.",
    status: "open",
    severity: "medium",
    category: "feature"
  },
  {
    id: "SUPPORT-01",
    title: "OpenSupports Integration",
    description: "Evaluate and implement OpenSupports for a comprehensive ticket system.",
    status: "open",
    severity: "medium",
    category: "feature"
  }
];
