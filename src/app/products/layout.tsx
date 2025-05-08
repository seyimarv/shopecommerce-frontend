import { Suspense } from "react";
import PageSpinner from "@/ui/common/components/spinner/page-spinner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container px-4 sm:px-6 md:px-8 mt-6 md:mt-10 lg:mt-15 pb-10 md:pb-20 lg:pb-30">
      <Suspense fallback={<PageSpinner />}>
        {children}
      </Suspense>
    </div>
  );
};

export default Layout;
