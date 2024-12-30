## Note about usage of Typescript insead of Javascript
I've decided to use TypeScript in this project as part of the front-end implementation. TypeScript is a superset of JavaScript, meaning that every valid JavaScript program is also valid TypeScript. To effectively write TypeScript, a strong understanding of JavaScript is required, as the core language concepts, syntax, and functionality are shared.

My decision to use TypeScript is driven by two primary reasons:
- It works seamlessly with Next.js which I want to learn along with Typescript
- TypeScript adds static typing, improved tooling, and other modern features to JavaScript, which can enhance code maintainability and reduce runtime errors

"Your web application must utilize [...] JavaScript on the front-end."

This implementation does not deviate from the course requirements, as TypeScript is fundamentally JavaScript with additional features. All JavaScript code remains valid and operational within this framework.

## SkinLookup - overview

This project allows You to browse through Rust skins, add them to portfolio, show details about them, show historical price/volume charts and more.

## Distinctiveness and Complexity

My project is completely different than the other projects in this course, it's form and implementation has almost nothing in common with any of previous applications. 

I belive SkinLookup is also much more complex than any of those projects. For first, it's tech stack is much more sophisticated as it uses:

- Next.js as frontend framework (beyond the scope of the course)
- Tailwind CSS for styling (beyond the scope of the course)
- Django Rest Framework as backend framework (beyond the scope of the course)
- SQLite as database 

Another thing worth noting is usage of external API - SCMM (rust.scmm.app/docs/) to get up-to-date price history of every skin on site. 

I'm also using skin preview images from Steam CDN (for example [this image](https://steamuserimages-a.akamaihd.net/ugc/2452862891801771581/B96690B4E46626858DF8FD93D59715427CE8267A/)). I've implemented several meaures to reduce load on those sites, especially SCMM since it's non-profit project maintained by good people.

This measures include:
- Custom caching logic on the backend for caching price data for adjustable period of time (ITEMDATA_EXPIRATION_HOURS)
    - This includes ItemData model
    - Adjustable size of requested price history (lowered for development time - MAX_DAYS_PHSM)
- Using long cache for images (minimumCacheTTL) in Next.js config
- Pagination of site with all items, reducing amount of image requests
- Using fixed previously scraped item dataset which does include only subset of all (~4400) Rust items

Other features:
- Implemented debouncer for adding items in portfolio to reduce load on backend
- Implemented short circuit for searching to also reduce load on backend
    - Search bar is only displaying 10 results at a time so I keep other results that I've got from backend and try to filter those to get another 10 results. If I get less than that I send request to backend for more
- Charts with price history, volume history and summed up price history of group of items
- Dynamic sites, for example if you delete item in portfolio, every chart and Card with items data will be recalculated and updated in real time 
- Consistent, responsive design - which was especially difficult due to many charts and cards with text of different lenght
- And more

## File documentation



## How to run



## Other info
tech stack?
scmm use (api)
