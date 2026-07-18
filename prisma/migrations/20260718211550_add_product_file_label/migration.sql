-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seed" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductFile" ("createdAt", "height", "id", "kind", "productId", "seed", "width") SELECT "createdAt", "height", "id", "kind", "productId", "seed", "width" FROM "ProductFile";
DROP TABLE "ProductFile";
ALTER TABLE "new_ProductFile" RENAME TO "ProductFile";
CREATE INDEX "ProductFile_productId_idx" ON "ProductFile"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
