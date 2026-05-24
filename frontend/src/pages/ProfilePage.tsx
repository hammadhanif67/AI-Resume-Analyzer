import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import { profileApi } from "../api/profileApi";
import { Button } from "../components/Button";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { UserAvatar } from "../components/UserAvatar";
import { useAuthStore } from "../store/authStore";
import { getProfileImageUrl } from "../utils/profileImage";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageBytes = 2 * 1024 * 1024;

export function ProfilePage() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showSavedBanner, setShowSavedBanner] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });

  const mutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["profile"], user);
      queryClient.setQueryData(["current-user"], user);
      setProfileImage(null);
      setPreviewUrl("");
      setShowSavedBanner(true);
      void queryClient.invalidateQueries({ queryKey: ["current-user"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name);
      setUser(profileQuery.data);
      return;
    }
    if (authUser && !name) {
      setName(authUser.name);
    }
  }, [authUser, name, profileQuery.data, setUser]);

  useEffect(() => {
    if (!showSavedBanner) {
      return;
    }
    const timer = window.setTimeout(() => setShowSavedBanner(false), 2500);
    return () => window.clearTimeout(timer);
  }, [showSavedBanner]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const user = profileQuery.data ?? authUser;

  const imageSrc = useMemo(() => {
    if (previewUrl) {
      return previewUrl;
    }
    return getProfileImageUrl(user);
  }, [previewUrl, user]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setValidationError("");
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setProfileImage(null);
      setPreviewUrl("");
      return;
    }
    if (!allowedImageTypes.includes(file.type)) {
      setValidationError("Only JPG, PNG, and WEBP images are supported.");
      event.target.value = "";
      return;
    }
    if (file.size > maxImageBytes) {
      setValidationError("Profile image must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    setProfileImage(file);
    setPreviewUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!name.trim()) {
      setValidationError("Name is required.");
      return;
    }
    mutation.mutate({ name: name.trim(), profileImage });
  }

  const previewUser = user ? { ...user, profile_image: imageSrc || user.profile_image, profile_image_url: imageSrc || user.profile_image_url } : null;

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="Manage your account identity, profile image, and session-backed profile data." />
      {profileQuery.isLoading ? <LoadingState message="Loading profile..." /> : null}
      {profileQuery.error && !authUser ? <ErrorState message={profileQuery.error.message} /> : null}
      {user ? (
        <form className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]" onSubmit={handleSubmit}>
          <SectionCard title="Profile image" description="JPG, PNG, or WEBP. Maximum size 2 MB.">
            <div className="flex min-w-0 flex-col items-center text-center">
              <UserAvatar user={previewUser} size="lg" />
              <label className="app-action-secondary mt-4 max-w-full cursor-pointer focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2" htmlFor="profile-image">
                {mutation.isPending ? "Uploading..." : "Upload image"}
                <input accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" id="profile-image" onChange={handleImageChange} type="file" />
              </label>
              {profileImage ? <p className="mt-3 max-w-full truncate text-sm text-muted">{profileImage.name}</p> : null}
            </div>
          </SectionCard>

          <SectionCard title="Account details" description="Name is editable. Email and role are controlled by your account permissions.">
            {(validationError || mutation.error) ? <ErrorState message={validationError || mutation.error?.message || "Profile update failed"} /> : null}
            {showSavedBanner ? <div className="mb-4 rounded-card border border-emerald-200 bg-success-50 p-3 text-sm font-semibold text-success-700">Profile updated successfully.</div> : null}
            {profileQuery.error && authUser ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-700">Using saved account data while the profile endpoint reconnects.</div> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label sm:col-span-2" htmlFor="profile-name">
                Name
                <input className="form-field mt-1.5" disabled={mutation.isPending} id="profile-name" onChange={(event) => setName(event.target.value)} value={name} />
              </label>
              <ReadonlyField label="Email" value={user.email} />
              <div className="score-metric-card">
                <p className="text-xs font-bold uppercase text-muted">Role</p>
                <span className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{user.role}</span>
              </div>
            </div>
            <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Button disabled={mutation.isPending || profileQuery.isLoading} type="submit">{mutation.isPending ? "Saving..." : "Save changes"}</Button>
              <p className="text-sm text-muted">Profile changes persist after refresh.</p>
            </div>
          </SectionCard>
        </form>
      ) : null}
    </>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="score-metric-card">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
