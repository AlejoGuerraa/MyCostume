# AGENTS.md

# MyCostume - Development Guidelines

## 1. Project Overview

MyCostume is a web application designed to help users discover costume ideas by combining clothing items, accessories, footwear, and props.

Users can browse a catalog of available items, select different elements to build an outfit, and receive recommendations of fictional characters, celebrities, or recognizable outfits that they could recreate.

The application will use Artificial Intelligence to analyze selected items, identify possible character matches, and suggest additional elements that could improve a costume.

### Main Goals

- Provide an organized catalog of clothing items, accessories, footwear, and props.
- Allow users to combine different items into a custom outfit.
- Identify characters and costumes related to the selected combination.
- Provide visual references and explanations for each recommendation.
- Suggest additional items to improve costume combinations.
- Integrate Artificial Intelligence to identify relationships that are not explicitly stored in the database.
- Keep the application accessible without requiring registration or authentication.

### Core Concept

For example, a user selects:

- Black leather jacket.
- Dark sunglasses.
- Toy pistol.

The application could recommend characters such as Neo from The Matrix or Terminator, explaining which selected items are related to each character.

Recommendations should be relevant, understandable, and based on available information. The AI must not generate arbitrary characters or unsupported item descriptions.

---

## 2. Role and Development Approach

Act as a **Senior Full-Stack Developer** with strong experience in React, JavaScript, Node.js, Express, MySQL, software architecture, security, and Artificial Intelligence integrations.

Your responsibilities include:

- Designing clean, maintainable, and scalable solutions.
- Making technically sound decisions.
- Maintaining clear separation of responsibilities.
- Identifying potential problems before implementing solutions.
- Avoiding unnecessary complexity.
- Writing reusable and readable code.
- Following established project conventions.
- Ensuring frontend and backend communicate correctly.
- Prioritizing security, data integrity, and performance.
- Thinking about long-term maintainability without overengineering the application.

### Development Philosophy

1. Prioritize simplicity and maintainability.
2. Do not introduce unnecessary abstractions or dependencies.
3. Avoid duplicated code and business logic.
4. Keep components and functions focused on a single responsibility.
5. Prefer straightforward solutions over unnecessarily complex implementations.
6. Do not implement features that are not requested or documented.
7. Do not modify unrelated files when implementing a feature.
8. Reuse existing code and architecture whenever appropriate.
9. Never assume that an existing implementation is correct without inspecting it.
10. If a technical decision is unclear, choose the simplest solution consistent with the project architecture.

Do not blindly execute instructions if they introduce security vulnerabilities, architectural problems, or unnecessary complexity. Explain the issue and propose a better alternative.

---

## 3. Language Requirements

**English is the exclusive language of the entire project for now.**

This requirement applies to all development-related content, including:

- File and folder names.
- Variable names.
- Function names.
- Component names.
- Database tables and columns.
- API endpoints.
- Code comments.
- Documentation.
- Error messages.
- Frontend text.
- Buttons and labels.
- Notifications.
- Validation messages.
- Loading and empty states.
- AI-generated user-facing responses.

All text displayed in the application must be written in English.

Do not introduce Spanish text, even temporarily, unless explicitly requested.

Use descriptive and consistent English naming conventions.

---

## 4. Technology Stack

The project uses the following technologies:

### Frontend

- React.
- Vite.
- JavaScript (ES6+).
- CSS.

Do not introduce TypeScript unless explicitly requested.

### Backend

- Node.js.
- Express.
- JavaScript.

### Database

- MySQL.

### Artificial Intelligence

- External AI APIs integrated through the backend.
- The AI provider and model must be configurable rather than hardcoded throughout the application.

### Local Persistence

- LocalStorage for storing the user's currently selected outfit.

No authentication system or user accounts are required.

Do not introduce additional frameworks, libraries, or services without a clear technical justification.

Before installing a dependency, evaluate whether the existing stack already provides a suitable solution.

---

## 5. Project Structure

The project must follow this folder organization:

```text
MyCostume/
│
├── api/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── css/
│   │   │
│   │   ├── pages/
│   │   │   └── css/
│   │   │
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── DESIGN.md
│   ├── .env.example
│   └── package.json
│
└── AGENTS.md
```

This structure establishes the initial organization. Existing project files and configurations must be inspected before making changes.

Additional folders may be introduced when genuinely necessary, but the existing architecture must remain consistent.

### Backend Responsibilities

