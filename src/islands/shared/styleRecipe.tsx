import type { ReactNode } from 'react';
import type { StyleId, StyleVariant, VariantDemoProps } from '../style-variants/types';

/** 实际组件使用的材质、字形与空间配方；不是套在既有截图外的换色壳。 */
export type RecipeStyleId = 'minimalism' | 'flat-design' | 'swiss-style' | 'neobrutalism' | 'glassmorphism' | 'cyberpunk' | 'neumorphism' | 'organic' | 'editorial' | 'art-deco' | 'hand-drawn' | 'bauhaus' | 'pixel-art' | 'brutalism' | 'corporate-memphis' | 'aurora' | 'liquid-glass' | 'claymorphism' | 'y2k' | 'retro-futurism' | 'skeuomorphism';
type Recipe = { frame: string; header: string; title: string; body: string; item: string; active: string; control: string; secondary: string; field: string; muted: string; divider: string };
const focus = 'min-h-11 min-w-11 max-w-full focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';
const basic = 'px-3 py-2 text-sm';
const recipes: Record<RecipeStyleId, Recipe> = {
  brutalism: {
    frame: 'border-2 border-[#eaff00] bg-black p-5 font-mono text-[#eaff00]', header: 'mb-5 border-b-2 border-[#eaff00] pb-4', title: 'break-words text-4xl font-black uppercase leading-none tracking-tighter', body: 'space-y-3',
    item: 'border-2 border-[#eaff00] bg-black p-3', active: 'bg-[#eaff00] font-black text-black', control: `${basic} border-2 border-[#eaff00] bg-[#eaff00] font-black uppercase text-black`, secondary: `${basic} border-2 border-[#eaff00] bg-black font-mono text-[#eaff00]`, field: `${basic} w-full border-2 border-[#eaff00] bg-black font-mono text-[#eaff00]`, muted: 'text-[#d8de8f]', divider: 'border-[#eaff00]',
  },
  'corporate-memphis': {
    frame: 'rounded-2xl bg-[#e8f3ff] p-5 text-[#1f2a44]', header: 'mb-5 flex items-center gap-4', title: 'text-xl font-extrabold', body: 'space-y-4',
    item: 'rounded-xl border border-[#6783a7] bg-white p-4', active: 'bg-[#284e94] font-bold text-white', control: `${basic} rounded-full bg-[#284e94] font-bold text-white`, secondary: `${basic} rounded-full border border-[#6783a7] bg-white text-[#1f2a44]`, field: `${basic} w-full rounded-xl border border-[#6783a7] bg-white text-[#1f2a44]`, muted: 'text-[#4a5b7c]', divider: 'border-[#6783a7]',
  },
  aurora: {
    frame: 'rounded-2xl border border-[#899bce] bg-[radial-gradient(ellipse_at_top_left,#345290,transparent_65%),radial-gradient(ellipse_at_bottom_right,#743e91,transparent_65%),linear-gradient(#0b1428,#0b1428)] p-6 text-[#edf1ff]', header: 'mb-5 border-b border-[#899bce] pb-4', title: 'text-2xl font-semibold tracking-tight', body: 'space-y-4',
    item: 'rounded-xl border border-[#899bce] bg-[#14223e]/90 p-4 shadow-[0_0_24px_#8666ce30]', active: 'bg-[#d6dffa] text-[#162844]', control: `${basic} rounded-full border border-[#a7b6ed] bg-[#d6dffa] font-semibold text-[#162844]`, secondary: `${basic} rounded-full border border-[#a7b6ed] bg-[#14223e]/90 text-[#edf1ff]`, field: `${basic} w-full rounded-xl border border-[#a7b6ed] bg-[#14223e]/90 text-[#edf1ff]`, muted: 'text-[#c5d2f1]', divider: 'border-[#899bce]',
  },
  'liquid-glass': {
    frame: 'rounded-[2rem] border border-white bg-gradient-to-br from-[#23557b] via-[#50437b] to-[#813e62] p-6 text-white shadow-[inset_0_2px_1px_#ffffff80]', header: 'mb-5 rounded-full border border-white/80 bg-white/15 px-5 py-4 shadow-[inset_0_2px_4px_#ffffff70] backdrop-blur-xl', title: 'text-xl font-medium tracking-wide', body: 'space-y-4',
    item: 'rounded-3xl border border-white/80 bg-[#213653]/85 p-4 shadow-[inset_0_2px_3px_#ffffff60,0_8px_18px_#00000030] backdrop-blur-xl', active: 'bg-[#e4f5ff] text-[#173b60]', control: `${basic} rounded-full border-2 border-white/90 bg-[#e4f5ff] font-semibold text-[#173b60] shadow-[inset_0_3px_4px_#fff,0_5px_12px_#00000030]`, secondary: `${basic} rounded-full border border-white/80 bg-[#213653]/85 text-white shadow-[inset_0_1px_3px_#ffffff60]`, field: `${basic} w-full rounded-2xl border border-white/80 bg-[#213653]/85 text-white`, muted: 'text-[#edf3ff]', divider: 'border-white/70',
  },
  claymorphism: {
    frame: 'rounded-[2rem] bg-[#f0e7ff] p-6 text-[#483967]', header: 'mb-5 rounded-3xl bg-[#d6c4f3] p-4 shadow-[inset_3px_3px_6px_#ffffff,inset_-4px_-4px_8px_#b5a0d4]', title: 'text-xl font-extrabold', body: 'space-y-5',
    item: 'rounded-3xl border border-[#8e7aa9] bg-[#f7f0ff] p-4 shadow-[inset_3px_3px_5px_#fff,inset_-4px_-4px_7px_#cfbde5,0_6px_0_#bda5d7]', active: 'bg-[#d5efdf] font-bold text-[#284e37]', control: `${basic} rounded-2xl border border-[#826a9e] bg-[#d4b6f3] font-extrabold text-[#483967] shadow-[inset_2px_2px_4px_#fff,0_5px_0_#a38abd] enabled:active:shadow-none`, secondary: `${basic} rounded-2xl border border-[#8e7aa9] bg-[#f7f0ff] font-semibold text-[#483967] shadow-[inset_2px_2px_4px_#fff,0_4px_0_#cbb9df]`, field: `${basic} w-full rounded-2xl border border-[#8e7aa9] bg-[#f7f0ff] text-[#483967] shadow-[inset_3px_3px_5px_#cfbde5]`, muted: 'text-[#645175]', divider: 'border-[#8e7aa9]',
  },
  y2k: {
    frame: 'rounded-[1.8rem] border-2 border-[#6885aa] bg-gradient-to-br from-[#c8f0ff] to-[#eed5ff] p-6 text-[#233f66]', header: 'mb-5 rounded-full border-2 border-white bg-gradient-to-b from-white to-[#9fb8d6] p-4 shadow-[0_4px_0_#8296b4,inset_0_2px_3px_#fff]', title: 'text-xl font-black italic', body: 'space-y-4',
    item: 'rounded-2xl border-2 border-[#6885aa] bg-gradient-to-b from-white to-[#bdd6ed] p-4 shadow-[inset_0_2px_2px_#fff,0_6px_14px_#6d7c9a40]', active: 'bg-[#ecc3f4] font-bold text-[#50295e]', control: `${basic} rounded-full border-2 border-[#76588a] bg-gradient-to-b from-[#ffe3ff] to-[#d4a5e5] font-black text-[#50295e] shadow-[inset_0_2px_3px_#fff,0_3px_0_#9671a5]`, secondary: `${basic} rounded-full border-2 border-[#6885aa] bg-gradient-to-b from-white to-[#bdd6ed] font-semibold text-[#233f66]`, field: `${basic} w-full rounded-full border-2 border-[#6885aa] bg-white text-[#233f66] shadow-[inset_0_2px_4px_#b3c4d8]`, muted: 'text-[#47617f]', divider: 'border-[#6885aa]',
  },
  'retro-futurism': {
    frame: 'rounded-lg border-2 border-[#e3a955] bg-[#241b25] p-6 font-mono text-[#ffe0a7] shadow-[inset_0_0_24px_#e3a95522]', header: 'mb-5 border-y border-[#e3a955] py-3', title: 'text-xl uppercase tracking-[0.18em]', body: 'space-y-4',
    item: 'rounded border border-[#e3a955] bg-[#241b25] p-4 shadow-[inset_0_0_16px_#e3a95522]', active: 'bg-[#f2bd67] text-[#241b25]', control: `${basic} rounded border-2 border-[#e3a955] bg-gradient-to-b from-[#ffe0a7] to-[#cf9445] font-bold uppercase text-[#241b25] shadow-[0_0_12px_#e3a95544]`, secondary: `${basic} rounded border border-[#e3a955] bg-[#241b25] text-[#ffe0a7]`, field: `${basic} w-full rounded border border-[#e3a955] bg-[#241b25] text-[#ffe0a7]`, muted: 'text-[#d8bf98]', divider: 'border-[#e3a955]',
  },
  skeuomorphism: {
    frame: 'rounded-xl border border-[#8a816e] bg-gradient-to-b from-[#f2efe6] to-[#d9d3c4] p-6 text-[#393329] shadow-[inset_0_1px_0_#fff,inset_0_-2px_4px_#b9b2a1]', header: 'mb-5 rounded border border-[#8a816e] bg-gradient-to-b from-white to-[#dcd6c6] p-4 shadow-[inset_0_1px_0_#fff,0_2px_3px_#00000033]', title: 'text-lg font-semibold', body: 'space-y-4',
    item: 'rounded-md border border-[#8a816e] bg-gradient-to-b from-[#fffbe9] to-[#e8dfc2] p-4 shadow-[inset_0_1px_0_#fff,0_2px_4px_#00000030]', active: 'bg-[#cbc4b1] font-bold text-[#393329] shadow-[inset_0_2px_4px_#8a816e66]', control: `${basic} rounded-md border border-[#8a816e] bg-gradient-to-b from-white to-[#dcd6c6] font-semibold text-[#393329] shadow-[inset_0_1px_0_#fff,0_2px_3px_#00000033] enabled:active:shadow-none`, secondary: `${basic} rounded-md border border-[#8a816e] bg-gradient-to-b from-[#fffbe9] to-[#e8dfc2] text-[#393329]`, field: `${basic} w-full rounded-md border border-[#8a816e] bg-[#fffdf4] text-[#393329] shadow-[inset_0_2px_3px_#8a816e44]`, muted: 'text-[#615949]', divider: 'border-[#8a816e]',
  },

  minimalism: {
    frame: 'border border-[#737373] bg-white p-5 text-[#171717]', header: 'mb-6 border-b border-[#737373] pb-4', title: 'text-lg font-medium tracking-tight', body: 'space-y-4',
    item: 'border-b border-[#737373] bg-white p-3', active: 'bg-[#171717] text-white', control: `${basic} border border-[#171717] bg-[#171717] text-white hover:bg-[#404040]`, secondary: `${basic} border border-[#737373] bg-white text-[#171717] hover:bg-[#f3f3f3]`, field: `${basic} w-full border border-[#737373] bg-white text-[#171717]`, muted: 'text-[#525252]', divider: 'border-[#737373]',
  },
  'flat-design': {
    frame: 'rounded-lg bg-[#eaf1f9] p-5 font-sans text-[#17304e]', header: 'mb-4 flex items-center gap-3 rounded-md bg-[#173f70] p-3 text-white', title: 'text-lg font-bold', body: 'space-y-3',
    item: 'rounded-md border border-[#607997] bg-white p-3', active: 'bg-[#17529a] text-white', control: `${basic} rounded-md bg-[#17529a] font-semibold text-white hover:bg-[#123d73]`, secondary: `${basic} rounded-md border border-[#607997] bg-white text-[#17304e] hover:bg-[#dae6f4]`, field: `${basic} w-full rounded-md border border-[#607997] bg-white text-[#17304e]`, muted: 'text-[#425a75]', divider: 'border-[#607997]',
  },
  'swiss-style': {
    frame: 'border-y-2 border-black bg-white p-5 font-sans text-black', header: 'mb-6 grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 border-b border-black pb-4', title: 'text-2xl font-black leading-none tracking-tight', body: 'space-y-4',
    item: 'grid gap-2 border-t border-black p-3', active: 'border-l-4 border-l-[#b51f24] bg-[#f2f2f2] font-bold text-black', control: `${basic} border-b-2 border-black bg-black font-bold text-white hover:bg-[#b51f24]`, secondary: `${basic} border-b-2 border-black bg-white font-semibold text-black hover:bg-[#f1f1f1]`, field: `${basic} w-full border-b-2 border-black bg-white text-black`, muted: 'text-[#525252]', divider: 'border-black',
  },
  neobrutalism: {
    frame: 'border-[3px] border-black bg-[#ffdf72] p-5 font-sans text-black shadow-[6px_6px_0_#000]', header: 'mb-5 border-b-[3px] border-black pb-4', title: 'text-2xl font-black uppercase leading-none', body: 'space-y-4',
    item: 'border-[3px] border-black bg-white p-3 shadow-[3px_3px_0_#000]', active: 'bg-[#ff93b3] font-black text-black shadow-none', control: `${basic} border-[3px] border-black bg-[#ff93b3] font-black text-black shadow-[3px_3px_0_#000] enabled:active:shadow-none`, secondary: `${basic} border-[3px] border-black bg-white font-bold text-black shadow-[3px_3px_0_#000] enabled:active:shadow-none`, field: `${basic} w-full border-[3px] border-black bg-white text-black shadow-[3px_3px_0_#000]`, muted: 'text-[#343434]', divider: 'border-black',
  },
  glassmorphism: {
    frame: 'rounded-2xl border border-[#789dcc] bg-gradient-to-br from-[#14375d] via-[#293454] to-[#432e66] p-5 text-white', header: 'mb-5 rounded-xl border border-white/60 bg-white/10 p-4 backdrop-blur-md', title: 'text-xl font-semibold tracking-wide', body: 'space-y-4',
    item: 'rounded-xl border border-white/60 bg-[#183250]/90 p-3 backdrop-blur-md shadow-lg', active: 'border-white bg-[#e3f0ff] text-[#14375d]', control: `${basic} rounded-xl border border-white bg-[#e3f0ff] font-semibold text-[#14375d] hover:bg-white`, secondary: `${basic} rounded-xl border border-white/70 bg-[#233b60]/90 text-white hover:bg-[#354e76]`, field: `${basic} w-full rounded-xl border border-white/70 bg-[#203958] text-white`, muted: 'text-[#d7e4f5]', divider: 'border-white/60',
  },
  cyberpunk: {
    frame: 'border-2 border-[#58e9d5] bg-[#09121f] p-5 font-mono text-[#ddfff9] shadow-[4px_4px_0_#b96bac]', header: 'mb-5 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-b-2 border-[#58e9d5] pb-3', title: 'text-xl font-black uppercase tracking-wider', body: 'space-y-4',
    item: 'border-l-4 border-[#58e9d5] bg-[#132a36] p-3', active: 'bg-[#58e9d5] font-bold text-[#09121f]', control: `${basic} border-2 border-[#58e9d5] bg-[#58e9d5] font-bold uppercase text-[#09121f] shadow-[3px_3px_0_#ed98dc] enabled:active:shadow-none`, secondary: `${basic} border border-[#ed98dc] bg-[#09121f] text-[#ffd1f6] hover:bg-[#30233c]`, field: `${basic} w-full border-2 border-[#58e9d5] bg-[#09121f] font-mono text-[#ddfff9]`, muted: 'text-[#b5ccdd]', divider: 'border-[#58e9d5]',
  },
  neumorphism: {
    frame: 'rounded-3xl bg-[#e7ecf2] p-6 text-[#283c50] shadow-[8px_8px_18px_#bcc6d1,-8px_-8px_18px_#fff]', header: 'mb-6 rounded-2xl border border-[#738496] p-4 shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#fff]', title: 'text-lg font-semibold', body: 'space-y-5',
    item: 'rounded-2xl border border-[#738496] bg-[#e7ecf2] p-4 shadow-[4px_4px_8px_#bdc8d3,-4px_-4px_8px_#fff]', active: 'border-[#1756a9] font-bold text-[#1756a9] shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#fff]', control: `${basic} rounded-xl border border-[#738496] bg-[#e7ecf2] font-bold text-[#1756a9] shadow-[4px_4px_8px_#bdc8d3,-4px_-4px_8px_#fff] enabled:active:shadow-none`, secondary: `${basic} rounded-xl border border-[#738496] bg-[#e7ecf2] text-[#283c50] shadow-[inset_2px_2px_4px_#bdc8d3,inset_-2px_-2px_4px_#fff]`, field: `${basic} w-full rounded-xl border border-[#738496] bg-[#e7ecf2] text-[#283c50] shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#fff]`, muted: 'text-[#4d6175]', divider: 'border-[#738496]',
  },
  organic: {
    frame: 'rounded-[2rem_0.8rem_2rem_0.8rem] border border-[#697d51] bg-[#f1f1df] p-6 text-[#34472b]', header: 'mb-5 flex items-start gap-3 border-b border-[#697d51] pb-4', title: 'font-serif text-2xl leading-tight', body: 'space-y-5',
    item: 'rounded-[1.5rem_0.5rem_1.5rem_0.5rem] border border-[#697d51] bg-[#fffdf0] p-4', active: 'bg-[#3e5737] text-[#fffdf0]', control: `${basic} rounded-[1.5rem_0.5rem_1.5rem_0.5rem] bg-[#3e5737] font-semibold text-[#fffdf0] hover:bg-[#283e24]`, secondary: `${basic} rounded-[0.5rem_1.5rem_0.5rem_1.5rem] border border-[#697d51] bg-[#fffdf0] text-[#34472b]`, field: `${basic} w-full rounded-[1rem_0.4rem_1rem_0.4rem] border border-[#697d51] bg-[#fffdf0] text-[#34472b]`, muted: 'text-[#536247]', divider: 'border-[#697d51]',
  },
  editorial: {
    frame: 'border-y border-[#5b5047] bg-[#faf7ef] p-6 text-[#2e2924]', header: 'mb-6 border-y-2 border-[#2e2924] py-3', title: 'font-serif text-3xl italic leading-tight tracking-tight', body: 'space-y-5',
    item: 'border-b border-[#8b7d70] bg-[#faf7ef] p-3', active: 'border-l-4 border-l-[#2e2924] bg-[#e9e1d3] font-semibold text-[#2e2924]', control: `${basic} border-b-2 border-[#2e2924] bg-[#2e2924] font-serif text-white`, secondary: `${basic} border-b border-[#5b5047] bg-transparent font-serif italic text-[#2e2924]`, field: `${basic} w-full border-b border-[#5b5047] bg-[#fffdf7] font-serif text-[#2e2924]`, muted: 'text-[#665b50]', divider: 'border-[#8b7d70]',
  },
  'art-deco': {
    frame: 'border-4 border-double border-[#bda26c] bg-[#182327] p-6 text-[#f9e9c4]', header: 'mb-6 border-y border-[#bda26c] py-4 text-center', title: 'font-serif text-xl uppercase tracking-[0.18em]', body: 'space-y-5',
    item: 'border-4 border-double border-[#bda26c] bg-[#182327] p-4', active: 'bg-[#e1c38a] text-[#182327]', control: `${basic} border-4 border-double border-[#182327] bg-[#e1c38a] font-serif uppercase tracking-widest text-[#182327]`, secondary: `${basic} border border-[#bda26c] bg-[#182327] font-serif text-[#f9e9c4]`, field: `${basic} w-full border border-[#bda26c] bg-[#182327] font-serif text-[#f9e9c4]`, muted: 'text-[#d3c49f]', divider: 'border-[#bda26c]',
  },
  'hand-drawn': {
    frame: 'rounded-[1.3rem_0.5rem_1.7rem_0.7rem] border-2 border-dashed border-[#655a43] bg-[#fcf6e7] p-5 text-[#362d23]', header: 'mb-5 border-b-2 border-dashed border-[#655a43] pb-4', title: 'font-serif text-2xl italic', body: 'space-y-4',
    item: 'rounded-[0.7rem_1.3rem_0.5rem_1rem] border-2 border-dashed border-[#655a43] bg-[#fffdf8] p-3', active: 'bg-[#ffe496] font-bold text-[#362d23]', control: `${basic} rounded-[0.7rem_1.3rem_0.5rem_1rem] border-2 border-[#655a43] bg-[#ffe496] font-serif italic text-[#362d23]`, secondary: `${basic} rounded-[1rem_0.5rem_1.3rem_0.7rem] border-2 border-dashed border-[#655a43] bg-[#fffdf8] font-serif text-[#362d23]`, field: `${basic} w-full rounded-[0.7rem_1.3rem_0.5rem_1rem] border-2 border-dashed border-[#655a43] bg-[#fffdf8] font-serif text-[#362d23]`, muted: 'text-[#665a45]', divider: 'border-dashed border-[#655a43]',
  },
  bauhaus: {
    frame: 'border-2 border-black bg-[#f5e9c8] p-5 font-sans text-black', header: 'mb-5 grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 border-b-2 border-black pb-4', title: 'text-2xl font-black leading-none', body: 'space-y-4',
    item: 'border-2 border-black bg-white p-3', active: 'bg-[#ffe036] font-black text-black', control: `${basic} rounded-full border-2 border-black bg-[#1949a0] font-bold text-white`, secondary: `${basic} border-2 border-black bg-[#ffe036] font-bold text-black`, field: `${basic} w-full border-2 border-black bg-white text-black`, muted: 'text-[#4d4636]', divider: 'border-black',
  },
  'pixel-art': {
    frame: 'border-4 border-[#9cb1cd] bg-[#192136] p-5 font-mono text-[#f5f6fa] shadow-[6px_6px_0_#0c111d]', header: 'mb-5 border-b-4 border-[#9cb1cd] pb-4', title: 'text-lg font-bold uppercase tracking-widest', body: 'space-y-4',
    item: 'border-4 border-[#9cb1cd] bg-[#293952] p-3', active: 'bg-[#a8db67] text-[#192136]', control: `${basic} border-4 border-[#a8db67] bg-[#a8db67] font-bold uppercase text-[#192136] shadow-[4px_4px_0_#0c111d] enabled:active:shadow-none`, secondary: `${basic} border-4 border-[#9cb1cd] bg-[#293952] text-[#f5f6fa]`, field: `${basic} w-full border-4 border-[#9cb1cd] bg-[#192136] text-[#f5f6fa]`, muted: 'text-[#c2cde0]', divider: 'border-[#9cb1cd]',
  },
};

