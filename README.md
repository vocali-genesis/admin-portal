## Getting Started

First, populate environment variables

```
// .env
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_KEY=<your supabase api key>
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### More resources:

- [Architecture](https://whimsical.com/frontend-arquitecture-NfUQur2e1WpvWmeH9d1mXU)
- [Genesis wiki](https://www.notion.so/tianlu/Genesis-Wiki-319c67a41c5a4b9cb5f9eadd6f04e5bb)

## Stack

- [Supabase API docs](https://supabase.com/dashboard/project/kxchqnumsodkzillsjhx/api)
- [React Icons](https://react-icons.github.io/react-icons/icons/fa6/)
- [i18n](https://react.i18next.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)

## Sentry

This project uses [Sentry](https://genesis-4s.sentry.io/) for monitoring.
To Test an error you can access to the rout `/sentry`  (TODO: Hide it in production?)
