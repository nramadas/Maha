import type { Invite as InviteDBModel } from '@/db/entities/Invite';
import { Data, Invite as InviteModel, DEFAULT_DATA } from '@/models/Invite';

export function convertFromDBModel(dbModel: InviteDBModel): InviteModel {
  const data = {
    ...DEFAULT_DATA,
    ...(dbModel.data as Data),
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
