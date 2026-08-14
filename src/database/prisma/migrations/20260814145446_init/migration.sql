-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ALUMNI', 'USER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AlumniType" AS ENUM ('AUTOMATIC', 'HONORARY');

-- CreateEnum
CREATE TYPE "Certification" AS ENUM ('CDCS', 'CSDG', 'CITF', 'CTFP', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedin" TEXT,
    "designation" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "yearsExperience" TEXT,
    "careerStage" TEXT,
    "certification" "Certification" NOT NULL,
    "yearCompleted" TEXT NOT NULL,
    "proofFileUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumni_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedin" TEXT,
    "designation" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "country" TEXT,
    "batch" TEXT,
    "certification" "Certification",
    "type" "AlumniType" NOT NULL DEFAULT 'AUTOMATIC',
    "avatarColor" TEXT,
    "photoUrl" TEXT,
    "bio" TEXT,
    "certDiscountPercent" INTEGER NOT NULL DEFAULT 20,
    "freeCertifications" TEXT NOT NULL DEFAULT 'none',
    "blogAccess" BOOLEAN NOT NULL DEFAULT true,
    "forumAccess" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumni_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_privilege_defaults" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "certDiscountPercent" INTEGER NOT NULL DEFAULT 20,
    "blogDiscountPercent" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumni_privilege_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "alumni_applications_status_idx" ON "alumni_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_profiles_userId_key" ON "alumni_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_profiles_applicationId_key" ON "alumni_profiles"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_profiles_email_key" ON "alumni_profiles"("email");

-- CreateIndex
CREATE INDEX "alumni_profiles_type_idx" ON "alumni_profiles"("type");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "alumni_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
