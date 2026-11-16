# MyCostume Product Specification

## 1. Document Control

- Product: MyCostume
- Status: Draft specification for implementation and validation
- Version: 1.0
- Last updated: 2026-11-15
- Owners: Product + Engineering

## 2. Product Overview

MyCostume is a browser-based costume discovery application that helps users build outfits from a catalog of clothing items, accessories, footwear, props, and character-inspired pieces. The core experience is intentionally simple: users browse a catalog, filter by category, search for items, and compose a custom outfit from the pieces they already have or want to combine. The application then helps discover relevant characters, costumes, or recognizable looks that match the selected combination.

The product is designed around the principle of a lightweight, no-authentication experience. It does not require accounts, profile management, or onboarding friction. Users can open the app, browse items, and build an outfit immediately.

At a product level, MyCostume can be understood as a hybrid catalog + recommendation tool. The data foundation is a valid item catalog with categories and descriptions. The experience is extended by recommendation logic that identifies characters and styles aligned with the selected outfit. This recommendation layer is intended to use a combination of explicit database relationships and AI-assisted analysis, while never inventing unsupported data.

## 3. Problem Statement

Users often want to create a costume idea from a limited set of wardrobe pieces. The challenge is not just finding a single item, but understanding how different pieces can be combined into a coherent look. Existing discovery experiences are fragmented across stores, search engines, and social inspiration boards. MyCostume solves this by giving users a single place to:

- explore a structured catalog of costume-related items,
- understand which category each item belongs to,
- assemble a custom outfit from selected items,
- discover costume or character references that fit the combination,
- keep the current outfit state available in the browser without requiring an account.

## 4. Product Goals

### Primary goals

1. Enable fast browsing of a costume item catalog.
2. Allow users to build an outfit by selecting items from multiple categories.
3. Support category-based and text-based item discovery.
4. Save the current outfit selection locally in the browser for continuity.
5. Recommend recognizable characters or costume inspirations based on selected items.
6. Provide a responsive, polished experience aligned with the declared design system.

### Secondary goals

- Keep the app lightweight and easy to run locally.
- Maintain a clean separation between frontend, backend, and data layers.
- Ensure the system remains secure and resilient against malformed input.
- Prepare the project for future AI recommendation expansion without breaking the core catalog experience.

## 5. Scope

### In scope

- Catalog browsing by category
- Search across catalog items
- Filtering by category and search term
- Item selection and outfit assembly
- Client-side persistence of user selections
- Backend API for catalog retrieval
- MySQL-backed persistence for catalog data
- Recommendation logic based on item-to-character relationships and AI-assisted matching
- Frontend responsiveness and design-system compliance

### Out of scope

- User accounts or authentication
- Payment processing or inventory management
- Server-side user profiles
- Uploading user photos or AI-powered image recognition
- Social graph, friends, or sharing features
- CMS-style administration panels for end users
- Automatic database mutation by AI
- Complex analytics dashboards
- Mobile-native app development

## 6. Target Users

### Primary users

- Costume enthusiasts who want to mix and match items creatively
- Cosplayers looking for wardrobe and prop inspiration
- Casual users seeking recognizable fictional or iconic looks
- Event-goers who need a quick outfit theme based on existing pieces

### User needs

- A fast way to browse available elements without friction
- The ability to compare or select multiple items from different categories
- Confidence that the selected pieces fit a believable costume theme
- Clear identification of matching character or style references
- A consistent experience on desktop, tablet, and smaller screens

## 7. Core User Experience

### Main flows

#### 1. Browse the catalog
- User lands on the home page.
- Catalog items are displayed in a structured grid.
- The user may filter by category from a category bar or navigation control.
- The UI exposes clear item cards with image, label, and selection controls.

#### 2. Search items
- User enters a search term.
- Results are narrowed to matching item names.
- Search can be combined with category filters.
- Empty or no-match states are displayed clearly.

#### 3. Build an outfit
- User selects one or more items from different categories.
- Selection is stored locally in the browser.
- A selected-items panel shows the current current outfit composition.
- The user can add or remove individual variants and see counts update instantly.

#### 4. Discover costume inspiration
- Based on selected items, the system identifies likely costume references or character matches.
- It explains which attributes match the selected items.
- Recommendations include clear justifications grounded by catalog data and AI analysis, not arbitrary generation.

## 8. Functional Requirements

### 8.1 Catalog browsing

The system shall:

