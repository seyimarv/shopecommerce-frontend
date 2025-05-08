import Link from "next/link";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  type?: "login" | "register";
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  subtitle,
  children,
  type = "login",
}) => {
  return (
    <>
      <h2 className="text-xl sm:text-2xl tracking-wide uppercase font-light">{title}</h2>
      {subtitle && <p className="my-3 sm:my-4 text-sm sm:text-md text-gray-600">{subtitle}</p>}
      <div className="flex flex-col gap-3 pt-3 sm:pt-4">{children}</div>
      {/* <div className="flex items-center gap-3 py-2">
        <Divider />
        <p className="text-gray-400 font-light">Or continue with</p>
        <Divider />
      </div> */}
      {/* <Button className="w-full bg-secondary" variant="outline">
        <div className="flex gap-2 items-center justify-center">
          <GoogleIcon />
          <span>Log In</span>
        </div>
      </Button> */}
      <p className="text-sm sm:text-md text-gray-500 mt-3 sm:mt-4 font-light">
        {type === "login" ? (
          <>
            Don't have an account yet?{" "}
            <Link
              href="/create-account"
              className="text-gray-900 hover:underline ml-1"
            >
              Create account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-gray-900 hover:underline ml-1">
              Log in
            </Link>
          </>
        )}
      </p>
    </>
  );
};

export default AuthFormWrapper;
