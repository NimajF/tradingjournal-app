"use client";

import { useEffect, useState, useTransition } from "react";
import { validatePassword } from "@/lib/validations/validations";
import { changePassword } from "@/app/actions/auth";

// "closing" keeps the form mounted while its exit animation plays.
type Phase = "closed" | "open" | "closing";

export default function ChangePasswordForm() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canSubmit = password.length > 0 && confirm.length > 0;

  const finishClosing = () => {
    setPhase("closed");
    setPassword("");
    setConfirm("");
    setError(null);
  };

  // Safety net -> if the browser never fires animationend (hidden tab, animation
  // disabled), the form would stay stuck in "closing".
  useEffect(() => {
    if (phase !== "closing") return;
    const id = setTimeout(finishClosing, 400);
    return () => clearTimeout(id);
  }, [phase]);

  const handleOpen = () => {
    setSuccess(false);
    setPhase("open");
  };

  const handleCancel = () => setPhase("closing");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) return setError(validationError);
    if (password !== confirm) return setError("Passwords don't match");

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const result = await changePassword(password);
        if (result.error) return setError(result.error);
        setSuccess(true);
        setPhase("closing");
      } catch {
        setError(
          "Couldn't update password. Check your connection and try again.",
        );
      }
    });
  };

  if (phase === "closed") {
    return (
      <div className="flex flex-col items-start gap-2 animate-in fade-in-0 duration-200 motion-reduce:animate-none sm:items-end">
        <button
          type="button"
          onClick={handleOpen}
          className="btn btn-muted btn-sm"
        >
          Change password
        </button>
        {success && (
          <p
            className="text-xs text-muted-fg animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none"
            role="status"
          >
            Password updated. Other devices were signed out.
          </p>
        )}
      </div>
    );
  }

  const isClosing = phase === "closing";

  return (
    <form
      onSubmit={handleSubmit}
      inert={isClosing}
      onAnimationEnd={(e) => {
        // Children (the error message) also fire animationend and bubble up.
        if (isClosing && e.target === e.currentTarget) finishClosing();
      }}
      className={`flex flex-col gap-2 ${
        isClosing
          ? "animate-out fade-out-0 slide-out-to-top-1 fill-mode-forwards duration-150"
          : "animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none"
      }`}
    >
      <input
        type="password"
        aria-label="New password"
        value={password}
        placeholder="New password"
        autoComplete="new-password"
        autoFocus
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null);
        }}
        className="h-8 w-full border px-2.5 text-sm placeholder:text-muted-fg sm:w-64"
      />

      <input
        type="password"
        aria-label="Confirm new password"
        value={confirm}
        placeholder="Confirm new password"
        autoComplete="new-password"
        onChange={(e) => {
          setConfirm(e.target.value);
          setError(null);
        }}
        className="h-8 w-full border px-2.5 text-sm placeholder:text-muted-fg sm:w-64"
      />

      {error && (
        <div
          className="text-xs text-loss animate-in fade-in-0 duration-150 motion-reduce:animate-none"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !canSubmit}
          className="btn btn-primary btn-sm"
        >
          {isPending ? "Updating..." : "Update password"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-ghost btn-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
