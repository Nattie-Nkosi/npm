# NPM Registry Search Application

![](https://komarev.com/ghpvc/?username=Nattie-Nkosi&label=Nattie+Nkosi's+Profile+Views&color=ff69b4)

This is a React-based application that allows users to search and view details of packages from the NPM registry. The application utilizes React Router for client-side routing and leverages loaders to fetch data for different routes.

## Features

- **Search NPM Packages**: Search for NPM packages using keywords.
- **View Package Details**: View detailed information about a specific package, including description, license, and author.
- **Featured Packages**: Display a list of featured packages on the home page.
- **Error Handling**: Graceful handling of errors, including 404 not found errors.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Router**: A collection of navigational components for React applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Vite**: A fast development build tool.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/npm-registry-search.git
   cd npm-registry-search
   ```
2. **Install dependencies**:
3. ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```planetext
  src
│   App.tsx
│   index.tsx
│   index.css
│
├───pages
│   │   Root.tsx
│   │   ErrorPage.tsx
│   │
│   ├───home
│   │       HomePage.tsx
│   │       homeLoader.ts
│   │
│   ├───search
│   │       SearchPage.tsx
│   │       searchLoader.ts
│   │
│   └───details
│           DetailsPage.tsx
│           detailsLoader.ts
│
├───components
│       Header.tsx
│       PackageListItem.tsx
│       SearchInput.tsx
│
├───api
│   ├───queries
│   │       getFeaturedPackages.ts
│   │       getPackage.ts
│   │       searchPackages.ts
│   │
│   └───types
│           packageDetails.ts
│           packageSummary.ts
```
