
<h1 align="center">
   <a href="https://youtu.be/ZMhBywULzs4" target="_blank">Click here to see short demo of the project</a>
</h1>

## SkinLookup - introduction

This web application allows you to browse Rust skins, add them to your portfolio, view details, and display historical price/volume charts, among other features.

I've been working with Rust skins for few years now, it's been my hobby.
I’ve created several tools for personal use to calculate, aggregate, and automate tasks related to the Steam Market and Rust skins.  I've always wanted to create something less technical and more graphical related to it, so using it would be not only be helpful but visually pleasing as well but I never had time for it.

This is the Final Project for Harvard's CS50W course - "Capstone".

### What are Rust skins

Rust skins allow players in the game Rust (~100k avg. players) to change the appearance of their items. They can be sold on [Steam market](https://steamcommunity.com/market/search?appid=252490#p1_price_desc) and you can speculate on them similarly to any other asset. 
There are over 4000 of them with some reaching half a thousand sales per day.

## Distinctiveness and Complexity

My project is completely different from the other projects in this course, it's form and implementation has almost nothing in common with any of previous applications.

SkinLookup is also significantly more complex than any of the other projects. For first, it's tech stack is more sophisticated as it uses:

- **Next.js** as frontend framework _(beyond the scope of the course)_
- **Tailwind CSS** for styling _(beyond the scope of the course)_
- **Shadcn** for components and **Heroicons** for icons _(beyond the scope of the course)_
- **Django Rest Framework** as backend framework _(beyond the scope of the course)_
- **SQLite** as a database

Another thing worth noting is usage of **external API** - [SCMM](rust.scmm.app/docs/) to get up-to-date price history of every skin on site.

I'm also using skin preview images from Steam CDN (for example [this image](https://steamuserimages-a.akamaihd.net/ugc/2452862891801771581/B96690B4E46626858DF8FD93D59715427CE8267A/)). I've implemented several measures to reduce load on those sites, especially SCMM since it's non-profit project maintained by good people.

The measures taken include:

- **Custom caching logic** on the backend for caching price data for adjustable period of time (ITEMDATA_EXPIRATION_HOURS)
  - This includes ItemData model
  - Automatic backend-side data fetching - if cache has expired it fetches newest data automatically (and saves it)
  - Lazy loading - data is refreshed only when needed
  - Adjustable size of requested price history (lowered for development time - MAX_DAYS_PHSM)
- Using long **cache for images** (minimumCacheTTL) in Next.js config
- **Pagination** of site with all items, reducing amount of image requests
- Using a fixed, previously scraped dataset that includes only a subset of all (~4400) Rust items

### Other features:

- **JWT Authorization**
- **Asynchronous** portfolio item data update on the backend-side
- Implemented a **debouncer** for adding items to the portfolio to reduce backend load
- Implemented **short circuit mechanism** for searching to also reduce load on backend
  - Search bar is only displaying 10 results at a time so I keep other results that I've got from backend and try to filter those to get another 10 results. Only if I get less than that I send request to backend for more
- **Charts** with price history, volume history and summed up price history of group of items
- **Dynamic sites** - for example if you delete item in portfolio, every chart and Card with items data will be recalculated and updated in real time
- **Consistent, responsive design** - which was especially difficult due to many charts and cards with text of different lenght
- Using **Skeletons** for improved loading experience
- **Prefetching** of crucial images
- And more

## How to run

You have to have python,pip and npm installed to run this project.

Do it in cmd instead of powershell.

**Backend server**:

- `cd backend`

- Create virtual environment: `python -m venv venv`

- Activate virtual environment: `".\venv\scripts\activate"`  
(if it's not activating try using cmd instead of powershell)

- If (venv) is present before your directory in terminal, install required packages:
`pip install -r requirements.txt`

- Run Django server:
`python manage.py runserver`

- Server should run on http://127.0.0.1:8000/

**Frontend server** (in other console):

- `cd frontend/`

- Install required packages: `npm install`

- Create build: `npm run build` (should take around 2 minutes)

- Start app: `npm run start`

- If doesn't work for some reason run in development mode\*: `npm run dev`

- Server should run at http://localhost:3000

- You can login using example account `login: admin` `password: admin`

\*-Development is faster to run but switching between sites might take longed due to jit compiling. If you click through routes and wait for 10-20s it should be faster

## File documentation

(Required by CS50W "What’s contained in each file you created")

Ommited files are automatically generated.

/backend/

- app/ - Django aplication with project's backend
  - management/commands/ - Commands for managing project
    - import_items.py - Command allowing me to import item definitions (from /data/ directory)
  - migrations/ - Automatically generated migration files
  - admin.py - Models registered for admin panel
  - models.py - Models for my application (Item, ItemData, PortfolioItem, User)
  - serializers.py - Serializers for my app
  - services.py - Helper functions, (probably I should implement all of them in the models or move them to a utils.py file)
  - tests.py - Tests for backend
  - urls.py - routing for the application (api routes)
  - views.py - Views handling incoming requests
- data/ - Directory containing basic information about items included in my application.
  - 200_popular_items.json - ItemInfo of 200 popular items
  - Other files, if exists, are similar
- skin_lookup/ - Django project directory. Most of files there are automatically generated
  - urls.py - main backend routing file
  - settings.py - setting for django application
- .gitignore - files and folders for git to ignore
- db.sqlite3 - SQLite database for project
- requirements.txt - required python packages for the project

/frontend/

- app/ - My main app folder with frontend routes ui components layouts and pages
  - (mainapp)/ - Directory for all of my routes
    - (navigation)/ - Folder for routes using sidenav navigation
      - about/page.tsx - Page file for route about/
      - all/page.tsx - Page file for route all/
      - compare/page.tsx - Page file for route compare/ - I'm not sure if I will implement it, but it's somewhere on TODO list
      - item_details/page.tsx - Page file for route about/
      - portfolio/page.tsx - Page file for route portfolio/
      - search/page.tsx - Page file for route search/
      - layout.tsx - Layout with sidenav for all routes there
    - login/
      - page.tsx - Basic login page
    - register/
      - page.tsx - Basic register page
    - ui/ - Not routable folder for my UI components
      - all/ - Components mainly for all/ route
        - all-item-list.tsx - Component displaying all items at all/ route
        - item-preview-base.tsx - Base of item preview components
        - item-preview.tsx - Item preview component for all/ directory
        - search-bar.tsx - Search bar component
      - charts/ - Components for rendering charts
        - chart-price.tsx - Chart displaying item price
        - chart-volume.tsx - Chart displaying item volume
      - common/ - Shared utility components and configurations.
        - chart-configs.tsx - Reusable chart configs
        - types.tsx - Typescript interfaces shared across frontend
      - item_detail/ - Components mainly for item_details/ route
        - item-details-header.tsx - For rendering header of item detail route
      - nav/ - Components for navigation elements
        - nav-links.tsx - File with links to show on sidenav
        - sidenav.tsx - Sidenav component displaying links from nav-links
        - some-logo.tsx - File with logo component
      - portfolio/ - Components mainly for portfolio/ route
        - accordion-charts.tsx - Component for displaying charts in accordion component
        - card-info.tsx - Component for custom card info displaying
        - item-list.tsx - Portfolio item list
        - portfolio-header.tsx - Portfolio header containing card-info components
        - portfolio-item-preview.tsx - Portfolio item preview component based on all/item-preview-base.tsx
        - utils.ts - Utility functions for portfolio
    - fonts.ts - File with fonts used
    - global.css - Global css styles
  - favicon.ico - App icon
  - layout.tsx - Root layout for entire project
  - not-found.tsx - backup route for 404 errors
  - page.tsx - "/" page, nothing special
- components/ - UI components from shadcn
  - Files were automatically generated, probably I changed some details in some of them, but 95% of it is not my code
- lib/ - Also folder with utils.ts for shadcn
- public/ - Directory static assets in a Next.js
  - Contains some files with dummy data for development and some icons
- services/ - Folder for services (this is the part of the project that I’m not entirely satisfied with)
  - authService.ts - Service for handling authentication-related tasks, such as login, logout, and user session management
  - portfolioService.ts - Service for managing portfolio-related operations, including adding, removing, and fetching portfolio items
- .gitignore - files and folders for git to ignore
- next.config.ts - File with project configurations
- package.json - File containing required packages

## Other info

This project is not perfect and my TODO list is still quite large. There was many things that I did for a first time or testing if they are beneficial to my work and project management, so there are some not polished files of course. But overall I'm satisfied with the results and how efficient I was while implementing it.
