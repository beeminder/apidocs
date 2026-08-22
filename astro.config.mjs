import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { LEGACY_HASH_SHIM } from './src/legacy-anchors.js';

// Every user-facing label below is copied verbatim from the pre-migration docs
// (page <h1>s and the Slate toc_footers). No new copy is introduced here.
export default defineConfig({
  site: 'https://api.beeminder.com',
  integrations: [
    starlight({
      title: 'Beeminder API Reference',
      logo: { src: './src/assets/bee_logo_110.png', alt: 'Beeminder' },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/theme.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/beeminder/apidocs' }],
      editLink: { baseUrl: 'https://github.com/beeminder/apidocs/edit/master/' },
      head: [{ tag: 'script', content: LEGACY_HASH_SHIM }],
      sidebar: [
        { label: 'Introduction', link: '/' },
        { label: 'Authentication', link: '/authentication/' },
        { label: 'User Resource', link: '/user/' },
        { label: 'Goal Resource', link: '/goal/' },
        { label: 'Datapoint Resource', link: '/datapoint/' },
        { label: 'Charge Resource', link: '/charge/' },
        { label: 'Webhooks', link: '/webhooks/' },
        { label: 'URL-Based Goal Creation', link: '/url-goal-creation/' },
        { label: 'Errors', link: '/errors/' },
        { label: 'Beeminder', link: 'https://www.beeminder.com' },
        { label: 'Get an API key', link: 'https://www.beeminder.com/apps/new' },
      ],
    }),
  ],
});
