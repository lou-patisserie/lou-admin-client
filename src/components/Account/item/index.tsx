import { CircleUserRound, Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ProfileType } from "@/types/data-types";
import EditModal from "../modal/editModal";
import { Button } from "@/components/UI/Button";

interface ProfileItemsProps {
  profile: ProfileType;
  refetch: () => void;
}

export default function ProfileItems({ profile, refetch }: ProfileItemsProps) {
  const { ID, role_id, username, email, avatar } = profile;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const role = role_id === 3 ? "manager" : role_id === 2 ? "admin" : "user";

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <Image
          alt="avatar image"
          width={60}
          height={60}
          className="rounded-[100%]"
          src={avatar?.startsWith("http") ? avatar : "/assets/user-profile.png"}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "/assets/user-profile.png";
          }}
        />
      </div>
      <div className={`flex gap-2 items-start py-4`}>
        <div className="text-black w-full text-start text-sm flex flex-col pt-2">
          <p>
            ID : <span>{ID}</span>
          </p>
          <div className="w-full h-[2px] bg-gray-500 opacity-80 my-2" />
          <p>
            Username : <span>{username}</span>
          </p>
          <div className="w-full h-[2px] bg-gray-500 opacity-80 my-2" />
          <p>
            Role : <span>{role}</span>
          </p>
          <div className="w-full h-[2px] bg-gray-500 opacity-80 my-2" />
          <p>
            Email : <span>{email}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 self-end">
        <div onClick={() => setEditModalOpen(true)}>
          <Button className="transition duration-150 bg-luoDarkBiege ">
            Update
          </Button>
        </div>
      </div>
      <EditModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        profileId={ID}
        refetch={refetch}
      />
    </div>
  );
}
