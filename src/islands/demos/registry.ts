import type { DemoComponent } from '@/islands/DemoStage';

/**
 * Demo 注册表：concept YAML 的 demo.component 键 → React 组件。
 * 由 scripts/gen-registry.mjs 生成（见 docs/content-guide.md）。
 */
import AuroraDemo from './aurora';
import BauhausDemo from './bauhaus';
import BentoGridDemo from './bento-grid';
import BreadcrumbDemo from './breadcrumb';
import ButtonDemo from './button';
import CheckboxDemo from './checkbox';
import CheckoutDemo from './checkout';
import ClaymorphismDemo from './claymorphism';
import CommandPaletteDemo from './command-palette';
import CyberpunkDemo from './cyberpunk';
import DashboardDemo from './dashboard';
import DatePickerDemo from './date-picker';
import DocumentationDemo from './documentation';
import DragAndDropSortingDemo from './drag-and-drop-sorting';
import DropdownDemo from './dropdown';
import EditorialDemo from './editorial';
import EmptyStateDemo from './empty-state';
import FlatDesignDemo from './flat-design';
import FormValidationDemo from './form-validation';
import GlassmorphismDemo from './glassmorphism';
import HoverGlowDemo from './hover-glow';
import HoverLiftDemo from './hover-lift';
import InfiniteScrollDemo from './infinite-scroll';
import InlineEditingDemo from './inline-editing';
import InputDemo from './input';
import LandingPageDemo from './landing-page';
import LazyLoadingDemo from './lazy-loading';
import LoadingSpinnerDemo from './loading-spinner';
import LoginDemo from './login';
import MagneticButtonDemo from './magnetic-button';
import MasterDetailDemo from './master-detail';
import MemphisDemo from './memphis';
import MinimalismDemo from './minimalism';
import NavbarDemo from './navbar';
import NeobrutalismDemo from './neobrutalism';
import OnboardingTourDemo from './onboarding-tour';
import OptimisticUiDemo from './optimistic-ui';
import PageTransitionDemo from './page-transition';
import PaginationDemo from './pagination';
import PressFeedbackDemo from './press-feedback';
import PricingDemo from './pricing';
import ProfileDemo from './profile';
import ProgressiveDisclosureDemo from './progressive-disclosure';
import PullToRefreshDemo from './pull-to-refresh';
import RadioDemo from './radio';
import RetroFuturismDemo from './retro-futurism';
import ScrollRevealDemo from './scroll-reveal';
import SearchDemo from './search';
import SearchFilteringDemo from './search-filtering';
import SelectDemo from './select';
import SettingsDemo from './settings';
import SidebarDemo from './sidebar';
import SignupDemo from './signup';
import SkeletonLoadingDemo from './skeleton-loading';
import SkeuomorphismDemo from './skeuomorphism';
import SliderDemo from './slider';
import SwissStyleDemo from './swiss-style';
import SwitchDemo from './switch';
import TabsDemo from './tabs';
import TextareaDemo from './textarea';
import UndoActionDemo from './undo-action';
import Y2kDemo from './y2k';

export const demos: Record<string, DemoComponent> = {
  'aurora': AuroraDemo,
  'bauhaus': BauhausDemo,
  'bento-grid': BentoGridDemo,
  'breadcrumb': BreadcrumbDemo,
  'button': ButtonDemo,
  'checkbox': CheckboxDemo,
  'checkout': CheckoutDemo,
  'claymorphism': ClaymorphismDemo,
  'command-palette': CommandPaletteDemo,
  'cyberpunk': CyberpunkDemo,
  'dashboard': DashboardDemo,
  'date-picker': DatePickerDemo,
  'documentation': DocumentationDemo,
  'drag-and-drop-sorting': DragAndDropSortingDemo,
  'dropdown': DropdownDemo,
  'editorial': EditorialDemo,
  'empty-state': EmptyStateDemo,
  'flat-design': FlatDesignDemo,
  'form-validation': FormValidationDemo,
  'glassmorphism': GlassmorphismDemo,
  'hover-glow': HoverGlowDemo,
  'hover-lift': HoverLiftDemo,
  'infinite-scroll': InfiniteScrollDemo,
  'inline-editing': InlineEditingDemo,
  'input': InputDemo,
  'landing-page': LandingPageDemo,
  'lazy-loading': LazyLoadingDemo,
  'loading-spinner': LoadingSpinnerDemo,
  'login': LoginDemo,
  'magnetic-button': MagneticButtonDemo,
  'master-detail': MasterDetailDemo,
  'memphis': MemphisDemo,
  'minimalism': MinimalismDemo,
  'navbar': NavbarDemo,
  'neobrutalism': NeobrutalismDemo,
  'onboarding-tour': OnboardingTourDemo,
  'optimistic-ui': OptimisticUiDemo,
  'page-transition': PageTransitionDemo,
  'pagination': PaginationDemo,
  'press-feedback': PressFeedbackDemo,
  'pricing': PricingDemo,
  'profile': ProfileDemo,
  'progressive-disclosure': ProgressiveDisclosureDemo,
  'pull-to-refresh': PullToRefreshDemo,
  'radio': RadioDemo,
  'retro-futurism': RetroFuturismDemo,
  'scroll-reveal': ScrollRevealDemo,
  'search': SearchDemo,
  'search-filtering': SearchFilteringDemo,
  'select': SelectDemo,
  'settings': SettingsDemo,
  'sidebar': SidebarDemo,
  'signup': SignupDemo,
  'skeleton-loading': SkeletonLoadingDemo,
  'skeuomorphism': SkeuomorphismDemo,
  'slider': SliderDemo,
  'swiss-style': SwissStyleDemo,
  'switch': SwitchDemo,
  'tabs': TabsDemo,
  'textarea': TextareaDemo,
  'undo-action': UndoActionDemo,
  'y2k': Y2kDemo,
};
