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

const fetchCollection = async (
  idOrHandle: string,
  isHandle = false
): Promise<HttpTypes.StoreCollection> => {
  if (isHandle) {
    const { collections } = await sdk.client.fetch<{
      collections: HttpTypes.StoreCollection[];
    }>(`/store/collections`, {
      query: { handle: idOrHandle, fields: "id,handle,title,metadata" },
    });

    if (!collections.length) {
      throw new Error(`Collection with handle ${idOrHandle} not found`);
    }
    return collections[0];
  }

 

  const { collection } = await sdk.client.fetch<{
    collection: HttpTypes.StoreCollection;
  }>(`/store/collections/${idOrHandle}`, {
    query: { fields: "id,handle,title,metadata" },
  });
  return collection;
};

export const useFetchCollections = (
  queryParams: fetchCollectionsParams = {}
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections", queryParams],
    queryFn: () => fetchCollections(queryParams),
  });

  return { data, isLoading, error };
};

export const useFetchCollection = (idOrHandle: string, isHandle = false) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collection", idOrHandle, isHandle],
    queryFn: () => fetchCollection(idOrHandle, isHandle),
  });

  return { data, isLoading, error };
};