- expose a catalog of items grouped by category,
- provide category-level filtering,
- render items in a responsive card layout,
- allow users to view enough metadata to understand each item without requiring an account,
- handle empty states and loading states gracefully.

### 8.2 Search and filtering

The system shall:

- support searching item names by text,
- allow the combination of text search and category filters,
- handle query normalization and invalid values safely,
- return no results or a friendly empty-state message when appropriate,
- enforce backend validation for query parameters such as category and limit.

### 8.3 Outfit selection

The system shall:

- add selected items to a user’s working outfit,
- support multiple selections within the same category,
- track item variants by item ID and color when relevant,
- remove selections from the working outfit,
- persist the selected outfit in LocalStorage,
- restore prior selections safely when the app loads,
- discard invalid or legacy stored values without breaking the app.

### 8.4 Recommendation and matching

The system shall:

- retrieve known costume or character relationships from the database,
- merge those results with AI-generated suggestions when available,
- validate recommended outputs before surfacing them to the user,
- ensure AI-generated suggestions never fabricate catalog items or unsupported relationships,
- display recommendations with supporting explanations of why a match is relevant.

### 8.5 API behavior

The backend shall:

- expose RESTful endpoints for categories and items,
- return consistent JSON envelopes with success flags and messages,
- validate request parameters before executing database queries,
- use parameterized queries and safe database access patterns,
- return meaningful HTTP errors for invalid parameters and missing data.

## 9. Non-Functional Requirements

### Performance

- Catalog and category requests should respond quickly for standard use cases.
- Search and filter actions should avoid unnecessary re-renders and duplicate request patterns.
- LocalStorage reads and writes must be minimal and efficient.
- The app should avoid repeating AI calls for unchanged outfit states when a valid result can be reused.

### Security

- Backend routes must validate and sanitize input.
- All SQL queries must use parameterized statements or ORM-safe query building.
- Sensitive environment values must never be hardcoded or exposed to the frontend.
- Origin configuration must be explicit and restricted to the intended frontend origin.
- Security middleware such as Helmet and CORS configuration must be enabled.
- Large request bodies or malformed requests must be rejected with safe validation logic.

### Accessibility

- The interface must expose semantic HTML where needed.
- Controls must remain keyboard-accessible and understandable.
- Visual states must be clear for selected, disabled, loading, and error conditions.
- Color usage must meet legibility expectations while aligning with the design system.

### Reliability

- Invalid LocalStorage data must not crash the app.
- Failed catalog or category requests must show a clear user-facing error state.
- The system must degrade gracefully when external APIs or AI services are unavailable.

### Maintainability

- The codebase must remain separated by responsibility: routes, controllers, services, models, utilities, and frontend components.
- Naming should remain explicit and consistent in English.
- Reusable logic should not be duplicated across the app.
- Design decisions must align with the defined design specification.

## 10. Design Requirements

The frontend must follow the official design system in [client/DESIGN.md](client/DESIGN.md). This requirement is mandatory and should be treated as a design contract. The implementation must stay aligned with the following expectations:

- editorial presentation with strong typography and visual hierarchy,
- neutral chromatic palette with intentional use of accent colors for emphasis,
- responsive layout on desktop, tablet, and mobile breakpoints,
- high contrast and consistent spacing rules,
- clean card layouts and minimal decorative clutter,
- brand consistency across the whole experience.

The design system should remain the source of truth for any UI change. The product must not introduce arbitrary visual styles that conflict with existing design decisions.

## 11. Technical Architecture

### Frontend

- React + Vite
- JavaScript (ES6+)
- React Router for page navigation
- CSS for component and page styling
- LocalStorage for outfit persistence

### Backend

- Node.js + Express
- JavaScript
- RESTful API layer
- Middleware for error handling and validation
- Database access through a model layer

### Data layer

- MySQL as the primary persistence layer
- Sequelize for ORM-based access
- Data model for categories and catalog items
- Future support for costume and costume-item relationships

### Current implementation profile

The current codebase already includes:

- a catalog API,
- category and item routes,
- local selection logic,
- a responsive storefront-like browsing experience,
- image-backed item assets.

The recommendation and AI integration layer is intended to be added as a continuation of this architecture and should not bypass the backend or expose API keys in the client.

## 12. Data Model

### Categories

A category describes a class of items such as:

- Accessories
- Pants
- Shirts
- T-shirts
- Jackets
- Coats
- Footwear
- Headwear
- Props
- Weapons

Required characteristics:

