import type { DemoComponent } from "@/islands/DemoStage";
import ActionMenu from "../shared/ActionMenu";
const DropdownDemo: DemoComponent = ({ mode, locale }) => (
  <ActionMenu en={locale === "en"} compact={mode === "variants"} />
);
export default DropdownDemo;
