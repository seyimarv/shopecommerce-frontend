"use client";

import EditProfile from "@/ui/profile/editprofile";
import { useRetrieveCustomer } from "@/lib/data/customer";

const ProfilePage = () => {
  const { data: customer, isLoading, error } = useRetrieveCustomer();
  return (
    <div>
      <h3 className="text-3xl font-bold">Profile</h3>
      <p className="text-lg my-3">
        View and update your profile information, including your name, and phone
        number. You can also update your billing address, or change your
        password.
      </p>
      {customer && <EditProfile customer={customer} />}
    </div>
  );
};

export default ProfilePage;
