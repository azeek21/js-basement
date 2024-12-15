interface Car extends BaseDbRecord {
  name: string,
}

type CarsResponse = ServerResponse<Car[]>;
type CarResponse = ServerResponse<Car>;
