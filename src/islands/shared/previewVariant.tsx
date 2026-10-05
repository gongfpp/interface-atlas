import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type { PreviewVariants } from '../../lib/solution-variant';

export const PreviewVariantContext = createContext<{
  value: string;
  onChange: (value: string) => void;
} | null>(null);

/** 缩略图沿用局部状态；实验室中的形式由同一个选择 Owner 驱动。 */
export function usePreviewVariant<T extends string>(
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const context = useContext(PreviewVariantContext);
  const [local, setLocal] = useState(initial);
  if (!context) return [local, setLocal];
  return [
    context.value as T,
    (next) =>
      context.onChange(
        typeof next === "function" ? next(context.value as T) : next,
      ),
  ];
}
