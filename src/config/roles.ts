interface RoleRights {
  [role: string]: string[];
}

const allRoles: RoleRights = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles: string[] = Object.keys(allRoles);
const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));

export { roles, roleRights };
