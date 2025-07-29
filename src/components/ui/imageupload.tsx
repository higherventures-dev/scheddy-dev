"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // client-side Supabase
const supabase = createClient();

export default function UploadLogo({ userId }: { userId: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const path = `user-${userId}/logo.png`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setErrorMsg("Upload failed. Try again.");
      console.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    // Save logo URL to user profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ logo_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      setErrorMsg("Failed to save logo URL to profile.");
      console.error(updateError.message);
    } else {
      setSuccessMsg("Logo updated successfully.");
      setPreviewUrl(publicUrl);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Upload Your Logo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Logo Preview"
          className="h-24 object-contain rounded border"
        />
      )}

      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
    </div>
  );
}
