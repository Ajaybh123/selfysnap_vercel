import { Divider } from "@mui/material";
import ProfileFildCard from "../../../seller/pages/Account/ProfileFildCard";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const UserDetails = () => {
  const { user } = useAppSelector((store) => store);

  return (
    <div className="flex justify-center py-10">
      <div className="w-full lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">
            Personal Details
          </h1>
        </div>
        <div className="space-y-5">
          <div>
            <ProfileFildCard
              label="Name"
              value={user.user?.fullName || "N/A"}
            />
            <Divider />
            <ProfileFildCard
              label="Email"
              value={user.user?.email || "N/A"}
            />
            <Divider />
            <ProfileFildCard
              label="Mobile"
              value={user.user?.mobile || "N/A"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
