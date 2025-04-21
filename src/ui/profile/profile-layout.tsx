import Button from "../common/components/button";
import Divider from "../common/components/Divider";
import AccountNav from "./account-nav";

interface ProfileLayoutProps {
  children: React.ReactNode;
  logOut: () => void;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, logOut }) => {
  return (
    <div className="p-6 md:p-10 lg:p-20 pt-10">
      {/* Top Section */}
      <div className="flex flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button className="uppercase md:w-auto" onClick={logOut}>
          Log Out
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <AccountNav />
        <div className="flex-1">{children}</div>
      </div>

      {/* Footer Section */}
      <div>
        <Divider className="my-16" />
        <h3 className="text-2xl font-bold mb-2">Got Questions?</h3>
        <span className="text-base md:text-lg">
          You can find frequently asked questions and answers on our customer
          service page.
        </span>
      </div>
    </div>
  );
};

export default ProfileLayout;
