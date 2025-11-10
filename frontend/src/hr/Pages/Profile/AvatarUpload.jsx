export default function AvatarUpload({ src, onChange, uploading }) {
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) onChange(f);
  };
  return (
    <div className="avatar-wrap">
      <img
        className="avatar"
        src={src || "/placeholder-avatar.png"}
        alt="avatar"
      />
      <label className="upload-btn">
        <input type="file" accept="image/*" onChange={onFile} hidden />
        {uploading ? "Uploading..." : "Change Avatar"}
      </label>
    </div>
  );
}
