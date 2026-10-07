Sample app demonstrating navigation of large dataset

Several high-volume, production-grade APIs provide free access to millions of records without requiring a backend proxy or complex authentication.

### 1. OpenAlex API (Scholarly Works)

An fully open catalog of global research, publications, and citations containing **250+ million entities**.

* **Size:** 250M+ records
* **API Access:** REST API (`[https://api.openalex.org/works](https://api.openalex.org/works)`)
* **Auth Requirement:** None required (adding `?mailto=your@email.com` grants access to their polite pool with higher rate limits).
* **Why it’s great for UI rendering:**
* Supports cursor-based pagination (`next_cursor`) for continuous infinite scrolling.
* Deep filtering, full-text search, and field selection (`?select=id,display_name,publication_year,cited_by_count`) to test light payload payloads versus rich detail views.



### 2. Open Food Facts API

An open, crowd-sourced database of food products worldwide with full ingredient, nutritional, and barcode data.

* **Size:** ~3 million products
* **API Access:** REST API (`[https://world.openfoodfacts.org/api/v2/search](https://world.openfoodfacts.org/api/v2/search)`)
* **Auth Requirement:** None.
* **Why it’s great for UI rendering:**
* Rich mixed media: Each row carries nested nutrition arrays, localized tags, and multiple image variants (thumbnails vs high-res originals).
* Ideal for testing virtualized grid layouts (`react-window`, `tanstack-virtual`) combined with image caching or lazy-loading strategies.



### 3. GBIF (Global Biodiversity Information Facility)

An international network providing open access to species occurrence records from global sensors, observations, and museums.

* **Size:** 2.2+ billion records
* **API Access:** REST API (`[https://api.gbif.org/v1/occurrence/search](https://api.gbif.org/v1/occurrence/search)`)
* **Auth Requirement:** None.
* **Why it’s great for UI rendering:**
* Fast JSON response times despite the massive dataset depth.
* Every record includes geo-coordinates (`decimalLatitude`, `decimalLongitude`), timestamps, and taxonomic hierarchies—making it ideal if your frontend needs to show efficient map-based clusters alongside cached tabular views.



### 4. NOAA Global Summary of the Day (via CDO API)

Daily historical weather measurements (temperature, precipitation, wind) from thousands of global weather stations spanning decades.

* **Size:** Hundreds of millions of daily weather records
* **API Access:** REST API (`[https://www.ncdc.noaa.gov/cdo-web/api/v2/data](https://www.ncdc.noaa.gov/cdo-web/api/v2/data)`)
* **Auth Requirement:** Free API Token (instant registration).
* **Why it’s great for UI rendering:**
* High-density numerical data structure.
* Perfect for demonstrating client-side caching of time-series data, chart rendering performance (e.g., Chart.js, Recharts), and client-side delta aggregation.



---

### Architectural Tip for Frontend Proof-of-Concepts

When benchmarking client-side caching and rendering on multi-million row remote APIs:

1. **Use Cursor Pagination over Offset:** Prefer endpoints supporting cursor/continuation tokens (`next_cursor` or `page_token`). Deep offsets (e.g., `?page=10000`) cause server-side DB slowdowns that distort your frontend rendering metrics.
2. **Combine Virtualization + Query Caching:** Pair a virtualization library (**TanStack Virtual**) with a cache-first state engine (**TanStack Query** or **SWR**). Set `staleTime: Infinity` and configure a persistent storage adaptor (IndexedDB via `idb-keyval`) so fetched pages survive page reloads.
3. **Payload Trimming:** Use API field selectors (like OpenAlex’s `?select=...`) to request only visible UI keys during list scrolling, fetching the complete record payload only when a row is clicked.