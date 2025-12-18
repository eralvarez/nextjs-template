# Prisma Development Guide

This guide covers all operations for developing with Prisma in this Next.js project.

## Table of Contents

- [Overview](#overview)
- [Project Setup](#project-setup)
- [Schema Management](#schema-management)
- [Migrations](#migrations)
- [Prisma Client](#prisma-client)
- [Development Workflow](#development-workflow)
- [NPM Scripts](#npm-scripts)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses Prisma as the ORM (Object-Relational Mapping) tool with SQLite as the database. The Prisma setup includes:

- **Schema Location**: `prisma/schema.prisma`
- **Client Output**: `src/generated/prisma`
- **Database**: SQLite (configurable)
- **Migrations**: `prisma/migrations`

## Project Setup

### Initial Setup

If you're setting up the project for the first time:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run existing migrations:

   ```bash
   npm run db:migrate
   ```

3. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```

### Environment Variables

Create a `.env` file in the root directory (if using a different database):

```env
DATABASE_URL="file:./dev.db"
```

For production or other environments, adjust the connection string accordingly.

## Schema Management

### Schema File Structure

The `prisma/schema.prisma` file defines:

- **Generator**: Configures Prisma Client generation
- **Datasource**: Database connection configuration
- **Models**: Database tables and relationships

Example model:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Modifying the Schema

When making changes to your schema:

1. Edit `prisma/schema.prisma`
2. Create and apply migration (see [Migrations](#migrations))
3. Regenerate client (see [Prisma Client](#prisma-client))

## Migrations

### Creating Migrations

When you modify your schema, create a migration:

```bash
npm run db:migrate:dev
```

This command will:

1. Create a new migration file
2. Apply the migration to your database
3. Regenerate Prisma Client

You'll be prompted to name your migration (e.g., "add_user_model").

### Applying Migrations

For development:

```bash
npm run db:migrate:dev
```

For production:

```bash
npm run db:migrate:deploy
```

### Migration Status

Check the status of your migrations:

```bash
npm run db:migrate:status
```

This shows:

- Applied migrations
- Pending migrations
- Migration history

### Reset Database

⚠️ **Warning**: This will delete all data!

To reset your database and reapply all migrations:

```bash
npm run db:reset
```

This is useful when:

- You want to start fresh in development
- Migrations have gotten into a bad state
- You need to test the full migration sequence

### Resolving Migration Issues

If migrations fail or drift is detected:

1. Check migration status:

   ```bash
   npm run db:migrate:status
   ```

2. For development, reset if needed:

   ```bash
   npm run db:reset
   ```

3. For production, carefully review and manually fix issues

## Prisma Client

### Generating the Client

After any schema change, regenerate the client:

```bash
npm run db:generate
```

The client is generated to `src/generated/prisma` as configured in the schema.

### Using Prisma Client

Import and use the client in your code:

```typescript
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Read
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({
  where: { id: '123' },
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: '123' },
});
```

### Singleton Pattern

For Next.js, use a singleton to avoid multiple instances:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Then import:

```typescript
import { prisma } from '@/lib/prisma';
```

## Development Workflow

### Standard Development Flow

1. **Modify Schema**
   - Edit `prisma/schema.prisma`
   - Add/modify models, fields, relations

2. **Create Migration**

   ```bash
   npm run db:migrate:dev
   ```

   - Name your migration descriptively
   - Review the generated SQL in `prisma/migrations`

3. **Use Updated Client**
   - The client is automatically regenerated
   - Import and use in your code

4. **Test Changes**
   - Use Prisma Studio to inspect data
   - Write/update tests

### Prototyping Without Migrations

During rapid prototyping, you can push schema changes without creating migrations:

```bash
npm run db:push
```

⚠️ This is for development only and can cause data loss!

## NPM Scripts

### Available Scripts

| Script              | Command                                                    | Description                      |
| ------------------- | ---------------------------------------------------------- | -------------------------------- |
| `db:generate`       | `prisma generate --config ./prisma.config.ts`              | Generate Prisma Client           |
| `db:migrate:dev`    | `prisma migrate dev --config ./prisma.config.ts`           | Create and apply migration (dev) |
| `db:migrate:deploy` | `prisma migrate deploy --config ./prisma.config.ts`        | Apply migrations (production)    |
| `db:migrate:status` | `prisma migrate status --config ./prisma.config.ts`        | Check migration status           |
| `db:migrate`        | `prisma migrate deploy --config ./prisma.config.ts`        | Alias for deploy                 |
| `db:reset`          | `prisma migrate reset --config ./prisma.config.ts --force` | Reset database                   |
| `db:push`           | `prisma db push --config ./prisma.config.ts`               | Push schema without migration    |
| `db:pull`           | `prisma db pull --config ./prisma.config.ts`               | Pull schema from database        |
| `db:seed`           | `prisma db seed`                                           | Seed database                    |
| `db:studio`         | `prisma studio --config ./prisma.config.ts`                | Open Prisma Studio               |

### Common Workflows

**Starting a new feature:**

```bash
# Modify schema, then:
npm run db:migrate:dev
```

**Inspecting data:**

```bash
npm run db:studio
```

**Fresh start in development:**

```bash
npm run db:reset
```

**Deploying to production:**

```bash
npm run db:migrate:deploy
```

## Best Practices

### Schema Design

1. **Use UUIDs for IDs**: More secure and distributed-friendly

   ```prisma
   id String @id @default(uuid())
   ```

2. **Add Timestamps**: Track creation and updates

   ```prisma
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   ```

3. **Use Proper Relations**: Define relationships clearly

   ```prisma
   author User @relation(fields: [authorId], references: [id])
   authorId String
   ```

4. **Add Indexes**: For frequently queried fields
   ```prisma
   @@index([email])
   ```

### Migration Best Practices

1. **Descriptive Names**: Use clear, descriptive migration names
2. **Review SQL**: Always review generated SQL before applying
3. **Small Changes**: Create focused migrations for specific changes
4. **Test Rollback**: Ensure migrations can be rolled back if needed
5. **Version Control**: Commit migrations to git

### Client Usage

1. **Use Singleton**: Avoid multiple Prisma Client instances
2. **Handle Errors**: Always wrap database calls in try-catch
3. **Close Connections**: Disconnect when appropriate (e.g., serverless)
4. **Use Transactions**: For related operations
   ```typescript
   await prisma.$transaction([prisma.user.create({ data: userData }), prisma.post.create({ data: postData })]);
   ```

### Performance

1. **Select Fields**: Only query needed fields

   ```typescript
   const users = await prisma.user.findMany({
     select: { id: true, email: true },
   });
   ```

2. **Include Relations**: Use `include` for relations

   ```typescript
   const user = await prisma.user.findUnique({
     where: { id: '123' },
     include: { posts: true },
   });
   ```

3. **Pagination**: Implement pagination for large datasets
   ```typescript
   const posts = await prisma.post.findMany({
     skip: 0,
     take: 10,
   });
   ```

## Troubleshooting

### Common Issues

#### Migration Failed

**Problem**: Migration fails to apply

**Solution**:

1. Check the error message
2. Review the migration SQL
3. For development, try `npm run db:reset`
4. For production, manually fix the issue

#### Client Out of Sync

**Problem**: Prisma Client doesn't match schema

**Solution**:

```bash
npm run db:generate
```

#### Database Drift Detected

**Problem**: Database schema doesn't match migrations

**Solution**:

```bash
npm run db:migrate:status  # Check status
npm run db:reset           # For dev only
```

#### Cannot Find Module '@/generated/prisma'

**Problem**: Client not generated or incorrect path

**Solution**:

```bash
npm run db:generate
```

Check that `output` in schema matches import path.

### Debug Mode

Enable debug logging:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

Or via environment variable:

```bash
DEBUG=prisma:* npm run dev
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

For questions or issues, refer to the [Prisma Community](https://www.prisma.io/community) or project documentation.
