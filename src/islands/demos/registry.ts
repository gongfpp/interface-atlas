import type { DemoComponent } from '@/islands/DemoStage';

/**
 * Demo 注册表：concept YAML 的 demo.component 键 → React 组件。
 * 由 scripts/gen-registry.mjs 生成（npm run gen:registry），不要手工编辑。
 */
import AccordionDemo from './accordion';
import AccordionExpandDemo from './accordion-expand';
import AlertDemo from './alert';
import AuroraDemo from './aurora';
import AvatarDemo from './avatar';
import BadgeDemo from './badge';
import BauhausDemo from './bauhaus';
import BentoGridDemo from './bento-grid';
import BreadcrumbDemo from './breadcrumb';
import ButtonDemo from './button';
import CardDemo from './card';
import CheckboxDemo from './checkbox';
import CheckoutDemo from './checkout';
import ClaymorphismDemo from './claymorphism';
import CommandPaletteDemo from './command-palette';
import ConfettiDemo from './confetti';
import CyberpunkDemo from './cyberpunk';
import DashboardDemo from './dashboard';
import DatePickerDemo from './date-picker';
import DocumentationDemo from './documentation';
import DragAndDropSortingDemo from './drag-and-drop-sorting';
import DrawerDemo from './drawer';
import DrawerSlideDemo from './drawer-slide';
import DropdownDemo from './dropdown';
import EditorialDemo from './editorial';
import ElasticBounceDemo from './elastic-bounce';
import EmptyStateDemo from './empty-state';
import FilterPanelDemo from './filter-panel';
import FlatDesignDemo from './flat-design';
import FormValidationDemo from './form-validation';
import GlassmorphismDemo from './glassmorphism';
import HoverGlowDemo from './hover-glow';
import HoverLiftDemo from './hover-lift';
import InfiniteScrollDemo from './infinite-scroll';
import InlineEditingDemo from './inline-editing';
import InputDemo from './input';
import KanbanBoardDemo from './kanban-board';
import LandingPageDemo from './landing-page';
import LazyLoadingDemo from './lazy-loading';
import LoadingSpinnerDemo from './loading-spinner';
import LoginDemo from './login';
import MagneticButtonDemo from './magnetic-button';
import MarqueeDemo from './marquee';
import MasterDetailDemo from './master-detail';
import MemphisDemo from './memphis';
import MenuDemo from './menu';
import MinimalismDemo from './minimalism';
import ModalDemo from './modal';
import MorphingIconDemo from './morphing-icon';
import NavbarDemo from './navbar';
import NeobrutalismDemo from './neobrutalism';
import NumberCounterDemo from './number-counter';
import OnboardingTourDemo from './onboarding-tour';
import OptimisticUiDemo from './optimistic-ui';
import PageTransitionDemo from './page-transition';
import PaginationDemo from './pagination';
import ParallaxDemo from './parallax';
import PopoverDemo from './popover';
import PressFeedbackDemo from './press-feedback';
import PricingDemo from './pricing';
import ProfileDemo from './profile';
import ProgressBarDemo from './progress-bar';
import ProgressiveDisclosureDemo from './progressive-disclosure';
import PullToRefreshDemo from './pull-to-refresh';
import RadioDemo from './radio';
import RetroFuturismDemo from './retro-futurism';
import RippleDemo from './ripple';
import ScrollRevealDemo from './scroll-reveal';
import SearchDemo from './search';
import SearchFilteringDemo from './search-filtering';
import SelectDemo from './select';
import SettingsDemo from './settings';
import SharedElementTransitionDemo from './shared-element-transition';
import SidebarDemo from './sidebar';
import SignupDemo from './signup';
import SkeletonLoadingDemo from './skeleton-loading';
import SkeuomorphismDemo from './skeuomorphism';
import SliderDemo from './slider';
import StaggerRevealDemo from './stagger-reveal';
import SwissStyleDemo from './swiss-style';
import SwitchDemo from './switch';
import TableDemo from './table';
import TabsDemo from './tabs';
import TextRevealDemo from './text-reveal';
import TextareaDemo from './textarea';
import ToastDemo from './toast';
import ToastSlideInDemo from './toast-slide-in';
import TooltipDemo from './tooltip';
import UndoActionDemo from './undo-action';
import Y2kDemo from './y2k';

