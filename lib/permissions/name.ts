import { i18n } from '@/lib/translate';
import { LanguagePack } from '@/models/LanguagePack';
import { Permission } from '@/models/Permission';

export function name(
  permission: Permission,
  languagePack: LanguagePack,
): string {
  switch (permission) {
    case Permission.ManageMembers:
      return i18n.translate`Manage members`(languagePack);
    case Permission.ManageProperties:
      return i18n.translate`Manage properties`(languagePack);
    case Permission.ManageSales:
      return i18n.translate`Manage sales`(languagePack);
    case Permission.ModifyRoles:
      return i18n.translate`Modify roles`(languagePack);
    case Permission.ViewInsights:
      return i18n.translate`View data insights`(languagePack);
    case Permission.ViewMembers:
      return i18n.translate`View members`(languagePack);
    case Permission.ViewProperties:
      return i18n.translate`View properties`(languagePack);
    case Permission.ViewSales:
      return i18n.translate`View sales`(languagePack);
  }
}
