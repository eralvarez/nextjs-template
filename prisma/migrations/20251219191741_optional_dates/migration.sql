-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_company" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE TABLE "new_member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_member" ("companyId", "createdAt", "id", "role", "updatedAt", "userId") SELECT "companyId", "createdAt", "id", "role", "updatedAt", "userId" FROM "member";
DROP TABLE "member";
ALTER TABLE "new_member" RENAME TO "member";
CREATE INDEX "member_userId_idx" ON "member"("userId");
CREATE INDEX "member_companyId_idx" ON "member"("companyId");
CREATE UNIQUE INDEX "member_userId_companyId_key" ON "member"("userId", "companyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
