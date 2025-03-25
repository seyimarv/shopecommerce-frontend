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

  console.log(queryParams)

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
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;

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
} = {}) => {
  const { countryCode } = useRegion();
  const { data, isLoading, error } = useQuery({
    queryKey: ["sorted-products", sortBy, filters, page, collectionId],
    queryFn: () =>
      listProductsWithSort({
        page,
        queryParams,
        sortBy,
        countryCode,
        filters,
        collectionId,
      }),
  });
  return { data, isLoading, error };
};
