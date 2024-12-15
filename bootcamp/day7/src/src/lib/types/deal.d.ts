
interface Deal extends BaseDbRecord {
  cars: Car[],
  clients: Client[],
}

type DealsResponse = ServerResponse<Deal[]>;
type DealResponse = ServerResponse<Deal>;