export function recipe(style: RecipeStyleId): Recipe {
  const value = recipes[style];
  // 选中行保留原材质几何，只替换明确变化的填色/字色/阴影，避免 Tailwind 同类冲突。
  const changed = ['bg-', 'text-', 'shadow-'].filter((prefix) => value.active.split(' ').some((token) => token.startsWith(prefix)));
  const isBorderColor = (token: string) => /^border-(?:\[#|(?:black|white|transparent|current)(?:\/|$)|[a-z]+-\d)/.test(token);
  const changesBorderColor = value.active.split(' ').some(isBorderColor);
  const activeBase = value.item.split(' ').filter((token) => !changed.some((prefix) => token.startsWith(prefix)) && !(changesBorderColor && isBorderColor(token))).join(' ');
  return { ...value, item: `${focus} ${value.item}`, active: `${focus} ${activeBase} ${value.active}`, control: `${focus} ${value.control}`, secondary: `${focus} ${value.secondary}`, field: `${focus} ${value.field}` };
}
const names: Record<RecipeStyleId, { zh: string; en: string }> = {
  brutalism: { zh: '粗野主义', en: 'Brutalism' }, 'corporate-memphis': { zh: '企业孟菲斯', en: 'Corporate Memphis' }, aurora: { zh: '极光渐变', en: 'Aurora Gradient' }, 'liquid-glass': { zh: '液态玻璃', en: 'Liquid Glass' }, claymorphism: { zh: '黏土风', en: 'Claymorphism' }, y2k: { zh: 'Y2K 千禧美学', en: 'Y2K Aesthetic' }, 'retro-futurism': { zh: '复古未来主义', en: 'Retro-Futurism' }, skeuomorphism: { zh: '拟物化', en: 'Skeuomorphism' },

  minimalism: { zh: '极简主义', en: 'Minimalism' }, 'flat-design': { zh: '扁平化设计', en: 'Flat Design' }, 'swiss-style': { zh: '瑞士风格', en: 'Swiss Style' }, neobrutalism: { zh: '新粗野主义', en: 'Neobrutalism' }, glassmorphism: { zh: '玻璃拟态', en: 'Glassmorphism' }, cyberpunk: { zh: '赛博朋克', en: 'Cyberpunk' }, neumorphism: { zh: '新拟态', en: 'Neumorphism' }, organic: { zh: '有机自然', en: 'Organic' }, editorial: { zh: '杂志编辑风', en: 'Editorial' }, 'art-deco': { zh: '装饰艺术', en: 'Art Deco' }, 'hand-drawn': { zh: '手绘涂鸦', en: 'Hand-drawn UI' }, bauhaus: { zh: '包豪斯', en: 'Bauhaus' }, 'pixel-art': { zh: '像素风', en: 'Pixel Art UI' },
};

export function RecipeFrame({ style, locale, title, children }: { style: RecipeStyleId; locale: 'zh' | 'en'; title: string; children: ReactNode }) {
  const r = recipe(style);
  const marker = style === 'swiss-style' ? '01' : style === 'cyberpunk' ? '▰' : style === 'organic' ? '❧' : style === 'art-deco' ? '◇' : style === 'bauhaus' ? '●' : style === 'pixel-art' ? '▪' : style === 'corporate-memphis' ? '◕' : style === 'y2k' ? '✦' : style === 'retro-futurism' ? '◉' : null;
  return <section data-style-recipe={style} className={`mx-auto w-full min-w-0 max-w-md [overflow-wrap:anywhere] ${r.frame}`}>
    <header className={r.header}>
      {marker && <span aria-hidden="true" className={style === 'bauhaus' ? 'text-5xl text-[#ba2929]' : style === 'swiss-style' ? 'font-mono text-sm font-bold text-[#b51f24]' : 'text-2xl'}>{marker}</span>}
      {style === 'editorial' && <p className={`mb-2 font-mono text-[10px] uppercase tracking-widest ${r.muted}`}>{locale === 'zh' ? '演示刊 · 01' : 'Demo journal · 01'}</p>}
      <h4 className={r.title}>{title}</h4>
    </header>
    <div className={r.body}>{children}</div>
    <p className={`mt-5 border-t pt-3 text-[11px] leading-relaxed ${r.divider} ${r.muted}`}>{locale === 'zh' ? '本地交互演示，不会提交或保存真实数据。' : 'Local interaction demo. No real data is submitted or saved.'}</p>
  </section>;
}

export function recipeVariant(style: RecipeStyleId, Demo: (props: VariantDemoProps) => ReactNode, note: { zh: string; en: string }): StyleVariant {
  return { style: style satisfies StyleId, name: names[style], note, Demo };
}
