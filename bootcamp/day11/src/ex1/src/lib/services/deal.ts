import { axiosInstance } from "../axios";
import { sleepFor } from "../utils";
import { CreateDeal } from "../validators/deal";

const SERVICE_SLUG = '/deal'

export async function getAllDeals() {
  await sleepFor(1000)
  const res = await axiosInstance.get<DealsResponse>(`${SERVICE_SLUG}/all`);
  return res.data.data;
}

export async function getCDealById(id: DbRecordId) {
  const res = await axiosInstance.get<DealResponse>(`${SERVICE_SLUG}/${id}`);
  return res.data.data;
}

export async function addDeal(payload: CreateDeal) {
  const res = await axiosInstance.post<ServerChangeResponse>(`${SERVICE_SLUG}`, payload);
  return res.data.data;
}