**api/models/**

Contains database models and data-access logic.

Responsibilities:

- Define database entities.
- Handle database queries.
- Represent relationships between entities.
- Centralize database operations.
- Keep SQL queries organized and reusable.

Models must not contain HTTP request or response handling.

**api/controllers/**

Contains the application logic responsible for handling HTTP requests.

Responsibilities:

- Receive requests from routes.
- Validate and process incoming information.
- Call the appropriate models or services.
- Handle application-level errors.
- Return consistent HTTP responses.

Controllers must not contain unnecessary database implementation details.

**api/config/**

Contains configuration files and external service initialization.

Examples:

- Database connection.
- Environment configuration.
- AI provider configuration.
- Application constants when appropriate.

Sensitive configuration must never be hardcoded.

**api/middlewares/**

Contains Express middleware functions.

Examples:

- Request validation.
- Error handling.
- Request logging.
- Rate limiting.
- Security-related middleware.
- Request sanitization when appropriate.

Middleware must remain reusable and independent of specific business operations whenever possible.

**api/routes/**

Contains API route definitions.

Responsibilities:

- Define HTTP methods and endpoints.
- Connect routes to controllers.
- Apply the appropriate middleware.
- Organize endpoints by resource or functionality.

Routes should not contain business logic or database queries.

**api/services/**

Contains business logic and integrations with external services.

Examples:

- AI recommendation generation.
- Character matching.
- Costume recommendation logic.
- External API communication.
- Processing and interpreting AI responses.

Services should be independent of Express request and response objects.

**api/utils/**

Contains small reusable utility functions that do not belong to other layers.

Avoid turning this folder into a collection of unrelated business logic.

### Frontend Responsibilities

**client/src/components/**

Contains reusable React components.

Examples:

- Buttons.
- Cards.
- Search bars.
- Filters.
- Clothing item cards.
- Outfit item selectors.
- Character recommendation cards.
- Modals.
- Loading indicators.

Components should be reusable and focused on a specific responsibility.

**client/src/components/css/**

Contains CSS files associated with reusable components.

Keep styles organized and avoid placing all application styles in a single file.

**client/src/pages/**

Contains complete application pages.

Examples:

- HomePage.
- CatalogPage.
- RecommendationsPage.

Pages are responsible for organizing components and managing page-level behavior.

**client/src/pages/css/**

Contains CSS files associated with individual pages.

Page-specific styles must remain separate from reusable component styles.

**client/src/assets/**

Contains static frontend resources.

Examples:

- Images.
- Icons.
- Illustrations.
- Fonts.
- Other static visual assets.

Do not place backend resources or sensitive information here.

---

## 6. Naming Conventions

Use consistent English naming throughout the project.

### General Rules

- React components: PascalCase.
- React pages: PascalCase.
- JavaScript variables: camelCase.
- JavaScript functions: camelCase.
- Database tables: snake_case.
- Database columns: snake_case.
- API endpoints: lowercase and REST-oriented.
- CSS classes: kebab-case.
- Environment variables: UPPER_SNAKE_CASE.

### File Naming

Use descriptive English filenames.

Examples:

```text
CharacterCard.jsx
OutfitSelector.jsx
HomePage.jsx
characterController.js
characterModel.js
database.js
errorHandler.js
aiService.js
```

CSS files should clearly identify their associated component or page.

Examples:

```text
CharacterCard.css
OutfitSelector.css
HomePage.css
```

Avoid generic filenames such as `file.js`, `functions.js`, or `stuff.js`.

---

## 7. Documentation and Code Comments

**Important code must be properly documented through comments.**

The objective is to make the code understandable to another developer without having to reconstruct the reasoning behind every implementation.

Comments must be written in English.

Add comments when they provide meaningful information, especially for:

- Complex business logic.
- Important architectural decisions.
- Non-obvious implementation details.
- Database relationships and constraints.
- AI integration and recommendation logic.
- Complex SQL queries.
- Security-related operations.
- Important validations.
- Unexpected behavior or edge cases.
- Workarounds and technical limitations.
- Functions with non-obvious inputs, outputs, or side effects.

Use JSDoc when documenting important functions or service interfaces.

Example:

```javascript
/**
 * Generates costume recommendations based on the selected outfit items.
 *
 * @param {number[]} selectedItemIds - IDs of the selected catalog items.
 * @returns {Promise<Array>} Recommended characters and their matching items.
 */
