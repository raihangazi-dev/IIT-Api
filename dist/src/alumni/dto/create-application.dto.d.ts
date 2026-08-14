import { Certification } from '@prisma/client';
export declare class CreateApplicationDto {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    designation: string;
    organization: string;
    yearsExperience?: string;
    careerStage?: string;
    certification: Certification;
    yearCompleted: string;
}
