interface Client extends BaseDbRecord {
  firstName: string,
  lastName: string,
  middleName: string,
  inn: string,
}

type ClientsResponse = ServerResponse<Client[]>;
type ClientResponse = ServerResponse<Client>;
