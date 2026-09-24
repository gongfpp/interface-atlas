import type { DemoComponent } from '@/islands/DemoStage';

/**
 * Demo 注册表：concept YAML 的 demo.component 键 → React 组件。
 * 由 scripts/gen-registry.mjs 生成（npm run gen:registry），不要手工编辑。
 */
import AboutDemo from './about';
import AccordionDemo from './accordion';
import AccordionExpandDemo from './accordion-expand';
import AlertDemo from './alert';
import AltTextDemo from './alt-text';
import AriaLiveDemo from './aria-live';
import ArtDecoDemo from './art-deco';
import AuroraDemo from './aurora';
import AvatarDemo from './avatar';
import BadgeDemo from './badge';
import BauhausDemo from './bauhaus';
import BentoGridDemo from './bento-grid';
import BlogIndexDemo from './blog-index';
import BlogPostDemo from './blog-post';
import BottomSheetDemo from './bottom-sheet';
import BreadcrumbDemo from './breadcrumb';
import BrutalismDemo from './brutalism';
import BulkActionsDemo from './bulk-actions';
import ButtonDemo from './button';
import CalendarDemo from './calendar';
import CardDemo from './card';
import CarouselDemo from './carousel';
import ChangelogDemo from './changelog';
import ChatDemo from './chat';
import CheckboxDemo from './checkbox';
import CheckoutDemo from './checkout';
import ClaymorphismDemo from './claymorphism';
import ColorPaletteDemo from './color-palette';
import ColorPickerDemo from './color-picker';
import ComboboxDemo from './combobox';
import CommandPaletteDemo from './command-palette';
import ConfettiDemo from './confetti';
import ContactDemo from './contact';
import ContrastRatioDemo from './contrast-ratio';
import CookieConsentDemo from './cookie-consent';
import CorporateMemphisDemo from './corporate-memphis';
import CyberpunkDemo from './cyberpunk';
import DashboardDemo from './dashboard';
import DatePickerDemo from './date-picker';
import DocumentationDemo from './documentation';
import DragAndDropDemo from './drag-and-drop';
import DragAndDropSortingDemo from './drag-and-drop-sorting';
import DrawerDemo from './drawer';
import DrawerSlideDemo from './drawer-slide';
import DropdownDemo from './dropdown';
import EditorialDemo from './editorial';
import ElasticBounceDemo from './elastic-bounce';
import ElevationDemo from './elevation';
import EmptyStateDemo from './empty-state';
import Error404Demo from './error-404';
import Error500Demo from './error-500';
import FabDemo from './fab';
import FaqDemo from './faq';
import FeaturesComparisonDemo from './features-comparison';
import FileUploadDemo from './file-upload';
import FilterPanelDemo from './filter-panel';
import FlatDesignDemo from './flat-design';
import FocusRingDemo from './focus-ring';
import FontStackDemo from './font-stack';
import FormValidationDemo from './form-validation';
import GlassmorphismDemo from './glassmorphism';
import HandDrawnDemo from './hand-drawn';
import HelpCenterDemo from './help-center';
import HoverGlowDemo from './hover-glow';
import HoverLiftDemo from './hover-lift';
import InfiniteScrollDemo from './infinite-scroll';
import InlineEditingDemo from './inline-editing';
import InputDemo from './input';
import KanbanBoardDemo from './kanban-board';
import KeyboardNavigationDemo from './keyboard-navigation';
import KeyboardShortcutsDemo from './keyboard-shortcuts';
import LandingPageDemo from './landing-page';
import LazyLoadingDemo from './lazy-loading';
import LightboxDemo from './lightbox';
import LineHeightDemo from './line-height';
import LiquidGlassDemo from './liquid-glass';
import LoadingSpinnerDemo from './loading-spinner';
import LoginDemo from './login';
import MagneticButtonDemo from './magnetic-button';
import MarqueeDemo from './marquee';
import MasterDetailDemo from './master-detail';
import MeasureDemo from './measure';
import MemphisDemo from './memphis';
import MenuDemo from './menu';
import MinimalismDemo from './minimalism';
import ModalDemo from './modal';
import MorphingIconDemo from './morphing-icon';
import MultiSelectDemo from './multi-select';
import NavbarDemo from './navbar';
import NeobrutalismDemo from './neobrutalism';
import NeumorphismDemo from './neumorphism';
import NotificationCenterDemo from './notification-center';
import NumberCounterDemo from './number-counter';
import OnboardingDemo from './onboarding';
import OnboardingTourDemo from './onboarding-tour';
import OptimisticUiDemo from './optimistic-ui';
import OrderConfirmationDemo from './order-confirmation';
import OrganicDemo from './organic';
import PageTransitionDemo from './page-transition';
import PaginationDemo from './pagination';
import ParallaxDemo from './parallax';
import PaywallDemo from './paywall';
import PixelArtDemo from './pixel-art';
import PopoverDemo from './popover';
import PressFeedbackDemo from './press-feedback';
import PricingDemo from './pricing';
import ProfileDemo from './profile';
import ProgressBarDemo from './progress-bar';
import ProgressiveDisclosureDemo from './progressive-disclosure';
import PullToRefreshDemo from './pull-to-refresh';
import RadioDemo from './radio';
import RatingDemo from './rating';
import ReducedMotionDemo from './reduced-motion';
import RetroFuturismDemo from './retro-futurism';
import RippleDemo from './ripple';
import ScrollDrivenAnimationDemo from './scroll-driven-animation';
import ScrollRevealDemo from './scroll-reveal';
import SearchDemo from './search';
import SearchFilteringDemo from './search-filtering';
import SegmentedControlDemo from './segmented-control';
import SelectDemo from './select';
import SemanticColorDemo from './semantic-color';
import SettingsDemo from './settings';
import SharedElementTransitionDemo from './shared-element-transition';
import SidebarDemo from './sidebar';
import SignupDemo from './signup';
import SkeletonLoadingDemo from './skeleton-loading';
import SkeuomorphismDemo from './skeuomorphism';
import SkipLinkDemo from './skip-link';
import SliderDemo from './slider';
import SplitButtonDemo from './split-button';
import SpringAnimationDemo from './spring-animation';
import StaggerRevealDemo from './stagger-reveal';
import StepperDemo from './stepper';
import SwissStyleDemo from './swiss-style';
import SwitchDemo from './switch';
import TableDemo from './table';
import TabsDemo from './tabs';
import TagInputDemo from './tag-input';
import TeamDemo from './team';
import TextRevealDemo from './text-reveal';
import TextareaDemo from './textarea';
import TimelineDemo from './timeline';
import ToastDemo from './toast';
import ToastSlideInDemo from './toast-slide-in';
import ToolbarDemo from './toolbar';
import TooltipDemo from './tooltip';
import TreeViewDemo from './tree-view';
import TypeScaleDemo from './type-scale';
import UndoActionDemo from './undo-action';
import VaporwaveDemo from './vaporwave';
import ViewTransitionDemo from './view-transition';
import WizardDemo from './wizard';
import Y2kDemo from './y2k';

