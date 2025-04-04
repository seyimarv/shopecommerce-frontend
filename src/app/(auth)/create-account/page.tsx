import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import { PasswordInput } from "@/ui/common/components/input/password-input";

import Button from "@/ui/common/components/button";

const Login = () => {
  return (
    <AuthFormWrapper
      title="register"
      subtitle="Please fill in the fields below:"
      type="register"
    >
      <Input placeholder="First name" size="lg" />
      <Input placeholder="Last name" size="lg" />
      <Input placeholder="Email" size="lg" />
      <PasswordInput placeholder="Password" size="lg" />
      <PasswordInput placeholder="Confirm Password" size="lg" />
      <Button className="mt-2 w-full">Create Account</Button>
    </AuthFormWrapper>
  );
};

export default Login;
