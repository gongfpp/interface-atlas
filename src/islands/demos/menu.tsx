import type { DemoComponent } from "@/islands/DemoStage";
import ActionMenu from "../shared/ActionMenu";
const MenuDemo: DemoComponent = ({ mode, locale }) => (
  <ActionMenu
    en={locale === "en"}
    compact={mode === "variants"}
    contextMode={mode === "variants"}
  />
);
export default MenuDemo;
