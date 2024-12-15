type DbRecordId = string;

interface WithId {
  id: DbRecordId,
}
interface BaseDbRecord extends WithId {
  createdAt: string // iso datetime
}

type ServerResponse<T extends unknown> = {
  success: boolean,
  message: string,
  data: T,
}

type ServerChangeResponse = ServerResponse<WithId>;

