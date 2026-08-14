"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
const email_service_1 = require("../email/email.service");
const RESET_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    signToken(user) {
        return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    }
    toSafeUser(user) {
        return { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified };
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists.');
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: { name: dto.name, email: dto.email, passwordHash },
        });
        return { accessToken: this.signToken(user), user: this.toSafeUser(user) };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const valid = await argon2.verify(user.passwordHash, dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        return { accessToken: this.signToken(user), user: this.toSafeUser(user) };
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { alumniProfile: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return { ...this.toSafeUser(user), alumniProfile: user.alumniProfile };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { success: true };
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
            },
        });
        const resetUrl = `${process.env.WEB_APP_URL}/reset-password?token=${rawToken}`;
        await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
        return { success: true };
    }
    async resetPassword(dto) {
        const tokenHash = (0, crypto_1.createHash)('sha256').update(dto.token).digest('hex');
        const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('This reset link is invalid or has expired.');
        }
        const passwordHash = await argon2.hash(dto.password);
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
            this.prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
        ]);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map