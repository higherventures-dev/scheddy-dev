"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface LoungeProfileFormProps {
  userId: string;
  profile?: {
    firstname?: string;
    lastname?: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalcode?: string;
    phonenumber?: string;
    emailaddress?: string;
    notes?: string;
  };
}

export default function LoungeProfileForm({ userId, profile }: LoungeProfileFormProps) {
  const supabase = createClient();
  const [firstname, setFirstName] = useState(profile?.firstname || "");
  const [lastname, setLastName ] = useState(profile?.lastname || "");
  const [address, setAddressName ] = useState(profile?.address || "");
  const [address2, setAddress2Name ] = useState(profile?.address2 || "");
  const [city, setCity ] = useState(profile?.address2 || "");
  const [state, setStateName ] = useState(profile?.state || "");
  const [postalcode, setPostalCodeName ] = useState(profile?.postalcode || "");
  const [phonenumber, setPhoneNumberName ] = useState(profile?.phonenumber || "");
  const [emailAddress, setEmailAddress ] = useState(profile?.emailaddress || "");

  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    const { error } = await supabase
         .from("profiles")
         .update({ firstname })
         .eq("id", userId);

    if (!error) setSuccess(true);
   };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <div className=" text-gray-400 pb-4">Basic information</div>
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