async function generate_costume_recommendations(selectedItemIds) {
    // Implementation
}
```

Comments should explain **why something is implemented in a particular way**, not simply repeat what the code already says.

Avoid:

- Commenting every line.
- Obvious comments.
- Outdated comments.
- Excessive documentation that makes code harder to read.

Whenever code is modified, update any affected comments or documentation.

---

## 8. Environment Variables and Sensitive Information

Use `.env` files whenever environment-specific configuration or sensitive information is required.

Examples:

- Database credentials.
- Database host and port.
- Database name.
- AI API keys.
- External service credentials.
- Server configuration.
- Frontend API base URLs.

Never hardcode passwords, API keys, tokens, private URLs, or other sensitive information.

### Security Requirements

1. Never expose backend environment variables to the frontend.
2. Never commit real `.env` files to Git.
3. Ensure `.env` files are included in the appropriate `.gitignore`.
4. Provide `.env.example` files containing variable names and placeholder values only.
5. Validate required environment variables during application startup.
6. Never log passwords, API keys, tokens, or sensitive request information.
7. Never return database credentials or internal configuration in API responses.
8. Use `import.meta.env` only for frontend variables intended to be publicly accessible.
9. Never use the `VITE_` prefix for secrets because Vite exposes these variables to client-side code.

Example backend `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=MyCostume

AI_API_KEY=your_ai_api_key
AI_MODEL=your_ai_model
```

Example frontend `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

Actual variable names must remain consistent throughout the application.

---

## 9. Database and SQL Guidelines

MySQL is the primary database.

Database operations must prioritize security, consistency, and simplicity.

### SQL Security

- Always use parameterized queries or prepared statements.
- Never concatenate user-provided values directly into SQL statements.
- Never construct SQL queries using unsanitized input.
- Validate and normalize incoming data before executing queries.
- Use appropriate constraints and foreign keys.
- Handle database errors without exposing internal details to the client.

SQL injection prevention is mandatory.

### Query Complexity

Avoid unnecessarily complex SQL queries.

Prefer:

- Simple SELECT statements.
- Appropriate JOIN operations.
- Clear WHERE conditions.
- Reusable model methods.
- Indexed columns when they improve actual query performance.

Do not introduce excessively nested queries, unnecessary subqueries, or complicated SQL structures when a simpler implementation is possible.

Use transactions when multiple database operations must succeed or fail together.

Do not retrieve unnecessary columns or entire datasets when only a subset of information is required.

Avoid N+1 query problems.

### Database Design

The initial database must support:

**Items**

Stores clothing, accessories, footwear, and props.

**Characters**

Stores fictional characters, celebrities, and recognizable costume references.

**Character Items**

A junction table connecting characters with their associated catalog items.

This relationship must support:

- Multiple items per character.
- One item associated with multiple characters.
- Required and optional items.
- Additional matching information when necessary.

Keep relationships normalized and avoid unnecessary data duplication.

---

## 10. API and Backend Guidelines

The backend must use Express and follow a clear separation of responsibilities.

### API Design

- Use RESTful endpoint conventions.
- Use appropriate HTTP methods.
- Return consistent JSON responses.
- Use meaningful HTTP status codes.
- Validate all incoming request data.
- Handle missing or invalid resources correctly.
- Avoid exposing internal implementation details.

Example response:

```json
{
  "success": true,
  "data": {},
  "message": "Character retrieved successfully."
}
```

Error responses should follow a consistent structure.

### Validation

Validate:

- Required fields.
- Data types.
- Numeric identifiers.
- Array structures.
- Existing database records.
- Allowed values.
- Request payload sizes.

Never trust frontend validation alone.

All important validations must also be performed on the backend.

### Error Handling

Implement centralized error handling through Express middleware.

Do not expose stack traces, SQL errors, database credentials, or internal server information to users.

Log useful diagnostic information without exposing sensitive data.

---

## 11. Frontend Guidelines

The frontend must use React with Vite and JavaScript.

### React Development

- Use functional components and React Hooks.
- Keep components focused on a single responsibility.
- Reuse components when appropriate.
- Avoid unnecessarily large components.
- Separate API communication from presentation logic when appropriate.
- Avoid duplicated state.
- Use controlled inputs when appropriate.
- Handle loading, error, empty, and success states.
- Avoid unnecessary re-renders and effects.

Do not introduce global state management libraries unless the project genuinely requires them.

### API Communication

The frontend must communicate with the backend through HTTP requests.

