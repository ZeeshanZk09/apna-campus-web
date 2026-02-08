-- CreateTable
CREATE TABLE "TeacherCohort" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "cohortId" UUID NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherCohort_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherCohort_cohortId_idx" ON "TeacherCohort"("cohortId");

-- CreateIndex
CREATE INDEX "TeacherCohort_teacherId_idx" ON "TeacherCohort"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherCohort_teacherId_cohortId_key" ON "TeacherCohort"("teacherId", "cohortId");

-- AddForeignKey
ALTER TABLE "TeacherCohort" ADD CONSTRAINT "TeacherCohort_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCohort" ADD CONSTRAINT "TeacherCohort_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
