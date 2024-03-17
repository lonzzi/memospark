import type { Icon } from 'lucide-react';

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: Icon;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type NavLink = {
  title: string;
  href: string;
  icon?: Icon;
};