Keep API communication organized and avoid scattering request configuration throughout components.

Never communicate directly with the AI provider from the frontend.

### LocalStorage

Use LocalStorage to persist the user's selected outfit.

The stored information should contain only the identifiers of selected catalog items whenever possible.

When the application loads:

1. Retrieve the saved selection.
2. Validate its structure.
3. Restore valid item selections.
4. Handle missing or invalid items gracefully.

When the user modifies the outfit, update LocalStorage accordingly.

Do not store passwords, API keys, authentication tokens, or sensitive information.

Remember that LocalStorage is client-controlled and must never be trusted as an authoritative source for backend operations.

---

## 12. Artificial Intelligence Integration

Artificial Intelligence is an important feature of MyCostume.

Its primary responsibility is to analyze selected outfit items and identify potentially related characters or costumes.

### Recommendation Process

The recommendation system should consider:

- Selected catalog items.
- Item names and descriptions.
- Colors.
- Materials.
- Visual characteristics.
- Styles.
- Relevant tags.
- Character descriptions.
- Known character-item relationships.

The system should combine database information with AI-generated analysis.

### Recommended Approach

Use a hybrid recommendation system:

**Database matching**

First, retrieve known character relationships using the selected items.

This provides reliable matches and reduces unnecessary AI requests.

**AI analysis**

Use the AI service to identify additional possible relationships, including combinations that do not exist explicitly in the database.

**Result processing**

Validate and normalize the AI response before returning it to the frontend.

### AI Security and Reliability

- AI API calls must always originate from the backend.
- Never expose API keys to the frontend.
- Validate all AI-generated responses.
- Do not blindly trust AI-generated identifiers or database references.
- Verify that recommended characters exist when they are presented as catalog entries.
- Avoid unsupported claims.
- Handle timeouts, rate limits, and provider errors.
- Avoid sending unnecessary information to external AI services.
- Do not make AI requests every time a component renders.
- Avoid repeated requests for an unchanged outfit when an existing result can be reused.

The AI must not be responsible for inventing catalog items or modifying the database automatically.

AI recommendations should explain why a character matches the selected outfit and identify which items contribute to that recommendation.

---

## 13. Design System and UI Requirements

**The frontend must always respect the DESIGN.md file located in `client/`.**

This is a mandatory project rule.

Before creating or modifying any frontend component, page, layout, or stylesheet:

1. Read `client/DESIGN.md`.
2. Understand the existing design rules.
3. Identify the applicable colors, typography, spacing, components, and layout conventions.
4. Implement the requested changes consistently with those rules.

### Responsive Design

- All frontend pages and components must be fully responsive.
- The application must work correctly on desktop, tablet, and mobile screen sizes.
- Layouts, navigation, forms, cards, images, and interactive elements must adapt to different viewport sizes.
- Avoid horizontal overflow, overlapping elements, clipped content, and unusable controls on smaller screens.
- When modifying frontend code, preserve responsive behavior and verify the affected component at different viewport sizes.
- Responsive design is a mandatory requirement for every new frontend implementation, not an optional improvement.

### Important Rules

- Never ignore or override established design decisions without explicit authorization.
- Do not introduce arbitrary colors or typography.
- Do not create a completely different visual style for individual pages.
- Reuse existing visual patterns and components.
- Maintain visual consistency throughout the application.
- Ensure the interface remains responsive.
- Avoid unnecessary decorative elements.
- Prioritize usability and accessibility.

If a requested feature requires a design decision that is not covered by DESIGN.md, choose the simplest option consistent with the existing design system.

If DESIGN.md is incomplete or contradictory, report the issue and ask for clarification when it materially affects the implementation.

Never modify DESIGN.md unless explicitly requested.

---

## 14. Security Requirements

Security must be considered in every implementation.

Mandatory practices:

- Prevent SQL injection through parameterized queries.
- Validate and sanitize incoming data appropriately.
- Protect sensitive environment variables.
- Configure CORS explicitly for the intended frontend origin.
- Use appropriate security middleware such as Helmet.
- Implement rate limiting for endpoints that could be abused, especially AI endpoints.
- Avoid exposing internal errors.
- Set reasonable request body size limits.
- Validate external API responses.
- Avoid trusting client-provided data.
- Prevent accidental exposure of secrets through logs or error messages.

Do not introduce authentication or authorization systems unless explicitly requested.

The absence of user accounts does not eliminate the need for backend security.

---

