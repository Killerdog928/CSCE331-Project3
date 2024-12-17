export type SiteConfig = typeof siteConfig;

/**
 * Configuration object for the site.
 *
 * @property {string} name - The name of the site.
 * @property {string} description - A brief description of the site.
 * @property {Array<{label: string, href: string}>} navItems - Navigation items for the main navigation bar.
 * @property {Array<{label: string, href: string}>} navMenuItems - Navigation items for the user menu.
 * @property {Object} links - External links related to the site.
 * @property {string} links.github - URL to the GitHub repository.
 * @property {string} links.twitter - URL to the Twitter profile.
 * @property {string} links.docs - URL to the documentation.
 * @property {string} links.discord - URL to the Discord server.
 * @property {string} links.sponsor - URL to the sponsorship page.
 */
export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
