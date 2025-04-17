import Button from "../common/components/button";
import Divider from "../common/components/Divider";
import AccountNav from "./account-nav";
import { HttpTypes } from "@medusajs/types";

interface ProfileLayoutProps {
  children: React.ReactNode;
  logOut: () => void;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, logOut }) => {
  return (
    <div className="p-20 pt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button className="uppercase" onClick={logOut}>
          Log Out
        </Button>
      </div>

      <div className="flex gap-12 ">
        <AccountNav />
        <div className="flex-1">{children}</div>
      </div>

      <div className="">
        <Divider className="my-24" />
        <h3 className="text-2xl font-bold mb-4">Got Questions?</h3>
        <span className="text-lg">
          You can find frequently asked questions and answers on our customer
          service page.
        </span>
      </div>
    </div>
  );
};

export default ProfileLayout;
