"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialsFromName = initialsFromName;
function initialsFromName(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0)
        return '';
    if (parts.length === 1)
        return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
//# sourceMappingURL=initials.js.map