# TaskFlow

A modern, full-stack task management web application built with Next.js 16, Appwrite, and a clean component-driven architecture. TaskFlow helps teams and individuals organize, track, and manage tasks with an intuitive drag-and-drop interface.

## Features

- **Drag-and-drop task management** powered by `@hello-pangea/dnd`
- **Authentication & backend** via [Appwrite](https://appwrite.io/)
- **Type-safe API routes** using [Hono](https://hono.dev/)
- **Email notifications** with [Brevo](https://www.brevo.com/) and [React Email](https://react.email/)
- **Form validation** with React Hook Form + Zod
- **Data fetching & caching** via TanStack React Query
- **Dark/light mode** with `next-themes`
- **Accessible UI components** from Radix UI / shadcn/ui
- **Date handling** with `date-fns` and `react-day-picker`
- **Toast notifications** via Sonner

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Emotion |
| UI Components | shadcn/ui, Radix UI, Lucide React |
| Backend / Auth | Appwrite |
| API Layer | Hono |
| State Management | TanStack React Query |
| Forms | React Hook Form + Zod |
| Drag & Drop | @hello-pangea/dnd |
| Email | React Email + Brevo |

## Project Structure

```
TaskFlow/
├── app/            # Next.js App Router pages and layouts
│   └── email/      # React Email templates (dev preview)
├── components/     # Reusable UI components
├── fetures/        # Feature-specific modules (auth, tasks, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic
├── public/         # Static assets
├── config.ts       # App-wide configuration
└── next.config.ts  # Next.js configuration
```

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- An [Appwrite](https://appwrite.io/) project (cloud or self-hosted)
- A [Brevo](https://www.brevo.com/) account for email (optional for local dev)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashutoshmaurya078858/TaskFlow.git
cd TaskFlow
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project and add your Appwrite and Brevo credentials:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_API_KEY=your_api_key

# Brevo (for email)
BREVO_API_KEY=your_brevo_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### 5. Preview email templates (optional)

```bash
npm run email
```

This starts the React Email dev server pointed at `./app/email`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run email` | Preview email templates locally |

## Deployment

The easiest way to deploy TaskFlow is via [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the repository on the [Vercel dashboard](https://vercel.com/new).
3. Add your environment variables in the Vercel project settings.
4. Deploy — Vercel will automatically detect Next.js and configure the build.

For other platforms, run `npm run build` and serve the `.next` output according to your host's Next.js deployment guide.

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code passes linting (`npm run lint`) before submitting.

## License

This project is open source. See the repository for license details.

---

Built with ❤️ using [Next.js](https://nextjs.org) and [Appwrite](https://appwrite.io).