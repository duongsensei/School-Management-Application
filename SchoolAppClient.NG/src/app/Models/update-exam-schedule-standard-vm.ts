import { CreateExamSubjectWithScheduleVM } from "./create-exam-subject-with-schedule-vm";

export class UpdateExamScheduleStandardVM {
  examScheduleStandardId = 0;
  examScheduleId !: number;
  standardId !: number;
  examSubjects: CreateExamSubjectWithScheduleVM[] = [];

}
