# Quick Basket Admin

This is the administrative web dashboard for **Quick Basket**, built with React, Vite, and Tailwind CSS. It allows store administrators to manage products, categories, orders, and other essential store operations.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management / Data Fetching**: React Query
- **Forms & Validation**: React Hook Form + Zod
- **Maps**: Leaflet & React Leaflet
- **Charts**: Recharts

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/krishnaCodriva/QuickBasket.git
   ```

2. **Navigate to the admin project directory**:
   ```bash
   cd QuickBasket/store-admin
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

The application will typically start at `http://localhost:5173`. Open this URL in your browser to view the admin panel.

---

## Folder Structure

The project follows a standard React application structure:

```text
store-admin/
├── public/             # Static public assets
├── src/
│   ├── assets/         # Images, icons, and local static files
│   ├── components/     # Reusable UI components
│   ├── constants/      # Global constants and configuration
│   ├── hooks/          # Custom React hooks
│   ├── locales/        # Localization files
│   ├── pages/          # Main application views/pages
│   ├── providers/      # React context providers
│   ├── services/       # API integration and external services
│   ├── types/          # TypeScript definitions and interfaces
│   ├── utils/          # Helper and utility functions
│   ├── validations/    # Zod schemas for form validation
│   ├── App.tsx         # Root application component
│   └── main.tsx        # Application entry point
├── eslint.config.js    # ESLint configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.js      # Vite configuration
```

---

## Building for Production

To create a production-ready build, run:

```bash
npm run build
# or
yarn build
```

The built files will be located in the `dist` directory, ready to be deployed.

---

## Contributors

A big thank you to all the people who have contributed to this project:

- [krishnaCodriva](https://github.com/krishnaCodriva)
- [Satyam Tripathi (satyamtripathii)](https://github.com/satyamtripathii)
- [NEERAJ KUMAR (Neerajkumar151)](https://github.com/Neerajkumar151)
- [Sktripathii](https://github.com/Sktripathii)

---

## License

This project is part of Quick Basket and is licensed under the MIT License.
