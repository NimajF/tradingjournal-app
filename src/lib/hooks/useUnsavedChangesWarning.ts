import { useEffect } from "react";

// Asks the browser to confirm before closing, reloading or leaving the site
// while there are unsaved changes. Listens while dirty. A page with a
// beforeunload listener cant go into the back/forward cache, so a clean
// page shouldnt carry one.
export default function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // This is required for Chrome to show the confirmation dialog.
      // Older browsers only show the prompt with this set
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty]);
  return {};
}
