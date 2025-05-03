import { 
  liteClient as algoliasearch, 
  LiteClient as SearchClient,
} from "algoliasearch/lite"
import { sdk } from "../../../config"

export const searchClient: SearchClient = {
    ...(algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "", 
      process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
    )),
    search: async (params) => {
      const request = Array.isArray(params) ? params[0] : params
      const query = "params" in request ? request.params?.query : 
        "query" in request ? request.query : ""
  
      if (!query) {
        return {
          results: [
            {
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              hitsPerPage: 0,
              processingTimeMS: 0,
              query: "",
              params: "",
            },
          ],
        }
      }
  
      return await sdk.client.fetch(`/store/search/products`, {
        method: "POST",
        body: {
          query,
        },
      })
    },
  }