export const demos: Record<string, DemoComponent> = {
  'about': AboutDemo,
  'accordion': AccordionDemo,
  'accordion-expand': AccordionExpandDemo,
  'alert': AlertDemo,
  'alt-text': AltTextDemo,
  'aria-live': AriaLiveDemo,
  'art-deco': ArtDecoDemo,
  'aurora': AuroraDemo,
  'avatar': AvatarDemo,
  'badge': BadgeDemo,
  'bauhaus': BauhausDemo,
  'bento-grid': BentoGridDemo,
  'blog-index': BlogIndexDemo,
  'blog-post': BlogPostDemo,
  'bottom-sheet': BottomSheetDemo,
  'breadcrumb': BreadcrumbDemo,
  'brutalism': BrutalismDemo,
  'bulk-actions': BulkActionsDemo,
  'button': ButtonDemo,
  'calendar': CalendarDemo,
  'card': CardDemo,
  'carousel': CarouselDemo,
  'changelog': ChangelogDemo,
  'chat': ChatDemo,
  'checkbox': CheckboxDemo,
  'checkout': CheckoutDemo,
  'claymorphism': ClaymorphismDemo,
  'color-palette': ColorPaletteDemo,
  'color-picker': ColorPickerDemo,
  'combobox': ComboboxDemo,
  'command-palette': CommandPaletteDemo,
  'confetti': ConfettiDemo,
  'contact': ContactDemo,
  'contrast-ratio': ContrastRatioDemo,
  'cookie-consent': CookieConsentDemo,
  'corporate-memphis': CorporateMemphisDemo,
  'cyberpunk': CyberpunkDemo,
  'dashboard': DashboardDemo,
  'date-picker': DatePickerDemo,
  'documentation': DocumentationDemo,
  'drag-and-drop': DragAndDropDemo,
  'drag-and-drop-sorting': DragAndDropSortingDemo,
  'drawer': DrawerDemo,
  'drawer-slide': DrawerSlideDemo,
  'dropdown': DropdownDemo,
  'editorial': EditorialDemo,
  'elastic-bounce': ElasticBounceDemo,
  'elevation': ElevationDemo,
  'empty-state': EmptyStateDemo,
  'error-404': Error404Demo,
  'error-500': Error500Demo,
  'fab': FabDemo,
  'faq': FaqDemo,
  'features-comparison': FeaturesComparisonDemo,
  'file-upload': FileUploadDemo,
  'filter-panel': FilterPanelDemo,
  'flat-design': FlatDesignDemo,
  'focus-ring': FocusRingDemo,
  'font-stack': FontStackDemo,
  'form-validation': FormValidationDemo,
  'glassmorphism': GlassmorphismDemo,
  'hand-drawn': HandDrawnDemo,
  'help-center': HelpCenterDemo,
  'hover-glow': HoverGlowDemo,
  'hover-lift': HoverLiftDemo,
  'infinite-scroll': InfiniteScrollDemo,
  'inline-editing': InlineEditingDemo,
  'input': InputDemo,
  'kanban-board': KanbanBoardDemo,
  'keyboard-navigation': KeyboardNavigationDemo,
  'keyboard-shortcuts': KeyboardShortcutsDemo,
  'landing-page': LandingPageDemo,
  'lazy-loading': LazyLoadingDemo,
  'lightbox': LightboxDemo,
  'line-height': LineHeightDemo,
  'liquid-glass': LiquidGlassDemo,
  'loading-spinner': LoadingSpinnerDemo,
  'login': LoginDemo,
  'magnetic-button': MagneticButtonDemo,
  'marquee': MarqueeDemo,
  'master-detail': MasterDetailDemo,
  'measure': MeasureDemo,
  'memphis': MemphisDemo,
  'menu': MenuDemo,
  'minimalism': MinimalismDemo,
  'modal': ModalDemo,
  'morphing-icon': MorphingIconDemo,
  'multi-select': MultiSelectDemo,
  'navbar': NavbarDemo,
  'neobrutalism': NeobrutalismDemo,
  'neumorphism': NeumorphismDemo,
  'notification-center': NotificationCenterDemo,
  'number-counter': NumberCounterDemo,
  'onboarding': OnboardingDemo,
  'onboarding-tour': OnboardingTourDemo,
  'optimistic-ui': OptimisticUiDemo,
  'order-confirmation': OrderConfirmationDemo,
  'organic': OrganicDemo,
  'page-transition': PageTransitionDemo,
  'pagination': PaginationDemo,
  'parallax': ParallaxDemo,
  'paywall': PaywallDemo,
  'pixel-art': PixelArtDemo,
  'popover': PopoverDemo,
  'press-feedback': PressFeedbackDemo,
  'pricing': PricingDemo,
  'profile': ProfileDemo,
  'progress-bar': ProgressBarDemo,
  'progressive-disclosure': ProgressiveDisclosureDemo,
  'pull-to-refresh': PullToRefreshDemo,
  'radio': RadioDemo,
  'rating': RatingDemo,
  'reduced-motion': ReducedMotionDemo,
  'retro-futurism': RetroFuturismDemo,
  'ripple': RippleDemo,
  'scroll-driven-animation': ScrollDrivenAnimationDemo,
  'scroll-reveal': ScrollRevealDemo,
  'search': SearchDemo,
  'search-filtering': SearchFilteringDemo,
  'segmented-control': SegmentedControlDemo,
  'select': SelectDemo,
  'semantic-color': SemanticColorDemo,
  'settings': SettingsDemo,
  'shared-element-transition': SharedElementTransitionDemo,
  'sidebar': SidebarDemo,
  'signup': SignupDemo,
  'skeleton-loading': SkeletonLoadingDemo,
  'skeuomorphism': SkeuomorphismDemo,
  'skip-link': SkipLinkDemo,
  'slider': SliderDemo,
  'split-button': SplitButtonDemo,
  'spring-animation': SpringAnimationDemo,
  'stagger-reveal': StaggerRevealDemo,
  'stepper': StepperDemo,
  'swiss-style': SwissStyleDemo,
  'switch': SwitchDemo,
  'table': TableDemo,
  'tabs': TabsDemo,
  'tag-input': TagInputDemo,
  'team': TeamDemo,
  'text-reveal': TextRevealDemo,
  'textarea': TextareaDemo,
  'timeline': TimelineDemo,
  'toast': ToastDemo,
  'toast-slide-in': ToastSlideInDemo,
  'toolbar': ToolbarDemo,
  'tooltip': TooltipDemo,
  'tree-view': TreeViewDemo,
  'type-scale': TypeScaleDemo,
  'undo-action': UndoActionDemo,
  'vaporwave': VaporwaveDemo,
  'view-transition': ViewTransitionDemo,
  'wizard': WizardDemo,
  'y2k': Y2kDemo,
};
