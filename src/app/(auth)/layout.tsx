import PageSpinner from "@/ui/common/components/spinner/page-spinner";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center px-4 sm:px-6 my-10 sm:my-16 md:my-20 container">
      <div className="max-w-[340px] sm:max-w-md w-full">
        <div className="flex flex-col py-6 sm:py-8 px-4 sm:px-6 md:px-8">
          <Suspense fallback={<PageSpinner />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default Layout;
