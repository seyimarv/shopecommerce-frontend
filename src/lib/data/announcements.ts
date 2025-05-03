import { sdk } from "../../../config";

export async function retrieveAnnouncements() {
  const result = await sdk.client.fetch<any>(`store/announcements`);
  return result;
}
