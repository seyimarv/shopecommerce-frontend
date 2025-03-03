const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center my-20 container">
      <div className="max-w-md w-full">
        <div className="flex min-h-screen flex-col">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
