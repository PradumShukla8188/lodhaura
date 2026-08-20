export interface Permission {
  module: string;
  action: string;
}

export interface Role {
  _id: string;
  name: string;
  displayValue: string;
  code?: string;
  permissions?: Permission[];
}

export interface GovUser {
  _id: string;
  roleId?: Role;
  additionalRoles?: Role[];
  department?: any;
}

export const hasPermission = (
  user: GovUser | null | undefined,
  moduleName: string,
  actionName: string
): boolean => {
  if (!user || !user.roleId) return false;

  // Super admin check
  if (user.roleId.name === 'Admin') return true;

  const allRoles: Role[] = [user.roleId];
  if (user.additionalRoles && Array.isArray(user.additionalRoles)) {
    allRoles.push(...user.additionalRoles);
  }

  for (const role of allRoles) {
    if (role && role.permissions && Array.isArray(role.permissions)) {
      const hasAccess = role.permissions.some(
        (p) =>
          (p.module === 'ALL' || p.module === moduleName) &&
          (p.action === 'ALL' || p.action === actionName)
      );
      if (hasAccess) return true;
    }
  }

  return false;
};
