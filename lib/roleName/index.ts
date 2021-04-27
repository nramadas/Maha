import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { LanguagePack } from '@/models/LanguagePack';
import { Role } from '@/models/Role';

export function roleName(role: Pick<Role, 'name'>, languagePack: LanguagePack) {
  switch (role.name) {
    case CommonRoleType.Owner:
      return i18n.translate`Owner`(languagePack);
    case CommonRoleType.Manager:
      return i18n.translate`Manager`(languagePack);
    case CommonRoleType.SalesAgent:
      return i18n.translate`Sales Agent`(languagePack);
    default:
      return role.name;
  }
}
