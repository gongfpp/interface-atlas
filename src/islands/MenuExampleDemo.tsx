import type { ComponentType } from 'react';
import type { MenuExample } from '@/lib/menu-examples';
import type { Locale } from '@/lib/i18n';
import { ContextMenu, SplitButton, RadialMenu, ActionSheet, CommandPalette } from './menu-catalogue/ActionMenus';
import { MegaMenu, FlyoutMenu, DrillDown, AccordionMenu, BreadcrumbMenu } from './menu-catalogue/HierarchyMenus';
import { SearchableSelect, MultiSelect, GroupedSelect, TreeSelect, CreatableSelect } from './menu-catalogue/SelectionMenus';
import { WorkspaceSwitcher, ThumbnailMenu, ColorPickerMenu, SortMenu, MentionMenu } from './menu-catalogue/PreviewMenus';
import { AsyncOptions, VirtualizedList, DependentSelects, PinnedRecent, DisabledReasons } from './menu-catalogue/DataMenus';
import { InstantToggles, SliderMenu, UnitCombobox, LivePreviewMenu, TransferDropdown } from './menu-catalogue/ControlMenus';
import { EdgeAwareMenu, ResponsiveOverflow, TearOffMenu, NavigationDrawer, FullscreenMenu } from './menu-catalogue/SpatialMenus';
import { DateRangeMenu, FilterBuilder, ColumnManager, InlineConfirmation, SpringLoadedMenu } from './menu-catalogue/AdvancedMenus';
import '@/styles/menu-catalogue.css';
const demos: Record<string, ComponentType<{locale:Locale}>> = {
 'context-menu':ContextMenu,'split-button':SplitButton,'radial-menu':RadialMenu,'action-sheet':ActionSheet,'command-palette':CommandPalette,
 'mega-menu':MegaMenu,'flyout-menu':FlyoutMenu,'drill-down':DrillDown,'accordion-menu':AccordionMenu,'breadcrumb-menu':BreadcrumbMenu,
 'searchable-select':SearchableSelect,'multi-select':MultiSelect,'grouped-select':GroupedSelect,'tree-select':TreeSelect,'creatable-select':CreatableSelect,
 'workspace-switcher':WorkspaceSwitcher,'thumbnail-menu':ThumbnailMenu,'color-picker-menu':ColorPickerMenu,'sort-menu':SortMenu,'mention-menu':MentionMenu,
 'async-options':AsyncOptions,'virtualized-list':VirtualizedList,'dependent-selects':DependentSelects,'pinned-recent':PinnedRecent,'disabled-reasons':DisabledReasons,
 'instant-toggles':InstantToggles,'slider-menu':SliderMenu,'unit-combobox':UnitCombobox,'live-preview':LivePreviewMenu,'transfer-dropdown':TransferDropdown,
 'edge-aware':EdgeAwareMenu,'responsive-overflow':ResponsiveOverflow,'tear-off':TearOffMenu,'navigation-drawer':NavigationDrawer,'fullscreen-menu':FullscreenMenu,
 'date-range':DateRangeMenu,'filter-builder':FilterBuilder,'column-manager':ColumnManager,'inline-confirmation':InlineConfirmation,'spring-loaded':SpringLoadedMenu,
};
export default function MenuExampleDemo({example,locale}:{example:MenuExample;locale:Locale}) {
 const Demo=demos[example.id];
 return <div className="mc-demo" role="group" aria-label={example[locale]} aria-describedby={`${example.id}-description ${example.id}-hint`}><div className="mc-stage"><Demo locale={locale}/></div><p className="mc-hint" id={`${example.id}-hint`}>{example.hint[locale]}</p></div>;
}
