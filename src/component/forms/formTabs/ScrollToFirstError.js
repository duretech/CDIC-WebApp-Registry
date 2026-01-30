import { useEffect, useRef } from "react";
import { useFormState } from "react-final-form";

export default function ScrollToFirstError() {
  const { submitFailed, errors } = useFormState({
    subscription: { submitFailed: true, errors: true },
  });

  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Only act once per failed submission
    if (!submitFailed || hasScrolledRef.current) return;

    const firstErrorKey = Object.keys(errors || {})[0];
    
    if (!firstErrorKey) return;

    const timer = setTimeout(() => {
      const firstErrorElement = document.querySelector(
        '.error, [data-test*="validation"], .MuiFormHelperText-root.Mui-error, .MuiFormLabel-root.Mui-error'
      );

      if (!firstErrorElement) return;

      const fieldContainer =
        firstErrorElement.closest('[data-test], .MuiGrid-item, div');

      if (fieldContainer && typeof fieldContainer.scrollIntoView === "function") {
        fieldContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      let input =
         // 1. MUI Autocomplete input
        fieldContainer?.querySelector('.MuiAutocomplete-input:not([disabled])') ||
        // 2. MUI DatePicker input (includes readonly)
        fieldContainer?.querySelector('input[type="text"]:not([disabled]):not([type="hidden"])') ||
        // 3. Regular inputs (excluding readonly)
        fieldContainer?.querySelector('input:not([disabled]):not([type="hidden"]):not([readonly])') ||
        // 4. Select dropdowns
        fieldContainer?.querySelector('select:not([disabled])') ||
        // 5. Textareas
        fieldContainer?.querySelector('textarea:not([disabled])') ||
        // 6. Any input with MuiInputBase class
        fieldContainer?.querySelector('.MuiInputBase-input:not([disabled])') ||
        // 7. Any button or focusable element
        fieldContainer?.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"])') ||
        fieldContainer?.querySelector('button[role="combobox"]')// MUI v5 DatePicker input trigger
        ;

      if (input && typeof input.focus === "function") {
        input.focus({ preventScroll: true });
      }

      // ✅ mark as handled
      hasScrolledRef.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, [submitFailed]); // 👈 removed "errors"

  // reset flag if form is successfully re-submitted
  useEffect(() => {
    if (!submitFailed) {
      hasScrolledRef.current = false;
    }
  }, [submitFailed]);

  return null;
}