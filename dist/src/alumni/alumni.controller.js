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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlumniController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("@prisma/client");
const alumni_service_1 = require("./alumni.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const create_honorary_dto_1 = require("./dto/create-honorary.dto");
const reject_application_dto_1 = require("./dto/reject-application.dto");
const update_alumni_dto_1 = require("./dto/update-alumni.dto");
const update_privileges_dto_1 = require("./dto/update-privileges.dto");
const update_defaults_dto_1 = require("./dto/update-defaults.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const multer_config_1 = require("../common/upload/multer.config");
let AlumniController = class AlumniController {
    alumniService;
    constructor(alumniService) {
        this.alumniService = alumniService;
    }
    stats() {
        return this.alumniService.stats();
    }
    preview() {
        return this.alumniService.preview();
    }
    createApplication(dto, file) {
        const proofFileUrl = file ? `/uploads/${file.filename}` : undefined;
        return this.alumniService.createApplication(dto, proofFileUrl);
    }
    myApplication(user) {
        return this.alumniService.myApplication(user.email);
    }
    directory(search, certification, country) {
        return this.alumniService.directory({ search, certification, country });
    }
    listApplications(status) {
        return this.alumniService.listApplications(status);
    }
    approveApplication(id, user) {
        return this.alumniService.approveApplication(id, user.userId);
    }
    rejectApplication(id, dto, user) {
        return this.alumniService.rejectApplication(id, user.userId, dto.reason);
    }
    adminDirectory() {
        return this.alumniService.adminDirectory();
    }
    createHonorary(dto, file) {
        const photoUrl = file ? `/uploads/${file.filename}` : undefined;
        return this.alumniService.createHonorary(dto, photoUrl);
    }
    getDefaults() {
        return this.alumniService.getDefaults();
    }
    updateDefaults(dto) {
        return this.alumniService.updateDefaults(dto);
    }
    privilegesList(search) {
        return this.alumniService.privilegesList(search);
    }
    updatePrivileges(id, dto) {
        return this.alumniService.updatePrivileges(id, dto);
    }
    updateAlumni(id, dto) {
        return this.alumniService.updateAlumni(id, dto);
    }
};
exports.AlumniController = AlumniController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('preview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('applications'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('proof', multer_config_1.uploadFileInterceptorOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "createApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('applications/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "myApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUMNI, client_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('certification')),
    __param(2, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "directory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('admin/applications'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "listApplications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)('admin/applications/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "approveApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)('admin/applications/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_application_dto_1.RejectApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "rejectApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('admin/directory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "adminDirectory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)('admin/honorary'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', multer_config_1.uploadFileInterceptorOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_honorary_dto_1.CreateHonoraryDto, Object]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "createHonorary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('admin/privileges/defaults'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "getDefaults", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)('admin/privileges/defaults'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_defaults_dto_1.UpdateDefaultsDto]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "updateDefaults", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('admin/privileges'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "privilegesList", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)('admin/:id/privileges'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_privileges_dto_1.UpdatePrivilegesDto]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "updatePrivileges", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_alumni_dto_1.UpdateAlumniDto]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "updateAlumni", null);
exports.AlumniController = AlumniController = __decorate([
    (0, common_1.Controller)('alumni'),
    __metadata("design:paramtypes", [alumni_service_1.AlumniService])
], AlumniController);
//# sourceMappingURL=alumni.controller.js.map