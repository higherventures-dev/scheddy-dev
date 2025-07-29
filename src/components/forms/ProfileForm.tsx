"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileFormProps {
  userId: string;
  profile?: {
    businessname?: string;
    logo?: string;
    websitename?: string;
    firstname?: string;
    lastname?: string;
    address?: string;
    address2?: string;
    state?: string;
    postalcode?: string;
    phonenumber?: string;
  };
}

export default function ProfileForm({ userId, profile }: ProfileFormProps) {
  const supabase = createClient();
  const [businessname, setBusinessName] = useState(profile?.businessname || "");
  const [logo, setLogoName] = useState(profile?.logo || "");
  const [websitename, setWebsiteName] = useState(profile?.websitename || "");
  const [firstname, setFirstName] = useState(profile?.firstname || "");
  const [lastname, setLastName ] = useState(profile?.lastname || "");
  const [address, setAddressName ] = useState(profile?.address || "");
  const [address2, setAddress2Name ] = useState(profile?.address2 || "");
  const [state, setStateName ] = useState(profile?.state || "");
  const [postalcode, setPostalCodeName ] = useState(profile?.postalcode || "");
  const [phonenumber, setPhoneNumberName ] = useState(profile?.phonenumber || "");

  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    const { error } = await supabase
         .from("profiles")
         .update({ businessname })
         .eq("id", userId);

    if (!error) setSuccess(true);
   };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block text-xs font-medium mb-1  text-gray-400">Business Logo</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={logo}
          onChange={(e) => setLogoName(e.target.value)}
        />
        <div className="border border-[#313131] mt-2 mb-4"></div>
        <div className=" text-gray-400 pb-4">Basic information</div>
        <label className="block text-xs font-medium mb-1">Business Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={businessname}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <label className="block text-xs font-medium mb-1">Website</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={websitename}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <label className="block text-xs font-medium mb-1">First Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label className="block text-xs font-medium mb-1">Last Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-white text-[#313131] rounded">
        Save
      </button>
      <div>
 
      </div>

      

      {success && <p className="text-green-600">Profile updated!</p>}
    </form>
  );
}

