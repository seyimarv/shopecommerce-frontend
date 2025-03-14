import { HttpTypes } from "@medusajs/types";
import { sdk } from "../../../config";
import { useQuery } from "@tanstack/react-query";

type fetchCollectionsParams = Record<string, string>;

const fetchCollections = async (
  queryParams: fetchCollectionsParams = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return await sdk.client.fetch<{
    collections: HttpTypes.StoreCollection[];
    count: number;
  }>("/store/collections", {
    query: { ...queryParams, fields: "id,handle,title,metadata" },
  });
};

const fetchCollection = async (id: string): Promise<HttpTypes.StoreCollection> => {
  const { collection } = await sdk.client.fetch<{
    collection: HttpTypes.StoreCollection;
  }>(`/store/collections/${id}`, {
    query: { fields: "id,handle,title,metadata" },
  });
  return collection;
};

export const useFetchCollections = (
  queryParams: fetchCollectionsParams = {}
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(queryParams),
  });

  return { data, isLoading, error };
};

export const useFetchCollection = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collection", id],
    queryFn: () => fetchCollection(id),
  });

  return { data, isLoading, error };
};
