"use client";

import { useState } from "react";
import { useFormik } from "formik";

import { useUpdateCustomer } from "@/lib/data/customer";
import { HttpTypes } from "@medusajs/types";
import Button from "../common/components/button";
import Divider from "../common/components/Divider";
import { Input } from "../common/components/input";

type CustomerProps = {
  customer: HttpTypes.StoreCustomer;
};

export default function EditProfile({ customer }: CustomerProps) {
  const [editMode, setEditMode] = useState(false);
  // const [editPassword, setEditPassword] = useState(false);
  // const [passwordValues, setPasswordValues] = useState({
  //   old_password: "",
  //   new_password: "",
  //   confirm_password: "",
  // });

  const { mutate: updateCustomer, isPending: isSavingProfile } =
    useUpdateCustomer();
  // const { mutate: updatePassword, isPending: isUpdatingPassword } =
  //   useUpdatePassword();

  const formik = useFormik({
    initialValues: {
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      phone: customer.phone || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateCustomer(values, {
        onSuccess: () => {
          setEditMode(false);
        },
        onError: () => alert("Failed to update profile."),
      });
    },
  });

  // const handlePasswordChange = () => {
  //   const { new_password, confirm_password } = passwordValues;

  //   if (new_password !== confirm_password) {
  //     alert("Passwords do not match.");
  //     return;
  //   }

  //   const authHeader = getAuthHeaders();
  //   if (!authHeader?.authorization) {
  //     alert("Session expired. Please log in again.");
  //     return;
  //   }

  //   const token = authHeader.authorization.replace("Bearer ", "");

  //   updatePassword(
  //     {
  //       email: customer.email,
  //       password: new_password,
  //       token,
  //     },
  //     {
  //       onSuccess: () => {
  //         alert("Password updated successfully!");
  //         setEditPassword(false);
  //         setPasswordValues({
  //           old_password: "",
  //           new_password: "",
  //           confirm_password: "",
  //         });
  //         setTimeout(() => {
  //           removeAuthToken();
  //           window.location.href = "/account/login";
  //         }, 1500);
  //       },
  //       onError: () => {
  //         console.error;
  //         alert("Failed to update password. Please try again.");
  //       },
  //     }
  //   );
  // };

  return (
    <>
      {editMode ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="my-4">
            <Input
              placeholder="First name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="my-4">
            <Input
              placeholder="Last name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="my-4">
            <Input
              placeholder="Phone Number"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="tracking-wide">
          <span className="uppercase text-lg font-bold">Name</span>
          <p>
            {customer.first_name} {customer.last_name}
          </p>
          <Divider className="my-3" />

          <span className="uppercase text-lg font-bold">Phone Number</span>
          <p>{customer.phone}</p>

          {/* 
          <div className="flex flex-col">
            {!editPassword ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="uppercase text-lg font-bold">Password</span>
                  <p className="text-sm">
                    The password is not shown for security reasons.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditPassword(true)}
                >
                  Edit Password
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Old password"
                  type="password"
                  name="old_password"
                  value={passwordValues.old_password}
                  onChange={(e) =>
                    setPasswordValues({
                      ...passwordValues,
                      old_password: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  placeholder="New password"
                  type="password"
                  name="new_password"
                  value={passwordValues.new_password}
                  onChange={(e) =>
                    setPasswordValues({
                      ...passwordValues,
                      new_password: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  name="confirm_password"
                  value={passwordValues.confirm_password}
                  onChange={(e) =>
                    setPasswordValues({
                      ...passwordValues,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditPassword(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePasswordChange}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div> */}

          <Divider className="my-6" />
          <Button type="button" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </div>
      )}
    </>
  );
}
