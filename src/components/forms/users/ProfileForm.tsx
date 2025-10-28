// components/forms/users/ProfileForm.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ProfileFormProps {
  userId: string;
  baseUrl: string; // e.g. https://scheddy.us
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

export default function ProfileForm({ userId, profile, baseUrl }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // ----- State -----
  const [business_name, setBusinessName] = useState(profile?.business_name || '');
  const [logo_url, setLogoUrl] = useState(profile?.logo_url || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo_url || null);
  const [website, setWebsite] = useState(profile?.website || '');
  const [first_name, setFirstName] = useState(profile?.first_name || '');
  const [last_name, setLastName] = useState(profile?.last_name || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [address2, setAddress2] = useState(profile?.address2 || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [postal_code, setPostalCode] = useState(profile?.postal_code || '');
  const [phone_number, setPhoneNumber] = useState(profile?.phone_number || '');
  const [email_address, setEmailAddress] = useState(profile?.email_address || '');
  const [slug, setSlug] = useState(profile?.slug || '');

  const [existingImages, setExistingImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const [headerImageFiles, setHeaderImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [headerImagePreviews, setHeaderImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([]);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preview
  const [iframeKey, setIframeKey] = useState(0);
  const previewUrl = useMemo(
    () => `${baseUrl}/book/${(slug || '').trim()}`,
    [baseUrl, slug]
  );
  const refreshPreview = () => setIframeKey(k => k + 1);

  // ----- Effects -----
  useEffect(() => {
    if (profile?.header_images?.length) {
      const imgs = [...profile.header_images];
      while (imgs.length < 5) imgs.push(null);
      setExistingImages(imgs);
      setHeaderImagePreviews(imgs);
      setHeaderImageFiles([null, null, null, null, null]);
      setDeletedIndexes([]);
    }
    setLogoPreview(profile?.logo_url || null);
    setLogoFile(null);
  }, [profile]);

  // ----- Handlers -----
  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : (profile?.logo_url || null));
  };

  const handleDeleteLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl('');
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newFiles = [...headerImageFiles];
    newFiles[index] = file;
    setHeaderImageFiles(newFiles);

    const newPreviews = [...headerImagePreviews];
    newPreviews[index] = file ? URL.createObjectURL(file) : (existingImages[index] || null);
    setHeaderImagePreviews(newPreviews);

    if (deletedIndexes.includes(index)) {
      setDeletedIndexes(prev => prev.filter(i => i !== index));
    }
  };

  const handleDeleteExistingImage = (index: number) => {
    setDeletedIndexes(prev => [...prev, index]);
    const ex = [...existingImages]; ex[index] = null; setExistingImages(ex);
    const pv = [...headerImagePreviews]; pv[index] = null; setHeaderImagePreviews(pv);
    const fl = [...headerImageFiles]; fl[index] = null; setHeaderImageFiles(fl);
  };

  // Upload helper
  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  };

  // Save
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    try {
      // Logo
      let newLogoUrl = logo_url;
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const logoPath = `${userId}/business_logo_${Date.now()}.${ext}`;
        newLogoUrl = await uploadFile(logoFile, 'business-logos', logoPath);
      } else if (!logoPreview) {
        newLogoUrl = '';
      }

      // Header images
      const uploadedUrls = await Promise.all(
        headerImageFiles.map(async (file, idx) => {
          if (file) {
            const ext = file.name.split('.').pop();
            const filePath = `${userId}/header_${idx + 1}_${Date.now()}.${ext}`;
            return await uploadFile(file, 'profile-headers', filePath);
          }
          if (!deletedIndexes.includes(idx)) return existingImages[idx];
          return null;
        })
      );

      const { error } = await supabase
        .from('profiles')
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
        .eq('id', userId);

      if (error) throw error;

      setSuccess(true);
      setExistingImages(uploadedUrls);
      setHeaderImagePreviews(uploadedUrls);
      setHeaderImageFiles([null, null, null, null, null]);
      setDeletedIndexes([]);
      setLogoUrl(newLogoUrl);
      setLogoFile(null);
      setLogoPreview(newLogoUrl || null);

      // Refresh preview + header
      refreshPreview();
      router.refresh();
    } catch (err) {
      console.error('Profile update error:', err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // ----- UI -----
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Form with Tabs */}
      <div className="min-w-0">
        <Tabs defaultValue="general" className="w-full">
          <div className="mb-3">
            <TabsList className="bg-white/10">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="images">Header Images</TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* General Info */}
            <TabsContent value="general" className="mt-0">
              <div className="bg-[#262626] rounded-lg p-4 border border-[#3a3a3a] space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div className="border-t border-[#3a3a3a]" />

                {/* Logo */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">Business Logo</label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Business Logo Preview"
                        className="max-w-xs max-h-32 object-contain border border-[#3a3a3a] rounded bg-[#1f1f1f]"
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
                      onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                    />
                  )}
                </div>

                <div className="border-t border-[#3a3a3a]" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Business Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                    value={business_name}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={email_address}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Website</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Address */}
            <TabsContent value="address" className="mt-0">
              <div className="bg-[#262626] rounded-lg p-4 border border-[#3a3a3a] space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Address 2</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">State</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-[#1f1f1f] border-[#3a3a3a]"
                      value={postal_code}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Header Images */}
            <TabsContent value="images" className="mt-0">
              <div className="bg-[#262626] rounded-lg p-4 border border-[#3a3a3a]">
                <div className="text-gray-400 pb-3">Upload 5 Images for Header Collage</div>
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="mb-4 relative inline-block">
                    <label className="block text-xs font-medium mb-1">Image {index + 1}</label>
                    {headerImagePreviews[index] ? (
                      <>
                        <img
                          src={headerImagePreviews[index]!}
                          alt={`Preview ${index + 1}`}
                          className="mt-2 max-w-xs max-h-32 object-contain border border-[#3a3a3a] rounded bg-[#1f1f1f]"
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
                        onChange={(e) => handleImageChange(index, e.target.files?.[0] ?? null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-white text-[#313131] rounded"
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
              {success && <p className="text-green-500 text-xs">Profile updated!</p>}
            </div>
          </form>
        </Tabs>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="min-w-0">
        <div className="sticky top-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-300">
              Preview:&nbsp;<span className="text-white font-medium">{business_name || 'Business'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshPreview}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs"
                title="Refresh preview"
              >
                Refresh
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-white text-black text-xs"
              >
                Open in new tab
              </a>
            </div>
          </div>

          <div className="border border-[#3a3a3a] rounded-lg overflow-hidden bg-black/20">
            <div className="px-4 py-2 border-b border-[#3a3a3a] flex items-center gap-2">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-6 w-6 rounded object-cover" />
              ) : (
                <div className="h-6 w-6 rounded bg-white/20" />
              )}
              <div className="text-sm font-medium truncate">
                {business_name || 'Your business name'}
              </div>
            </div>

            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Booking page preview"
              className="w-full h-[70vh] bg-black"
            />
          </div>

          <p className="mt-2 text-[11px] text-gray-400">
            Preview shows <code>/book/{slug || 'your-slug'}</code>. It auto-refreshes after saving or via the button.
          </p>
        </div>
      </div>
    </div>
  );
}
