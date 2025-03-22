/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../../../config";
import medusaError from "../utils/medusa-error";
import { useQuery } from "@tanstack/react-query";

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


export const useRetrieveRegion = (id: string) => {
  return useQuery({
    queryKey: ["region", id],
    queryFn: () => retrieveRegion(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useListRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => listRegions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};


export const useGetRegion = (countryCode: string) => {
  return useQuery({
    queryKey: ["region", "country", countryCode],
    queryFn: () => getRegion(countryCode),
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};


