import { useEffect, useState } from "react";

type ClipboardResult = { text: string; state: "copied" | "error" } | null;

/** 只让最近一次复制更新反馈；页面离开时使未完成请求失效。 */
export function createClipboardWriter(
  onResult: (result: ClipboardResult) => void,
  writeText: (text: string) => Promise<void> = (text) => navigator.clipboard.writeText(text),
) {
  let request = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => { request++; clearTimeout(timer); timer = undefined; };
  return {
    cancel,
    async copy(text: string, onCopied: () => void) {
      cancel();
      const current = request;
      onResult(null);
      try {
        await writeText(text);
      } catch {
        if (current === request) onResult({ text, state: "error" });
        return;
      }
      if (current !== request) return;
      onResult({ text, state: "copied" });
      timer = setTimeout(() => {
        if (current === request) onResult(null);
      }, 2000);
      onCopied();
    },
  };
}

export function useClipboard(text: string, onCopied: () => void) {
  const [result, setResult] = useState<ClipboardResult>(null);
  const [writer] = useState(() => createClipboardWriter(setResult));
  useEffect(() => () => writer.cancel(), [writer]);
  return {
    copy: () => writer.copy(text, onCopied),
    copied: result?.text === text && result.state === "copied",
    failed: result?.text === text && result.state === "error",
  };
}
