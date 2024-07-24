## Getting Started

### Load the config.

Our platform is ready to load different configurations, configurations are based in services (our backend / third party integrations) and IU modules (interfaces and frontend functionality).

At the moment we have `modules.config.json` which is the main config, in the future we will have more!
Every config is like a different portal. First we need to load the config

``
pnpm load modules.config.json
```

(Hint: This is using `loader.js` script under the hook)
Will generate a file call `import.ts` that links the selected modules to the rest of the app.

### Prepare the ENV

First, populate environment variables. Take in account that some specific modules will need specific env.
[Staging ENV Variables](https://www.notion.so/tianlu/Genesis-Credentials-b9910de630b443beb6b84d2b38372dac?pvs=4#5343a8ac4579414ab8504abc60911bb1) Request permissions if you don't have them

```
// .env
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_KEY=<your supabase api key>
```

### Run the project

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy the project

Push your changes in a Pull request against `main`, that will fire the `Netlify Deploy` and create a preview view.
Make sure you follow the PR template.
If your PR depends of another PR, mention it, the reviewer can temporally switch the base branch to make the review.

Stable staging is `main` when merging or pushing into main, netlify will deploy the `staging` environment.

For production we need to push a tag `tag -a 1.0.0 -m "Changes"` that will fire teh CD/CI to deploy in the target repository.

## More resources:

- [Architecture](https://whimsical.com/frontend-arquitecture-NfUQur2e1WpvWmeH9d1mXU)
- [Genesis wiki](https://www.notion.so/tianlu/Genesis-Wiki-319c67a41c5a4b9cb5f9eadd6f04e5bb)

## Stack

- [Supabase API docs](https://supabase.com/dashboard/project/kxchqnumsodkzillsjhx/api)
- [React Icons](https://react-icons.github.io/react-icons/icons/fa6/)
- [i18n](https://react.i18next.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
