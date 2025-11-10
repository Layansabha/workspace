// ProfileForm.jsx
import { useState } from "react";

export default function ProfileForm({
  defaultValues,
  onSubmit,
  saving = false,
}) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [department, setDepartment] = useState(defaultValues?.department ?? "");
  const [position, setPosition] = useState(defaultValues?.position ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValues?.phoneNumber ?? ""
  );
  const [info, setInfo] = useState(defaultValues?.info ?? "");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name, department, position, phoneNumber, info });
  };

  return (
    <form className="profile-form" onSubmit={submit}>
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={saving}
      />

      <label>Department</label>
      <input
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        disabled={saving}
      />

      <label>Position</label>
      <input
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        disabled={saving}
      />

      <label>Phone Number</label>
      <input
        type="tel"
        inputMode="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={saving}
      />

      <label>Info</label>
      <textarea
        rows={3}
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        disabled={saving}
      />

      <button type="submit" className="save-btn" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
