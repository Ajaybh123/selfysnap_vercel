import { Divider } from "@mui/material";

interface ProfileFieldCardProps {
  label: string;
  value?: string | number;
}

const ProfileFildCard = ({ label, value }: ProfileFieldCardProps) => {
  return (
    <div className="p-5 flex items-center bg-slate-50">
      <p className="w-20 lg:w-36 pr-5">{label}</p>

      <Divider orientation="vertical" flexItem />

      <p className="pl-4 lg:pl-10 font-semibold lg:text-lg">
        {value ?? "N/A"}
      </p>
    </div>
  );
};

export default ProfileFildCard;
