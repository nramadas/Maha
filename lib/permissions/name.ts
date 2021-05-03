import { i18n } from '@/lib/translate';
import { Permission } from '@/models/Permission';

export function name(
  permission: Permission,
): ReturnType<typeof i18n.translate> {
  switch (permission) {
    case Permission.ManageMembers:
      return i18n.translate`Manage members`;
    case Permission.ManageProperties:
      return i18n.translate`Manage properties`;
    case Permission.ManageSales:
      return i18n.translate`Manage sales`;
    case Permission.ModifyRoles:
      return i18n.translate`Modify roles`;
    case Permission.ViewInsights:
      return i18n.translate`View data insights`;
    case Permission.ViewMembers:
      return i18n.translate`View members`;
    case Permission.ViewProperties:
      return i18n.translate`View properties`;
    case Permission.ViewSales:
      return i18n.translate`View sales`;
  }
}
