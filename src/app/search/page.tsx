import PageSpinner from "@/ui/common/components/spinner/page-spinner";
import SearchResults from "@/ui/search/results";
import { Suspense } from "react";


const SearchPage = () => {
    return (
        <Suspense fallback={<PageSpinner />}>
            <SearchResults />
        </Suspense>
    );
};

export default SearchPage;