- unique name
- stable identifier
- one-to-many relationship with items

### Items

An item represents a catalog entry that can be selected as part of an outfit.

Required characteristics:

- unique item name within a category
- category reference
- optional image URL
- unique identifier for selection tracking

### Costumes / character references

The product model anticipates a future relationship between outfits and costume inspirations. A costume record may include:

- costume name
- description
- image reference
- source attribution
- associated item references

This relationship must remain normalized and should not duplicate catalog data unnecessarily.

## 13. API Specification

### Base URL

- Development API: http://localhost:3000/api

### Endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | /api/health | Health check for the backend service |
| GET | /api/categories | Retrieve available catalog categories |
| GET | /api/items | Retrieve items with optional category and item-ID filters |
| GET | /api/items/search | Search catalog items by text, optionally filtered by category |

### Endpoint behavior

All endpoints must:

- return a consistent JSON envelope,
- use HTTP status codes appropriate to the result,
- validate query parameters before executing database work,
- use safe error handling that does not expose internal system details to the client.

### Example success response

```json
{
  "success": true,
  "data": {
    "items": []
  },
  "message": "Items retrieved successfully."
}
```

### Example error response

```json
{
  "success": false,
  "message": "The requested category is invalid."
}
```

## 14. Recommendation Engine Requirements

The recommendation engine must be a backend-owned process. It shall combine:

1. explicit relationships from the database,
2. item-matching signals derived from name, category, style, and metadata,
3. AI-assisted analysis for novel or non-explicit matches,
4. validation of final recommendations before they are returned to the client.

### Recommendation rules

- The system must not fabricate characters or unsupported items.
- Recommendations must explain why the match is relevant.
- The AI layer must not directly modify the data layer without explicit application logic.
- If a recommendation references a known character, the application must verify that the referenced entity exists in the system.
- AI provider configuration must be environment-based and not hardcoded.

## 15. Business Rules and Constraints

- No authentication or account system will be introduced in v1.
- The catalog must remain editable through structured data and data-access layers, not through end-user submissions.
- The application must work without login or registration.
- The UI must be responsive and accessible across common browser sizes.
- All project-facing text must remain in English.
- The system must respect the design specification in client/DESIGN.md.

## 16. Acceptance Criteria

### Functional acceptance

- A user can view a catalog of items grouped by category.
- A user can filter items by category.
- A user can search for item names across the catalog.
- A user can select multiple items and see them in the selected-items panel.
- A user can persist selections across a browser session using LocalStorage.
- The app displays clear empty and error states.
- The backend gracefully handles invalid input and missing data.

### Technical acceptance

- The backend exposes valid catalog endpoints.
- Data queries use parameterized or ORM-safe patterns.
- The project uses environment variables for sensitive configuration.
- The frontend does not expose backend secrets or API keys.
- The design system is respected in implementation and styling.

## 17. Risks and Dependencies

### Risks

- AI responses may be inconsistent without strict validation.
- Catalog data quality directly impacts recommendation accuracy.
- Large catalog images can affect page weight if not optimized.
- LocalStorage data can become stale if the catalog changes over time.

### Dependencies

- Stable catalog data and image assets
- MySQL database environment
- Frontend and backend environment variables
- AI provider configuration for future recommendation layer

## 18. Definition of Done

The feature or release is considered done when:

- the requested functionality is implemented,
- unit or integration tests cover the critical paths,
- the API behaves as specified,
- the frontend matches the established design system,
- security and validation checks are in place,
- the user experience is responsive and understandable,
- no critical regressions are introduced in the existing catalog experience.

## 19. Roadmap

### Phase 1: Catalog foundation
- category and item API
- catalog browsing
- filtering and search
- LocalStorage outfit persistence

### Phase 2: Recommendation layer
- costume and character relationship data model
- recommendation API service
- AI-assisted suggestion logic
- validation and regression safeguards

### Phase 3: Polish and scale
- performance tuning
- accessibility improvements
- richer error handling
- final design consistency audit

## 20. Summary

MyCostume is a costume-discovery application focused on catalog exploration, outfit composition, and smart recommendation. The system is intentionally simple, no-authentication, and user friendly, while still being structured to scale into a robust recommendation tool. The foundation already exists in the current codebase and should evolve in a disciplined, secure, and design-consistent manner.

This specification acts as the implementation reference for the product’s current scope, target architecture, and required quality bar. Any future feature work should be measured against this document to ensure continuity, maintainability, and alignment with the project’s strategic goals.
