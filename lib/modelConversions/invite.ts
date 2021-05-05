import type { Invite as InviteDBModel } from '@/db/entities/Invite';
import { Invite as InviteModel, DEFAULT_DATA } from '@/models/Invite';

export function convertFromDBModel(dbModel: InviteDBModel): InviteModel {
  const data = {
    ...DEFAULT_DATA,
    ...dbModel.data,
  };

  return {
    created: dbModel.created,
    email: dbModel.email,
    expired: dbModel.expired,
    id: dbModel.id,
    organizationId: dbModel.organizationId,
    type: dbModel.type,
    ...data,
  };
}
