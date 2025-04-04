import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import Button from "@/ui/common/components/button";
import Link from "next/link";
import { PasswordInput } from "@/ui/common/components/input/password-input";

const Login = () => {
  return (
    <AuthFormWrapper
      title="login"
      subtitle="Please enter your e-mail and password:"
    >
      <Input placeholder="Email" size="lg" />
      <PasswordInput placeholder="password" size="lg" />
      <Link href="/forgot-password" className="text-sm font-light block">
        Forgot your password?
      </Link>
      <Button className="mt-2 w-full">Log In</Button>
    </AuthFormWrapper>
  );
};

export default Login;
