/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../../../config";
import medusaError from "../utils/medusa-error";

export const retrieveRegion = async (id: string) => {
  // const next = {
  //   ...(await getCacheOptions(["regions", id].join("-"))),
  // }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      // next,
      // cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError);
};

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export const listRegions = async () => {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
    })
    .then(({ regions }) => regions)
    .catch(medusaError);
};

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode);
    }

    const regions = await listRegions();

    if (!regions) {
      return null;
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region);
      });
    });

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us");

    return region;
  } catch (e: any) {
    return null;
  }
};
