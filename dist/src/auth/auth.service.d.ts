import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    private signToken;
    private toSafeUser;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            emailVerified: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            emailVerified: boolean;
        };
    }>;
    me(userId: string): Promise<{
        alumniProfile: {
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            applicationId: string | null;
            phone: string | null;
            linkedin: string | null;
            designation: string;
            organization: string;
            country: string | null;
            batch: string | null;
            certification: import("@prisma/client").$Enums.Certification | null;
            type: import("@prisma/client").$Enums.AlumniType;
            avatarColor: string | null;
            photoUrl: string | null;
            bio: string | null;
            certDiscountPercent: number;
            freeCertifications: string;
            blogAccess: boolean;
            forumAccess: boolean;
        } | null;
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
}
