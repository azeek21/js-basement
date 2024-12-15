import { axiosInstance } from "../axios";
import { sleepFor } from "../utils";
import { CreateClient } from "../validators/client";

const SERVICE_SLUG = '/client'

export async function getAllClients() {
  await sleepFor(5000)
  const res = await axiosInstance.get<ClientsResponse>(`${SERVICE_SLUG}/all`);
  return res.data.data;
}

export async function getClientById(id: DbRecordId) {
  const res = await axiosInstance.get<ClientResponse>(`${SERVICE_SLUG}/${id}`);
  return res.data.data;
}

export async function addClient(payload: CreateClient) {
  const res = await axiosInstance.post<ServerChangeResponse>(`${SERVICE_SLUG}`, payload);
  return res.data.data;
}
