# ERP frontend – sign in & register (React + TypeScript + Vite)

Plain CSS, axios for API calls. Works with the NestJS backend in `erp-backend`.

## Run
```bash
yarn install
yarn dev                 # http://localhost:5173
```

By default, the frontend calls `https://erp-backend-updated.onrender.com/api`.
To override the backend URL, copy `.env.example` to `.env` and set `VITE_API_URL`.
Include the API prefix in the value (for example, use `http://localhost:3000/api` for a local backend).
```bash
cp .env.example .env
```

## Pages
| Route | What it does |
| --- | --- |
| `/auth` | Sign in / Register tabs. After registering it asks the owner to check their email. |
| `/email-verified` | Where the link in the verification email lands. Shows success or the error from Supabase. |
| `/dashboard` | Company overview and links to the three services |
| `/people` | Add / edit / delete customers, staff and suppliers |
| `/products` | Product catalogue with prices and images |
| `/finance` | Selling income, three expense types, and growth graphs |

Each signed-in company only sees rows it created. The API always uses the access token's user id (`company_id`); another tenant's data is never returned.

## Structure
```
src/
├── api/         axios client (adds the token, refreshes it when it expires), AuthApi, ApiError, TokenStorage
├── context/     AuthProvider / AuthContext (who is signed in)
├── components/  LoginForm, RegisterForm, CheckEmailPanel, form pieces
├── pages/       AuthPage, EmailVerifiedPage, DashboardPage, PeoplePage, ProductsPage, FinancePage
├── routes/      ProtectedRoute, PublicOnlyRoute
├── styles/      global.css, auth.css, dashboard.css
└── utils/       form validation (mirrors the backend rules)
```

The product name shown on screen is `APP_NAME` in `src/config/env.ts`.
