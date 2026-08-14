"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlumniService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const initials_1 = require("../common/utils/initials");
const DEFAULTS_ID = 'default';
let AlumniService = class AlumniService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats() {
        const [registeredAlumni, certifiedAlumni, countries] = await Promise.all([
            this.prisma.alumniProfile.count(),
            this.prisma.alumniProfile.count({ where: { certification: { not: null } } }),
            this.prisma.alumniProfile.findMany({
                where: { country: { not: null } },
                distinct: ['country'],
                select: { country: true },
            }),
        ]);
        return { registeredAlumni, certifiedAlumni, countries: countries.length };
    }
    async preview(limit = 4) {
        const profiles = await this.prisma.alumniProfile.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return profiles.map((p) => ({
            initials: (0, initials_1.initialsFromName)(p.name),
            name: p.name,
            role: p.designation,
            org: p.organization,
        }));
    }
    async directory(query) {
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { organization: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.certification)
            where.certification = query.certification;
        if (query.country)
            where.country = query.country;
        const profiles = await this.prisma.alumniProfile.findMany({ where, orderBy: { createdAt: 'desc' } });
        return profiles.map((p) => ({
            initials: (0, initials_1.initialsFromName)(p.name),
            name: p.name,
            role: p.designation,
            org: p.batch ? `${p.organization} · Batch ${p.batch}` : p.organization,
            badgeVariant: p.type === 'HONORARY' ? 'honorary' : 'verified',
            avatarColor: p.avatarColor ?? undefined,
            country: p.country ?? undefined,
            certification: p.certification ?? undefined,
            contact: { email: p.email, phone: p.phone ?? undefined },
        }));
    }
    async createApplication(dto, proofFileUrl) {
        const pending = await this.prisma.alumniApplication.findFirst({
            where: { email: dto.email, status: client_1.ApplicationStatus.PENDING },
        });
        if (pending) {
            throw new common_1.ConflictException('You already have a pending application submitted with this email.');
        }
        return this.prisma.alumniApplication.create({ data: { ...dto, proofFileUrl } });
    }
    async myApplication(email) {
        const application = await this.prisma.alumniApplication.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });
        if (!application)
            return null;
        return {
            id: application.id,
            status: application.status,
            appliedAt: application.createdAt,
            rejectionReason: application.rejectionReason ?? undefined,
        };
    }
    async listApplications(status) {
        const applications = await this.prisma.alumniApplication.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        return applications.map((a) => ({
            id: a.id,
            initials: (0, initials_1.initialsFromName)(a.fullName),
            name: a.fullName,
            email: a.email,
            org: a.organization,
            cert: `${a.certification} · ${a.yearCompleted}`,
            applied: a.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            proofFileUrl: a.proofFileUrl ?? undefined,
            status: a.status,
        }));
    }
    async approveApplication(id, adminUserId) {
        const application = await this.prisma.alumniApplication.findUnique({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found.');
        if (application.status !== client_1.ApplicationStatus.PENDING) {
            throw new common_1.ConflictException('This application has already been reviewed.');
        }
        const linkedUser = await this.prisma.user.findUnique({ where: { email: application.email } });
        const [profile] = await this.prisma.$transaction([
            this.prisma.alumniProfile.create({
                data: {
                    applicationId: application.id,
                    userId: linkedUser?.id,
                    name: application.fullName,
                    email: application.email,
                    phone: application.phone,
                    linkedin: application.linkedin,
                    designation: application.designation,
                    organization: application.organization,
                    certification: application.certification,
                    batch: application.yearCompleted,
                    type: 'AUTOMATIC',
                },
            }),
            this.prisma.alumniApplication.update({
                where: { id },
                data: { status: client_1.ApplicationStatus.APPROVED, reviewedAt: new Date(), reviewedByUserId: adminUserId },
            }),
            ...(linkedUser
                ? [this.prisma.user.update({ where: { id: linkedUser.id }, data: { role: 'ALUMNI' } })]
                : []),
        ]);
        return profile;
    }
    async rejectApplication(id, adminUserId, reason) {
        const application = await this.prisma.alumniApplication.findUnique({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found.');
        if (application.status !== client_1.ApplicationStatus.PENDING) {
            throw new common_1.ConflictException('This application has already been reviewed.');
        }
        return this.prisma.alumniApplication.update({
            where: { id },
            data: {
                status: client_1.ApplicationStatus.REJECTED,
                reviewedAt: new Date(),
                reviewedByUserId: adminUserId,
                rejectionReason: reason,
            },
        });
    }
    async adminDirectory() {
        const profiles = await this.prisma.alumniProfile.findMany({ orderBy: { createdAt: 'desc' } });
        return profiles.map((p) => ({
            id: p.id,
            initials: (0, initials_1.initialsFromName)(p.name),
            avatarColor: p.avatarColor ?? undefined,
            name: p.name,
            email: p.email,
            org: p.organization,
            type: p.type === 'HONORARY' ? 'honorary' : 'verified',
            typeLabel: p.type === 'HONORARY' ? 'Honorary' : 'Automatic',
            batch: p.batch ?? '—',
            status: 'verified',
        }));
    }
    async updateAlumni(id, dto) {
        const profile = await this.prisma.alumniProfile.findUnique({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Alumni profile not found.');
        return this.prisma.alumniProfile.update({ where: { id }, data: dto });
    }
    async createHonorary(dto, photoUrl) {
        const existing = await this.prisma.alumniProfile.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('An alumni profile with this email already exists.');
        const linkedUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        const [profile] = await this.prisma.$transaction([
            this.prisma.alumniProfile.create({
                data: {
                    userId: linkedUser?.id,
                    name: dto.name,
                    email: dto.email,
                    designation: dto.designation,
                    organization: dto.organization,
                    bio: dto.bio,
                    photoUrl,
                    type: 'HONORARY',
                    certDiscountPercent: 100,
                },
            }),
            ...(linkedUser
                ? [this.prisma.user.update({ where: { id: linkedUser.id }, data: { role: 'ALUMNI' } })]
                : []),
        ]);
        return profile;
    }
    async privilegesList(search) {
        const where = search
            ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { organization: { contains: search, mode: 'insensitive' } }] }
            : {};
        const profiles = await this.prisma.alumniProfile.findMany({ where, orderBy: { createdAt: 'desc' } });
        return profiles.map((p) => ({
            id: p.id,
            initials: (0, initials_1.initialsFromName)(p.name),
            avatarColor: p.avatarColor ?? undefined,
            name: p.name,
            sub: p.type === 'HONORARY' ? 'Honorary member' : 'Automatic member',
            certDiscountPercent: p.certDiscountPercent,
            freeCertifications: p.freeCertifications,
            blogAccess: p.blogAccess,
            forumAccess: p.forumAccess,
        }));
    }
    async updatePrivileges(id, dto) {
        const profile = await this.prisma.alumniProfile.findUnique({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Alumni profile not found.');
        return this.prisma.alumniProfile.update({ where: { id }, data: dto });
    }
    async getDefaults() {
        return this.prisma.alumniPrivilegeDefaults.upsert({
            where: { id: DEFAULTS_ID },
            update: {},
            create: { id: DEFAULTS_ID },
        });
    }
    async updateDefaults(dto) {
        return this.prisma.alumniPrivilegeDefaults.upsert({
            where: { id: DEFAULTS_ID },
            update: dto,
            create: { id: DEFAULTS_ID, ...dto },
        });
    }
};
exports.AlumniService = AlumniService;
exports.AlumniService = AlumniService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlumniService);
//# sourceMappingURL=alumni.service.js.map