export const demos: Record<string, DemoComponent> = {
  'accordion': AccordionDemo,
  'accordion-expand': AccordionExpandDemo,
  'alert': AlertDemo,
  'aurora': AuroraDemo,
  'avatar': AvatarDemo,
  'badge': BadgeDemo,
  'bauhaus': BauhausDemo,
  'bento-grid': BentoGridDemo,
  'breadcrumb': BreadcrumbDemo,
  'button': ButtonDemo,
  'card': CardDemo,
  'checkbox': CheckboxDemo,
  'checkout': CheckoutDemo,
  'claymorphism': ClaymorphismDemo,
  'command-palette': CommandPaletteDemo,
  'confetti': ConfettiDemo,
  'cyberpunk': CyberpunkDemo,
  'dashboard': DashboardDemo,
  'date-picker': DatePickerDemo,
  'documentation': DocumentationDemo,
  'drag-and-drop-sorting': DragAndDropSortingDemo,
  'drawer': DrawerDemo,
  'drawer-slide': DrawerSlideDemo,
  'dropdown': DropdownDemo,
  'editorial': EditorialDemo,
  'elastic-bounce': ElasticBounceDemo,
  'empty-state': EmptyStateDemo,
  'filter-panel': FilterPanelDemo,
  'flat-design': FlatDesignDemo,
  'form-validation': FormValidationDemo,
  'glassmorphism': GlassmorphismDemo,
  'hover-glow': HoverGlowDemo,
  'hover-lift': HoverLiftDemo,
  'infinite-scroll': InfiniteScrollDemo,
  'inline-editing': InlineEditingDemo,
  'input': InputDemo,
  'kanban-board': KanbanBoardDemo,
  'landing-page': LandingPageDemo,
  'lazy-loading': LazyLoadingDemo,
  'loading-spinner': LoadingSpinnerDemo,
  'login': LoginDemo,
  'magnetic-button': MagneticButtonDemo,
  'marquee': MarqueeDemo,
  'master-detail': MasterDetailDemo,
  'memphis': MemphisDemo,
  'menu': MenuDemo,
  'minimalism': MinimalismDemo,
  'modal': ModalDemo,
  'morphing-icon': MorphingIconDemo,
  'navbar': NavbarDemo,
  'neobrutalism': NeobrutalismDemo,
  'number-counter': NumberCounterDemo,
  'onboarding-tour': OnboardingTourDemo,
  'optimistic-ui': OptimisticUiDemo,
  'page-transition': PageTransitionDemo,
  'pagination': PaginationDemo,
  'parallax': ParallaxDemo,
  'popover': PopoverDemo,
  'press-feedback': PressFeedbackDemo,
  'pricing': PricingDemo,
  'profile': ProfileDemo,
  'progress-bar': ProgressBarDemo,
  'progressive-disclosure': ProgressiveDisclosureDemo,
  'pull-to-refresh': PullToRefreshDemo,
  'radio': RadioDemo,
  'retro-futurism': RetroFuturismDemo,
  'ripple': RippleDemo,
  'scroll-reveal': ScrollRevealDemo,
  'search': SearchDemo,
  'search-filtering': SearchFilteringDemo,
  'select': SelectDemo,
  'settings': SettingsDemo,
  'shared-element-transition': SharedElementTransitionDemo,
  'sidebar': SidebarDemo,
  'signup': SignupDemo,
  'skeleton-loading': SkeletonLoadingDemo,
  'skeuomorphism': SkeuomorphismDemo,
  'slider': SliderDemo,
  'stagger-reveal': StaggerRevealDemo,
  'swiss-style': SwissStyleDemo,
  'switch': SwitchDemo,
  'table': TableDemo,
  'tabs': TabsDemo,
  'text-reveal': TextRevealDemo,
  'textarea': TextareaDemo,
  'toast': ToastDemo,
  'toast-slide-in': ToastSlideInDemo,
  'tooltip': TooltipDemo,
  'undo-action': UndoActionDemo,
  'y2k': Y2kDemo,
};
