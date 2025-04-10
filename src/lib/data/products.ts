import { HttpTypes } from "@medusajs/types";
import { sdk } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { getRegion, retrieveRegion } from "./region";
import { SortOptions, sortProducts } from "../utils/sort-products";
import { useRegion } from "../context/region-context";

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode = "gb",
  regionId,
  metadata,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  countryCode?: string;
  regionId?: string;
  metadata?: Record<string, unknown>;
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

interface FilterConditions {
  filter?: {
    variants?: {
      prices?: {
        amount?: {
          $gt?: number;
          $lt?: number;
        };
      };
    };
  };
}

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  countryCode,
  filters,
  collectionId,
  metadata,
  isRestocked = false,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
  collectionId?: string;
  filters?: {
    availability?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  };
  metadata?: Record<string, unknown>;
  isRestocked?: boolean;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;
  const offset = (page - 1) * limit;

  const filterConditions: FilterConditions = {};

  if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
    filterConditions.filter = {
      variants: {
        prices: {
          amount: {
            $gt: filters.minPrice,
          },
        },
      },
    };
  }

  if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
    filterConditions.filter = {
      variants: {
        prices: {
          amount: {
            ...filterConditions.filter?.variants?.prices?.amount,
            $lt: filters.maxPrice,
          },
        },
      },
    };
  }

  if (filters?.availability?.length) {
    if (filters.availability.includes("in_stock")) {
      filterConditions.filter = {
        variants: {
          prices: {
            amount: {
              ...filterConditions.filter?.variants?.prices?.amount,
            },
          },
        },
      };
    }
    if (filters.availability.includes("out_of_stock")) {
      filterConditions.filter = {
        ...filterConditions.filter,
        variants: {
          ...filterConditions.filter?.variants,
          prices: {
            amount: {
              ...filterConditions.filter?.variants?.prices?.amount,
            },
          },
        },
      };
    }
  }

  // If not restocked, use the standard listProducts function
  if (!isRestocked) {
    const {
      response: { products, count },
    } = await listProducts({
      pageParam: page,
      queryParams: {
        ...queryParams,
        order: sortBy,
        limit,
        ...(collectionId ? { collection_id: [collectionId] } : {}),
        ...filterConditions,
      },
      countryCode,
      metadata,
    });

    const sortedProducts = sortProducts(products, sortBy);
    const nextPage = count > page * limit ? page + 1 : null;

    return {
      response: {
        products: sortedProducts,
        count,
      },
      nextPage,
      queryParams,
    };
  }
  
  // For restocked products, fetch directly from the restocked endpoint
  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = await getRegion(countryCode);
  } else {
    throw new Error("Country code is required for restocked products");
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    };
  }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[];
    count: number;
  }>(`/store/restocked-products`, {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region?.id,
      currency_code: region?.currency_code,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      order: sortBy,
      ...(collectionId ? { collection_id: [collectionId] } : {}),
      ...filterConditions.filter,
      ...queryParams,
    },
  });

  const sortedProducts = sortProducts(products, sortBy);
  const nextPage = count > offset + limit ? page + 1 : null;

  return {
    response: {
      products: sortedProducts,
      count,
    },
    nextPage,
    queryParams,
  };
};

export const useListProducts = ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  countryCode?: string;
  regionId?: string;
} = {}) => {
  const { countryCode } = useRegion();
  // Create a stable query key that includes the product ID if present
  const queryKey = [
    "products",
    pageParam,
    queryParams,
    countryCode,
    regionId,
  ];
  // if (queryParams && 'id' in queryParams && typeof queryParams.id === 'string') {
  //   queryKey.push(queryParams.id);
  // }

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      listProducts({
        pageParam,
        queryParams,
        countryCode,
        regionId,
      }),
  });
  return { data, isLoading, error };
};

export const useListProductsWithSort = ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  filters,
  collectionId,
  metadata,
  isRestocked = false,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
  collectionId?: string;
  filters?: {
    availability?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  };
  metadata?: Record<string, unknown>;
  isRestocked?: boolean;
} = {}) => {
  const { countryCode } = useRegion();
  const queryKeyPrefix = isRestocked ? "restocked-products" : "sorted-products";
  
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyPrefix, sortBy, filters, page, collectionId, queryParams, metadata, isRestocked],
    queryFn: () =>
      listProductsWithSort({
        page,
        queryParams,
        sortBy,
        countryCode,
        filters,
        collectionId,
        metadata,
        isRestocked,
      }),
  });
  return { data, isLoading, error };
};

// This function is now deprecated, use listProductsWithSort with isRestocked=true instead
export const listRestockedProducts = async ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  countryCode,
  filters,
  collectionId,
  metadata,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
  collectionId?: string;
  filters?: {
    availability?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  };
  metadata?: Record<string, unknown>;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  // For backward compatibility, delegate to the unified function
  return listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    filters,
    collectionId,
    metadata,
    isRestocked: true,
  });
};

// This hook is now deprecated, use useListProductsWithSort with isRestocked=true instead
export const useListRestockedProducts = ({
  page = 1,
  queryParams,
  sortBy = "-created_at",
  filters,
  collectionId,
  metadata,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode?: string;
  collectionId?: string;
  filters?: {
    availability?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  };
  metadata?: Record<string, unknown>;
} = {}) => {
  // For backward compatibility, delegate to the unified hook
  return useListProductsWithSort({
    page,
    queryParams,
    sortBy,
    filters,
    collectionId,
    metadata,
    isRestocked: true,
  });
};

