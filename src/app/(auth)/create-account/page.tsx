import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import { PasswordInput } from "@/ui/common/components/input/password-input";

import Button from "@/ui/common/components/button";

const Login = () => {
  return (
    <AuthFormWrapper
      title="register"
      subtitle="Please fill in the fields below:"
    >
      <Input placeholder="First name" size="lg" />
      <Input placeholder="Last name" size="lg" />
      <Input placeholder="Email" size="lg" />
      <PasswordInput placeholder="password" size="lg" />
      <PasswordInput placeholder="Confirm password" size="lg" />
      <Button className="mt-2 w-full">create</Button>
    </AuthFormWrapper>
  );
};

export default Login;
