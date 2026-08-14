import { Certification } from '@prisma/client';
export declare class UpdateAlumniDto {
    designation?: string;
    organization?: string;
    batch?: string;
    country?: string;
    certification?: Certification;
}
