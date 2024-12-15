import { axiosInstance } from "../axios";
import { sleepFor } from "../utils";
import { CreateCar } from "../validators/car";

const SERVICE_SLUG = '/car'

export async function getAllCars() {
  await sleepFor(5000);
  const res = await axiosInstance.get<CarsResponse>(`${SERVICE_SLUG}/all`);
  return res.data.data;
}

export async function getCarById(id: DbRecordId) {
  const res = await axiosInstance.get<CarResponse>(`${SERVICE_SLUG}/${id}`);
  return res.data.data;
}

export async function addCar(car: CreateCar) {
  const res = await axiosInstance.post<ServerChangeResponse>(`${SERVICE_SLUG}`, car);
  return res.data.data;
}
