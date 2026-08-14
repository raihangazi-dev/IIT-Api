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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    resend;
    from;
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        this.resend = apiKey ? new resend_1.Resend(apiKey) : null;
        this.from = process.env.EMAIL_FROM ?? 'IIT Alumni <no-reply@iit.org>';
    }
    async sendPasswordResetEmail(to, resetUrl) {
        if (!this.resend) {
            this.logger.log(`[dev email] Password reset link for ${to}: ${resetUrl}`);
            return;
        }
        await this.resend.emails.send({
            from: this.from,
            to,
            subject: 'Reset your IIT Alumni password',
            html: `<p>Click the link below to reset your password. This link expires in 24 hours.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map