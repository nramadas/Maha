import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { LanguagePack } from '@/models/LanguagePack';
import { Role } from '@/models/Role';

export function description(
  role: Pick<Role, 'name' | 'description'>,
  languagePack: LanguagePack,
) {
  switch (role.name) {
    case CommonRoleType.Owner:
      return i18n.translate`Owner of the company. Cannot be changed, added, or removed.`(
        languagePack,
      );
    case CommonRoleType.Manager:
      return i18n.translate`A manager within the company.`(languagePack);
    case CommonRoleType.SalesAgent:
      return i18n.translate`Responsible to selling properties.`(languagePack);
    default:
      return role.description || '';
  }
}
