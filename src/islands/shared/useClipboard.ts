import { useEffect, useRef, useState } from "react";

export function useClipboard(text: string, onCopied: () => void) {
  const [result, setResult] = useState<{
    text: string;
    state: "copied" | "error";
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, state: "copied" });
      onCopied();
      timer.current = setTimeout(() => setResult(null), 2000);
    } catch {
      setResult({ text, state: "error" });
    }
  };
  return {
    copy,
    copied: result?.text === text && result.state === "copied",
    failed: result?.text === text && result.state === "error",
  };
}
