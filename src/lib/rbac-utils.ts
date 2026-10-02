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
  if (user.roleId?.name === 'super_admin' || user.roleId?.name === 'Admin' || (user as any).role === 'admin' || (user as any).role === 'super_admin') return true;

  const allRoles: Role[] = [user.roleId];
  if (user.additionalRoles && Array.isArray(user.additionalRoles)) {
    allRoles.push(...user.additionalRoles);
  }

  const targetModule = moduleName.toLowerCase();
  const targetAction = actionName.toLowerCase();

  for (const role of allRoles) {
    if (role && role.permissions && Array.isArray(role.permissions)) {
      const hasAccess = role.permissions.some(
        (p) =>
          (p.module === 'ALL' || p.module?.toLowerCase() === targetModule) &&
          (p.action === 'ALL' || p.action?.toLowerCase() === targetAction)
      );
      if (hasAccess) return true;
    }
  }

  return false;
};
