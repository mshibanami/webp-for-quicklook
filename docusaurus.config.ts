import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkCjkFriendly from 'remark-cjk-friendly';
import { SUPPORTED_LOCALES, isSupportedLocale } from './src/constants';

const defaultLocale = 'en';
const envLocale = process.env.DOCUSAURUS_CURRENT_LOCALE;
const locale = (envLocale && envLocale !== 'undefined' ? envLocale : defaultLocale);
if (!isSupportedLocale(locale)) {
  throw new Error(`Unsupported locale: ${locale}`);
}
const projectName = 'webp-for-quicklook';
const baseUrl = `/${projectName}/`;
const localedBaseUrl = `${baseUrl}${locale == 'en' ? '' : `${locale}/`}`;

const config: Config = {
  title: 'WebP for Quick Look',
  tagline: translatedTagline(locale),
  url: 'https://mshibanami.github.io/',
  favicon: '/img/icon/favicon.ico',
  headTags: [
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '96x96', href: `${localedBaseUrl}img/icon/favicon-96x96.png` } },
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/svg+xml', href: `${localedBaseUrl}img/icon/favicon.svg` } },
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', sizes: '180x180', href: `${localedBaseUrl}img/icon/apple-touch-icon.png` } },
  ],
  baseUrl: baseUrl,
  organizationName: 'mshibanami',
  projectName: projectName,
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: defaultLocale,
    locales: [...SUPPORTED_LOCALES],
  },
  plugins: [
    'docusaurus-plugin-sass',
    'docusaurus-plugin-image-zoom',
  ],
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '',
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: false,
          sidebarCollapsed: false,
          remarkPlugins: [remarkCjkFriendly],
          beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
        },
        blog: {
          path: 'release-notes',
          routeBasePath: '/release-notes',
          blogSidebarTitle: 'Release Notes',
          blogTitle: 'Release Notes',
          blogSidebarCount: 'ALL',
          blogDescription: 'Release notes for WebP for Quick Look.',
          blogListComponent: '@site/src/components/ReleaseNotesList',
          showReadingTime: false,
          feedOptions: {
            type: ['rss', 'atom', 'json'],
            title: 'WebP for Quick Look Release Notes',
            description: 'An RSS feed of changelogs for WebP for Quick Look',
            language: 'en',
          },
          onUntruncatedBlogPosts: 'ignore',
          remarkPlugins: [remarkCjkFriendly],
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WebP for Quick Look',
      logo: {
        alt: 'WebP for Quick Look logo',
        src: 'img/logo.png',
      },
      hideOnScroll: true,
      items: [
        { to: '/introduction', label: 'Docs', position: 'left', activeBaseRegex: `^${localedBaseUrl}(?!release-notes/?)[^/]+` },
        { to: '/release-notes', label: 'Release Notes', position: 'left', activeBaseRegex: `^${localedBaseUrl}release-notes/?.*` },
        {
          type: 'html',
          position: 'right',
          value: `<a href="https://apps.apple.com/app/id6755811088" class="navbar__appstore_button navbar__item_force"><img src="${localedBaseUrl}img/appstore-badge.svg" alt="Go to Apple Store" /></a>`,
          className: "navbar__item_force"
        },
        {
          type: 'localeDropdown',
          position: 'right',
          className: "navbar__item_force"
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `<a class="footer__link-item" href="https://mshibanami.github.io/">© Manabu Nakazawa</a>`,
      links: [
        {
          title: 'Download',
          items: [{
            label: "App Store",
            href: "https://apps.apple.com/app/id6755811088",
          }]
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/introduction',
            },
            {
              label: 'Release Notes',
              to: '/release-notes',
            },
          ]
        },
        {
          title: 'Help',
          items: [
            {
              label: 'Troubleshooting',
              to: '/troubleshooting',
            },
            {
              label: 'FAQ',
              to: '/faq',
            },
            {
              label: "Forums (GitHub)",
              href: "https://github.com/mshibanami/webp-for-quicklook/discussions",
            },
            {
              label: 'Contact Us',
              to: '/contact-us',
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: "GitHub",
              href: "https://github.com/mshibanami/webp-for-quicklook/",
            }
          ]
        },
        {
          title: "Legal",
          items: [
            {
              label: "Privacy Policy",
              to: "/privacy-policy",
            },
            {
              label: "Terms of Use",
              to: "/terms-of-use",
            },
          ]
        }
      ]
    },
    prism: {
      theme: {
        ...prismThemes.github,
        plain: {
          ...prismThemes.github.plain,
          backgroundColor: '#eaecf0',
        },
      },
      darkTheme: {
        ...prismThemes.dracula,
        plain: {
          ...prismThemes.dracula.plain,
          backgroundColor: '#2d3b4e',
        },
      },
    },
    zoom: {
      selector: '.markdown img:not(a img), .zooming img:not(a img)',
      background: {
        light: 'rgb(255, 255, 255, 0.8)',
        dark: 'rgb(50, 50, 50, 0.8)',
      },
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      }
    }
  } satisfies Preset.ThemeConfig,
};

export default config;

function translatedTagline(locale): string {
  switch (locale) {
    default:
      return 'Fixes Native Glitches';
  }
}
