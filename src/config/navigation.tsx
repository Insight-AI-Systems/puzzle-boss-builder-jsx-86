
import { 
  Home, Users, Puzzle, ImageIcon, FileText, Star, ShoppingCart, 
  Settings, BarChart, User, Mail, Eye, Bell, Trophy, HelpCircle,
  BookOpen, BadgeHelp, ScrollText, Phone, Shield, Layers, Database,
  LayoutDashboard, TicketIcon, DollarSign, Handshake, FolderKanban,
  Megaphone, Activity, Info
} from 'lucide-react';
import { UserRole } from '@/types/userTypes';

export interface NavSubItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  icon: React.ComponentType;
  href: string;
  roles?: UserRole[];
  subItems?: NavSubItem[];
}

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Puzzles",
    icon: Puzzle,
    href: "/puzzles", // Updated to match route in App.tsx
  },
  {
    title: "Prizes",
    icon: Trophy,
    href: "/prizes-won", // Updated to match route in App.tsx
  },
  {
    title: "How It Works",
    icon: HelpCircle,
    href: "/how-it-works",
  }
];

export const adminNavItems: NavItem[] = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
    roles: ["super_admin", "admin", "category_manager", "partner_manager", "cfo", "social_media_manager"],
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/admin-dashboard?tab=analytics",
    roles: ["super_admin", "admin", "cfo", "category_manager"],
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin-dashboard?tab=users",
    roles: ["super_admin", "admin"],
  },
  {
    title: "Puzzles",
    icon: Puzzle,
    href: "/admin-dashboard?tab=puzzles",
    roles: ["super_admin", "admin", "category_manager"],
  },
  {
    title: "Categories",
    icon: FolderKanban,
    href: "/admin-dashboard?tab=categories",
    roles: ["super_admin", "admin", "category_manager"],
  },
  {
    title: "Content",
    icon: FileText,
    href: "/admin-dashboard?tab=content",
    roles: ["super_admin", "social_media_manager"],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    href: "/admin-dashboard?tab=marketing",
    roles: ["super_admin", "social_media_manager"],
  },
  {
    title: "Partners",
    icon: Handshake,
    href: "/admin-dashboard?tab=partners",
    roles: ["super_admin", "admin", "partner_manager"],
  },
  {
    title: "CFO Dashboard",
    icon: DollarSign,
    href: "/cfo-dashboard",
    roles: ["super_admin", "cfo"],
  },
  {
    title: "Security",
    icon: Shield,
    href: "/admin-dashboard?tab=security",
    roles: ["super_admin"],
  },
  {
    title: "Email",
    icon: Mail,
    href: "/admin-dashboard?tab=email",
    roles: ["super_admin"],
  },
  {
    title: "Monitoring",
    icon: Activity,
    href: "/admin-dashboard?tab=monitoring",
    roles: ["super_admin", "admin"],
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin-dashboard?tab=notifications",
    roles: ["super_admin", "admin"],
  },
  {
    title: "Support Admin",
    icon: TicketIcon,
    href: "/admin-dashboard?tab=tickets",
    roles: ["super_admin", "admin"],
  }
];

export const userNavItems: NavItem[] = [
  {
    title: "My Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Account",
    icon: Settings,
    href: "/account",
  },
  {
    title: "Guides",
    icon: BookOpen,
    href: "/guides/getting-started-guide",
  }
];

export const supportNavItems: NavItem[] = [
  {
    title: "FAQ",
    icon: BadgeHelp,
    href: "/faq",
  },
  {
    title: "Support",
    icon: HelpCircle,
    href: "/support",
  },
  {
    title: "Contact",
    icon: Phone,
    href: "/contact",
  },
  {
    title: "Terms",
    icon: ScrollText,
    href: "/terms",
  }
];
