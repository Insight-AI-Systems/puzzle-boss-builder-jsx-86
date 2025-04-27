import { 
  Home, Users, Puzzle, ImageIcon, FileText, Star, ShoppingCart, 
  Settings, BarChart, User, Mail, Eye, Bell, Trophy, HelpCircle,
  BookOpen, BadgeHelp, ScrollText, Phone, Shield, Layers, Database,
  LayoutDashboard
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
    href: "/puzzles",
  },
  {
    title: "Prizes",
    icon: Trophy,
    href: "/prizes",
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
    roles: ["super_admin"],
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin-dashboard?tab=users",
    roles: ["super_admin"],
  },
  {
    title: "Categories",
    icon: ImageIcon,
    href: "/admin-dashboard?tab=categories",
    roles: ["super_admin", "category_manager"],
  },
  {
    title: "Content",
    icon: FileText,
    href: "/admin-dashboard?tab=content",
    roles: ["super_admin", "social_media_manager"],
  },
  {
    title: "Marketing",
    icon: Star,
    href: "/admin-dashboard?tab=marketing",
    roles: ["super_admin", "social_media_manager"],
  },
  {
    title: "Partners",
    icon: ShoppingCart,
    href: "/admin-dashboard?tab=partners",
    roles: ["super_admin", "partner_manager"],
  },
  {
    title: "Email",
    icon: Mail,
    href: "/admin-dashboard?tab=email",
    roles: ["super_admin"],
  },
  {
    title: "Security",
    icon: Shield,
    href: "/admin-dashboard?tab=security",
    roles: ["super_admin"],
  },
  {
    title: "Monitoring",
    icon: Eye,
    href: "/admin-dashboard?tab=monitoring",
    roles: ["super_admin"],
  },
  {
    title: "Database",
    icon: Database,
    href: "/admin-dashboard?tab=database",
    roles: ["super_admin"],
  },
  {
    title: "Support Admin",
    icon: HelpCircle,
    href: "/support-admin",
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
