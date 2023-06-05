"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    user: [],
    admin: ['getUsers', 'manageUsers'],
};
const roles = Object.keys(allRoles);
exports.roles = roles;
const roleRights = new Map(Object.entries(allRoles));
exports.roleRights = roleRights;
