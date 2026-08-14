import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationStatus, Role } from '@prisma/client';
import { AlumniService } from './alumni.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateHonoraryDto } from './dto/create-honorary.dto';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { UpdateAlumniDto } from './dto/update-alumni.dto';
import { UpdatePrivilegesDto } from './dto/update-privileges.dto';
import { UpdateDefaultsDto } from './dto/update-defaults.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { uploadFileInterceptorOptions } from '../common/upload/multer.config';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';

@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  // ── Public ──────────────────────────────────────────────────────────────

  @Get('stats')
  stats() {
    return this.alumniService.stats();
  }

  @Get('preview')
  preview() {
    return this.alumniService.preview();
  }

  @Post('applications')
  @UseInterceptors(FileInterceptor('proof', uploadFileInterceptorOptions))
  createApplication(@Body() dto: CreateApplicationDto, @UploadedFile() file?: Express.Multer.File) {
    const proofFileUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.alumniService.createApplication(dto, proofFileUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications/me')
  myApplication(@CurrentUser() user: AuthenticatedUser) {
    return this.alumniService.myApplication(user.email);
  }

  // ── Members: directory ───────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUMNI, Role.ADMIN)
  @Get()
  directory(
    @Query('search') search?: string,
    @Query('certification') certification?: string,
    @Query('country') country?: string,
  ) {
    return this.alumniService.directory({ search, certification, country });
  }

  // ── Admin: applications ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/applications')
  listApplications(@Query('status') status?: ApplicationStatus) {
    return this.alumniService.listApplications(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/applications/:id/approve')
  approveApplication(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.alumniService.approveApplication(id, user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/applications/:id/reject')
  rejectApplication(
    @Param('id') id: string,
    @Body() dto: RejectApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.alumniService.rejectApplication(id, user.userId, dto.reason);
  }

  // ── Admin: directory + honorary ─────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/directory')
  adminDirectory() {
    return this.alumniService.adminDirectory();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/honorary')
  @UseInterceptors(FileInterceptor('photo', uploadFileInterceptorOptions))
  createHonorary(@Body() dto: CreateHonoraryDto, @UploadedFile() file?: Express.Multer.File) {
    const photoUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.alumniService.createHonorary(dto, photoUrl);
  }

  // ── Admin: privileges ────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/privileges/defaults')
  getDefaults() {
    return this.alumniService.getDefaults();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/privileges/defaults')
  updateDefaults(@Body() dto: UpdateDefaultsDto) {
    return this.alumniService.updateDefaults(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/privileges')
  privilegesList(@Query('search') search?: string) {
    return this.alumniService.privilegesList(search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:id/privileges')
  updatePrivileges(@Param('id') id: string, @Body() dto: UpdatePrivilegesDto) {
    return this.alumniService.updatePrivileges(id, dto);
  }

  // ── Admin: edit alumni (kept last — most generic :id route) ────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:id')
  updateAlumni(@Param('id') id: string, @Body() dto: UpdateAlumniDto) {
    return this.alumniService.updateAlumni(id, dto);
  }
}
