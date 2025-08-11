'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileFormProps {
  userId: string;
  profile?: {
    business_name?: string;
    logo_url?: string;
    website?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    phone_number?: string;
    email_address?: string;
    slug?: string;
    header_images?: (string | null)[];
  };
}

export default function ProfileForm({ userId, profile }: ProfileFormProps) {
  const supabase = createClient();

  // General info states
  const [business_name, setBusinessName] = useState(profile?.business_name || "");
  const [logo_url, setLogoUrl] = useState(profile?.logo_url || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo_url || null);
  const [website, setWebsite] = useState(profile?.website || "");
  const [first_name, setFirstName] = useState(profile?.first_name || "");
  const [last_name, setLastName] = useState(profile?.last_name || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [address2, setAddress2] = useState(profile?.address2 || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "");
  const [postal_code, setPostalCode] = useState(profile?.postal_code || "");
  const [phone_number, setPhoneNumber] = useState(profile?.phone_number || "");
  const [email_address, setEmailAddress] = useState(profile?.email_address || "");
  const [slug, setSlug] = useState(profile?.slug || "");

  // Header images states (same as before)
  const [existingImages, setExistingImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const [headerImageFiles, setHeaderImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [headerImagePreviews, setHeaderImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([]);

  // Sync header images from profile on mount and when profile changes
  useEffect(() => {
    if (profile?.header_images && profile.header_images.length > 0) {
      // Normalize array length to 5
      const imgs = [...profile.header_images];
      while (imgs.length < 5) imgs.push(null);

      setExistingImages(imgs);
      setHeaderImagePreviews(imgs);
      setHeaderImageFiles([null, null, null, null, null]);
      setDeletedIndexes([]);
    }

    // Sync logo preview & clear file input on profile change
    setLogoPreview(profile?.logo_url || null);
    setLogoFile(null);
  }, [profile]);

  const [activeTab, setActiveTab] = useState<"general" | "images">("general");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logo file change handler
  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(profile?.logo_url || null);
    }
  };

  // Delete logo
  const handleDeleteLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(""); // clear existing logo_url on deletion
  };

  // Handle header image file input change and update preview
  const handleImageChange = (index: number, file: File | null) => {
    const newFiles = [...headerImageFiles];
    newFiles[index] = file;
    setHeaderImageFiles(newFiles);

    const newPreviews = [...headerImagePreviews];
    if (file) {
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newPreviews[index] = existingImages[index] || null;
    }
    setHeaderImagePreviews(newPreviews);

    if (deletedIndexes.includes(index)) {
      setDeletedIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  // Handle deleting existing header image preview
  const handleDeleteExistingImage = (index: number) => {
    setDeletedIndexes((prev) => [...prev, index]);

    const updatedExisting = [...existingImages];
    updatedExisting[index] = null;
    setExistingImages(updatedExisting);

    const updatedPreviews = [...headerImagePreviews];
    updatedPreviews[index] = null;
    setHeaderImagePreviews(updatedPreviews);

    const updatedFiles = [...headerImageFiles];
    updatedFiles[index] = null;
    setHeaderImageFiles(updatedFiles);
  };

  // Upload a single file to specified bucket with a path
  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Upload error for ${path}:`, error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      // Upload logo if new file selected
      let newLogoUrl = logo_url;
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const logoPath = `${userId}/business_logo_${Date.now()}.${ext}`;
        newLogoUrl = await uploadFile(logoFile, 'business-logos', logoPath);
      } else if (!logoPreview) {
        // If logo preview was deleted, clear url
        newLogoUrl = "";
      }

      // Upload header images (existing logic)
      const uploadedUrls = await Promise.all(
        headerImageFiles.map(async (file, idx) => {
          if (file) {
            const ext = file.name.split('.').pop();
            const filePath = `${userId}/header_${idx + 1}_${Date.now()}.${ext}`;
            return await uploadFile(file, 'profile-headers', filePath);
          } else if (!deletedIndexes.includes(idx)) {
            return existingImages[idx];
          } else {
            return null;
          }
        })
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          business_name,
          logo_url: newLogoUrl,
          website,
          first_name,
          last_name,
          address,
          address2,
          city,
          state,
          postal_code,
          phone_number,
          email_address,
          slug,
          header_images: uploadedUrls,
        })
        .eq("id", userId);

      if (error) {
        console.error("Profile update error:", error);
        setSuccess(false);
      } else {
        setSuccess(true);
        setExistingImages(uploadedUrls);
        setHeaderImagePreviews(uploadedUrls);
        setHeaderImageFiles([null, null, null, null, null]);
        setDeletedIndexes([]);

        setLogoUrl(newLogoUrl);
        setLogoFile(null);
        setLogoPreview(newLogoUrl || null);
      }
    } catch (err) {
      console.error("Error uploading images or updating profile", err);
      setSuccess(false);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium ${
            activeTab === "general" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          type="button"
        >
          General Info
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 font-medium ${
            activeTab === "images" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          type="button"
        >
          Header Images
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {activeTab === "general" && (
          <>
            <div>
              <label className="block text-xs font-medium mb-1">Slug</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-3"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="border border-[#313131] mt-2 mb-4"></div>

            {/* Logo Upload Field */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-400">
                Business Logo
              </label>

              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Business Logo Preview"
                    className="max-w-xs max-h-32 object-contain border rounded"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteLogo}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-center leading-6 hover:bg-red-700"
                    aria-label="Delete business logo"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    handleLogoChange(file);
                  }}
                />
              )}
            </div>

            <div className="border border-[#313131] mt-2 mb-4"></div>

            <div className="text-gray-400 pb-4">Basic information</div>
            {/* The rest of the general info fields */}
            <label className="block text-xs font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Business Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={business_name}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Address 2</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">State</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={postal_code}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-2 border rounded mb-3"
              value={email_address}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <label className="block text-xs font-medium mb-1">Website</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </>
        )}

        {activeTab === "images" && (
          <div>
            <div className="text-gray-400 pb-4">Upload 5 Images for Header Collage</div>
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="mb-4 relative inline-block">
                <label className="block text-xs font-medium mb-1">Image {index + 1}</label>

                {headerImagePreviews[index] ? (
                  <>
                    <img
                      src={headerImagePreviews[index]!}
                      alt={`Preview ${index + 1}`}
                      className="mt-2 max-w-xs max-h-32 object-contain border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-center leading-6 hover:bg-red-700"
                      aria-label={`Delete image ${index + 1}`}
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      handleImageChange(index, file);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-white text-[#313131] rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {success && <p className="text-green-600">Profile updated!</p>}
      </form>
    </div>
  );
}
