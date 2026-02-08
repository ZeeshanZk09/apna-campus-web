-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "prerequisites" TEXT[];

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- CreateTable
CREATE TABLE "Book" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "available" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BorrowRecord" (
    "id" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'BORROWED',

    CONSTRAINT "BorrowRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportRoute" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT,
    "stops" JSONB,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransportRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" UUID NOT NULL,
    "routeId" UUID,
    "plateNumber" TEXT NOT NULL,
    "model" TEXT,
    "driverName" TEXT,
    "driverPhone" TEXT,
    "capacity" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTransport" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "pickup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "name" TEXT,
    "role" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE INDEX "BorrowRecord_userId_idx" ON "BorrowRecord"("userId");

-- CreateIndex
CREATE INDEX "BorrowRecord_bookId_idx" ON "BorrowRecord"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_sku_key" ON "InventoryItem"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTransport_userId_routeId_key" ON "StudentTransport"("userId", "routeId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthRecord_userId_key" ON "HealthRecord"("userId");

-- AddForeignKey
ALTER TABLE "BorrowRecord" ADD CONSTRAINT "BorrowRecord_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRecord" ADD CONSTRAINT "BorrowRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "TransportRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "TransportRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
