export type NavLink = {
  href: string;
  label: string;
  disabled?: boolean;
  badge?: 'coming-soon';
};

export const NAV_LINKS: NavLink[] = [
    { href: '/about',        label: 'About' },
    { href: '/events',       label: 'Events' },

    { href: '/support',      label: 'Clubs', disabled: true, badge: 'coming-soon' },

    { href: '/get-involved', label: 'Get Involved' },
];
