import { HttpTypes } from "@medusajs/types";
import { sdk } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { getRegion, retrieveRegion } from "./region";
import { SortOptions, sortProducts } from "../utils/sort-products";

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode = "gb",
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  countryCode?: string;
  regionId?: string;
} = {}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  // if (!countryCode && !regionId) {
  //   throw new Error("Country code or region ID is required")
  // }

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = await getRegion(countryCode);
  } else {
    region = await retrieveRegion(regionId!);
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    };
  }

  // const headers = {
  //   ...(await getAuthHeaders()),
  // }

  // const next = {
  //   ...(await getCacheOptions("products")),
  // }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[];
    count: number;
  }>(`/store/products`, {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region?.id,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      ...queryParams,
    },
    //   headers,
    //   next,
    //   cache: "force-cache",
  });
  const nextPage = count > offset + limit ? pageParam + 1 : null;
  return {
    response: {
      products,
      count,
    },
    nextPage: nextPage,
    queryParams,
  };
};

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  countryCode,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 4;
  console.log(sortBy)

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      order: sortBy,
      limit,
    },
    countryCode,
  });

  const sortedProducts = sortProducts(products, sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage = count > pageParam + limit ? pageParam + limit : null;
  const pageLimit = pageParam + limit;

  const paginatedProducts = sortedProducts.slice(pageParam, pageLimit);

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  };
};

export const useListProducts = ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  countryCode?: string;
  regionId?: string;
} = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      listProducts({ pageParam, queryParams, countryCode, regionId }),
  });
  return { data, isLoading, error };
};

export const useListProductsWithSort = ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  countryCode,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
} = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sorted-products"],
    queryFn: () =>
      listProductsWithSort({ page, queryParams, sortBy, countryCode }),
  });
  return { data, isLoading, error };
};
