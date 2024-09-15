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

## Internationalization

Each module contains his own internationalization in the `lang` folder.
We only need to update the `english` version, rest the AI will take care of it.

You will need the Chat GPT key for this
`yarn trans`

## More resources:

- [Architecture](https://whimsical.com/frontend-arquitecture-NfUQur2e1WpvWmeH9d1mXU)
- [Genesis wiki](https://www.notion.so/tianlu/Genesis-Wiki-319c67a41c5a4b9cb5f9eadd6f04e5bb)

## Stack

- [Supabase API docs](https://supabase.com/dashboard/project/kxchqnumsodkzillsjhx/api)
- [React Icons](https://react-icons.github.io/react-icons/icons/fa6/)
- [i18n](https://react.i18next.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation) and [Tailwind CSS Components](https://tailwindui.com/components)
- [Style](https://github.com/styled-components/styled-components) Use this Extension for Visual Code    [styled-components.vscode-styled-components]( https://marketplace.cursorapi.com/items?itemName=styled-components.vscode-styled-components)
- [Test and Mocks: Jest](https://jestjs.io/docs/getting-started)

## Sentry

This project uses [Sentry](https://genesis-4s.sentry.io/) for monitoring.
To Test an error you can access to the rout `/sentry`  (TODO: Hide it in production?)

## Testing

Follow our tutorial of [How to test](https://jestjs.io/docs/getting-started)

Recommend install the [Jest Plugin](https://marketplace.cursorapi.com/items?itemName=Orta.vscode-jest) while allow
to execute specific test from Visual Studio.

Before running the test the `jest-setup.ts` where we declare some use-full mocks that help you to validate some actions (Like the toast, the navigation, i18n).

Important Notes:

-> Create a Seed function for each business element.
-> Create a Mock for each service that return positive, we can just the mock to return error in a specific action.
-> Check the TestUtils classes that will save you some time and simplify the test cases

### New Version

We use standard-version

`pnpm bump (patch|minor|mayor)`

Under the hook is using`npx standard-version --release-as` can add `patch` or `minor` or `mayor`. And pushing the tags

Follow this logic 
Major version: Broken backward compatibility
Minor Version: New functionality
Patch: Bug fixing 
