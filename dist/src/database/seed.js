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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(process.env.DATABASE_URL) });
async function main() {
    const adminPasswordHash = await argon2.hash('Admin@1234');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@iit-test.com' },
        update: {},
        create: {
            name: 'IIT Admin',
            email: 'admin@iit-test.com',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            emailVerified: true,
        },
    });
    console.log('Seeded admin user:', admin.email);
    const alumniPasswordHash = await argon2.hash('Alumni@1234');
    const alumniUser = await prisma.user.upsert({
        where: { email: 'alumni@iit-test.com' },
        update: { role: 'ALUMNI' },
        create: {
            name: 'Rafiq Ahmed',
            email: 'alumni@iit-test.com',
            passwordHash: alumniPasswordHash,
            role: 'ALUMNI',
            emailVerified: true,
        },
    });
    await prisma.alumniProfile.upsert({
        where: { email: alumniUser.email },
        update: {},
        create: {
            userId: alumniUser.id,
            name: alumniUser.name,
            email: alumniUser.email,
            phone: '+880 1XXX-XXXXXX',
            designation: 'Trade Finance Manager',
            organization: 'Standard Bank',
            country: 'Bangladesh',
            batch: '2019',
            certification: 'CDCS',
            type: 'AUTOMATIC',
        },
    });
    console.log('Seeded verified alumni user:', alumniUser.email);
    const pendingPasswordHash = await argon2.hash('Pending@1234');
    const pendingUser = await prisma.user.upsert({
        where: { email: 'pending@iit-test.com' },
        update: {},
        create: {
            name: 'Tasnim Rahman',
            email: 'pending@iit-test.com',
            passwordHash: pendingPasswordHash,
            role: 'USER',
            emailVerified: true,
        },
    });
    await prisma.alumniApplication.upsert({
        where: { id: 'seed-pending-application' },
        update: {},
        create: {
            id: 'seed-pending-application',
            fullName: pendingUser.name,
            email: pendingUser.email,
            phone: '+880 1XXX-XXXXXX',
            designation: 'Trade Operations Officer',
            organization: 'ILB Bangladesh',
            certification: 'CDCS',
            yearCompleted: '2024',
            status: 'PENDING',
        },
    });
    console.log('Seeded pending applicant user:', pendingUser.email);
    await prisma.alumniPrivilegeDefaults.upsert({
        where: { id: 'default' },
        update: {},
        create: { id: 'default' },
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map