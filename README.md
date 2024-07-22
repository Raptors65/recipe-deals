# Recipe Deals

With grocery prices rising rapidly over the past few years, it is becoming increasingly difficult to cook affordable meals. This website aims to mitigate this issue by finding items on sale at grocery stores and then suggesting recipes that use these items. It scrapes grocery store websites to find the items on sale, then uses the Spoonacular API to find recipes with those items.

This site was built using [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/) and connected to a [Postgres](https://www.postgresql.org/) database hosted on [Supabase](https://supabase.com/).

## Supported Grocery Chains
- [Loblaws](https://www.loblaws.ca/)
- [No Frills](https://www.nofrills.ca/)

## How to Use
1. Go to https://recipe-deals.vercel.app/select_store
2. Select your local grocery store
3. Choose an ingredient that's on sale
4. Choose a recipe

