<h2 align="center">KiboCommerce & Next.JS & ContentStack</h2>

<p align="center">
This is a headless ecommerce starter kit for KiboCommerce platform using Next.JS <br>
Demo: <a href="https://nextjs-storefront-kibo-commerce.vercel.app">https://nextjs-storefront-kibo-commerce.vercel.app</a>
</p>

### Features

- Performant by default
- SEO Ready
- Internationalization
- Responsive
- UI Components built on top of Material UI 5
- Theming
- KiboCommerce data hooks
- PWA Ready
- Omni Channel Capability (Ship to home and Pickup in Store support)
- ContentStack Intergration

## Getting Started

1. Clone this repo

```bash
git clone https://github.com/KiboSoftware/nextjs-contentstack-starter-storefront.git
```

2. Change into directory and install dependencies

```bash
npm install
```

3. Copy .env template

```bash
cp .env.template .env.local
```

4. Configure env variables for your Kibo Commerce environment
5. Start Dev server

```bash
npm run dev
```

## Configuration

.env example

```bash
KIBO_API_HOST=t1234-s1234.sandbox.mozu.com
KIBO_AUTH_HOST=home.mozu.com
KIBO_CLIENT_ID=KIBO_APP.1.0.0.Release
KIBO_SHARED_SECRET=12345_Secret

NEXT_PUBLIC_CONTENTSTACK_API_KEY=123_api_secret
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=123_delivery_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=123_environment
NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN=123_management_token
NEXT_PUBLIC_CONTENTSTACK_API_HOST=123_api-host
```

The following data is required to configure the storefront to communicate with your Kibo API Client.

- `apiHost` - Your Kibo Commerce API Host.
- `authHost` - Kibo Commerce Authentication Host Server. It is used to request an access token from Kibo Commerce OAuth 2.0 service. Production and Production sandbox, use `home.mozu.com`
- `clientId` - Unique Application (Client) ID of your Application
- `sharedSecret` - Secret API key used to authenticate application. Viewable from your [Kibo eCommerce Dev Center](https://mozu.com/login)

Visit [Kibo documentation](https://apidocs.kibong-perf.com/?spec=graphql#auth) for more details on API authentication

## Useful Commands

```bash
npm run dev # Start dev server
npm run build # Run production build
npm run start # Run production start
npm run generate-types # generate typescript Kibo API types from GraphQL Schema
npm run storybook # start storybook for
npm run test # run unit / integration tests
```

## Built with

- Framework - [Next.JS](https://nextjs.org/docs)
- Component Library - [Material UI 5](https://mui.com/material-ui/getting-started/overview/)
- Testing - [Jest](https://jestjs.io/docs/getting-started)
- Data Fetching / State Management - [React Query](https://react-query-v3.tanstack.com/overview)
- Localization - [Next i18Next](https://github.com/i18next/next-i18next)

## Pre-requisite

- Follow Steps mentioned in link for configuring contentstack cms (https://github.com/KiboSoftware/stack-contentstack)
- Next, after above steps data can be created on contentstack website (Need an account prior on contentstack cms)

## Preview mode in Content Stack

- Live Preview allows content managers to preview content without publishing it to an environment or saving the changes made to the content. The content changes you make reflect in the preview pane in real-time.
- You can also preview your content changes across multiple channels, such as mobiles, tablets, and desktops. This flexibility allows you to ensure website content looks precisely how you intended, and thus helps achieve omnichannel content delivery.
- Once configured, the Live Preview icon will be visible in the right-hand side panel of the entry editor page for all entries of the stack. When you click on the icon, the preview window opens up towards the right-hand side of the entry editor page.

## Contributions

All contributions welcome!
