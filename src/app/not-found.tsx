import Button from "@/ui/common/components/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-12 my-25 h-[50vh]">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-lg text-gray-600 uppercase tracking-wide">
        Oops! Page not found, please return to shop
      </p>
      <Button variant="outline" href="/products" isLink>return</Button>
    </div>
  );
};

export default NotFoundPage;
