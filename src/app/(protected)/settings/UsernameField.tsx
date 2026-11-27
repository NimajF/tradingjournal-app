"use client";

import EditableField from "./EditableField";
import { updateUsername } from "@/app/actions/profile";
import { validateUsername } from "@/lib/validations/validations";

const normalizeUsername = (v: string) => v.trim().toLowerCase();

export default function UsernameField({
  defaultValue,
}: {
  defaultValue: string;
}) {
  return (
    <EditableField
      label="Username"
      defaultValue={defaultValue}
      action={updateUsername}
      validate={validateUsername}
      normalize={normalizeUsername}
      prefix="@"
      maxLength={30}
    />
  );
}
