import { useEffect, useState } from "react";
import api from "../../../api";
import AvatarUpload from "./AvatarUpload";
import ProfileForm from "./ProfileForm";
import "./Profile.css";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    let alive = true;
    api
      .get("/api/profile/me")
      .then((res) => alive && setData(res.data))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const onUpdate = async (payload) => {
    setSaving(true);
    try {
      const { data: updated } = await api.put("/api/profile/me", payload);
      setData(updated);
    } finally {
      setSaving(false);
    }
  };

  const onAvatar = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const { data: updated } = await api.put("/api/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(updated);
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="manager-profile">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Manager Profile</h2>
          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>
        </div>

        <div className="profile-grid">
          <div className="profile-left">
            <AvatarUpload
              src={data?.avatarUrl}
              onChange={onAvatar}
              uploading={uploading}
            />
          </div>
          <div className="profile-right">
            <ProfileForm
              defaultValues={{
                name: data?.name || "",
                department: data?.department || "",
                position: data?.position || "",
                phoneNumber: data?.phoneNumber || "",
                info: data?.info || "",
              }}
              onSubmit={onUpdate}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