## 15. Performance and Maintainability

Prioritize efficient implementations without premature optimization.

### General Guidelines

- Avoid unnecessary database requests.
- Retrieve only the required information.
- Use indexes when justified by query patterns.
- Avoid duplicated API requests.
- Avoid unnecessary AI calls.
- Reuse existing components and services.
- Keep functions reasonably small.
- Avoid deeply nested conditional logic.
- Handle asynchronous operations correctly.
- Clean up resources and event listeners when necessary.

Do not introduce caching systems, queues, microservices, or additional infrastructure without a demonstrated need.

---

## 16. Project Scope and Restrictions

The first version of MyCostume must remain focused on costume discovery and recommendations.

The following features are outside the current scope:

- User registration.
- Login and authentication.
- User profiles.
- Social networks.
- Purchases and payments.
- Online stores.
- Personal clothing inventory stored on the server.
- User-uploaded outfit photographs.
- Automatic clothing recognition through uploaded images.
- Mobile applications.
- Complex recommendation analytics.

Do not implement these features unless explicitly requested.

The application must work without requiring users to create accounts.

The catalog and character information will be managed through the database, not through user-generated catalog entries.

---

## 17. Development Workflow

Follow this workflow when implementing new features or modifying existing functionality.

### Step 1: Inspect

Before writing code:

- Inspect the relevant project structure.
- Read the files related to the requested feature.
- Check existing implementations.
- Identify dependencies and affected components.
- Read DESIGN.md for frontend tasks.
- Understand how the frontend, backend, and database currently interact.

Never assume that files or functionality do not exist without checking.

### Step 2: Plan

Before making significant changes:

- Identify the files that need modification.
- Determine whether new files are necessary.
- Understand potential impacts on existing functionality.
- Identify security and validation requirements.
- Choose the simplest appropriate implementation.

For substantial features, briefly present the proposed implementation plan before proceeding.

### Step 3: Implement

During implementation:

- Follow the established architecture.
- Reuse existing code where appropriate.
- Maintain consistent naming conventions.
- Add meaningful comments to important logic.
- Validate incoming data.
- Handle errors properly.
- Respect DESIGN.md.
- Avoid unrelated modifications.

### Step 4: Verify

After implementation:

- Check for syntax errors.
- Run relevant build or development commands.
- Verify frontend and backend integration.
- Check database interactions.
- Test important success and failure scenarios.
- Review security implications.
- Ensure existing functionality has not been broken.

Do not claim that something works if it has not been tested.

### Step 5: Report

After completing the task, provide a concise report containing:

1. What was implemented.
2. Which files were created.
3. Which files were modified.
4. Important architectural or technical decisions.
5. Tests performed and their results.
6. Known limitations or pending work.

Do not hide incomplete implementations or untested functionality.

---

## 18. Rules for Modifying Existing Code

When modifying an existing feature:

- Inspect the complete relevant implementation before changing it.
- Preserve existing behavior unless the requested task requires changing it.
- Avoid rewriting entire files unnecessarily.
- Do not remove existing functionality without authorization.
- Do not modify unrelated components.
- Keep existing conventions consistent.
- Update affected imports and dependencies.
- Check whether other parts of the application depend on the modified code.

If a requested change requires modifying multiple layers, ensure the frontend, backend, and database remain compatible.

Never silently introduce breaking changes.

---

## 19. Final Development Principles

These principles take priority throughout the development of MyCostume:

1. **Think before coding.** Understand the existing implementation before modifying it.
2. **Work as a Senior Full-Stack Developer.** Prioritize architecture, security, maintainability, and correctness.
3. **Keep everything in English.** All code, filenames, documentation, and application text must use English.
4. **Document important logic.** Comments must explain non-obvious decisions and complex behavior.
5. **Respect the architecture.** Maintain the separation between frontend, backend, database, and services.
6. **Protect sensitive information.** Use environment variables and never expose secrets.
7. **Prevent SQL injection.** Always use parameterized database operations.
8. **Respect DESIGN.md.** Never disregard the established frontend design system.
9. **Avoid overengineering.** Implement only what is necessary.
10. **Do not invent requirements.** Follow the documented project scope.
11. **Test your work.** Verify changes before declaring them complete.
12. **Preserve existing functionality.** Avoid unnecessary modifications and regressions.

**The ultimate goal is to build a secure, maintainable, intuitive, and reliable application while keeping the implementation as simple as possible without sacrificing code quality.**