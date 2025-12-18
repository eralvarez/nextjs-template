# Next.js Template

A modern Next.js template with Prisma ORM, Material-UI, and TypeScript.

## Features

- ⚡ **Next.js 16** - React framework with App Router
- 🎨 **Material-UI (MUI)** - Comprehensive UI component library
- 🗄️ **Prisma** - Next-generation ORM for type-safe database access
- 📘 **TypeScript** - Full type safety
- 🎭 **Emotion** - CSS-in-JS styling
- 🔍 **ESLint & Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Documentation

- **[Prisma Guide](docs/PRISMA.md)** - Complete guide for database operations, migrations, and Prisma Client usage

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database (Prisma)

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate:dev` - Create and apply migration (development)
- `npm run db:migrate:deploy` - Apply migrations (production)
- `npm run db:migrate:status` - Check migration status
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database (⚠️ deletes all data)
- `npm run db:push` - Push schema changes without migration
- `npm run db:pull` - Pull schema from database

For detailed Prisma documentation, see [docs/PRISMA.md](docs/PRISMA.md).

## Project Structure

```
.
├── prisma/              # Prisma schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
├── src/
│   ├── app/            # Next.js app directory (routes)
│   ├── components/     # React components
│   ├── lib/            # Utility libraries
│   ├── generated/      # Generated Prisma Client
│   └── actions/        # Server actions
├── public/             # Static assets
└── docs/               # Documentation
    └── PRISMA.md       # Prisma development guide
```

## Database

This template uses SQLite by default with Prisma ORM. The Prisma Client is generated to `src/generated/prisma` for easy imports.

To use a different database:

1. Update `datasource db` in `prisma/schema.prisma`
2. Set `DATABASE_URL` in `.env`
3. Run `npm run db:migrate:dev`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
