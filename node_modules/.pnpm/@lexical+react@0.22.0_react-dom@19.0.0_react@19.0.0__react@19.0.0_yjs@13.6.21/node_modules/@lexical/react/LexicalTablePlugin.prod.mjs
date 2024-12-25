/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useLexicalComposerContext as r}from"@lexical/react/LexicalComposerContext";import{setScrollableTablesActive as o,registerTablePlugin as l,registerTableSelectionObserver as e,registerTableCellUnmergeTransform as t,TableCellNode as a}from"@lexical/table";import{useEffect as n}from"react";function c({hasCellMerge:c=!0,hasCellBackgroundColor:i=!0,hasTabHandler:u=!0,hasHorizontalScroll:s=!1}){const[m]=r();return n((()=>{o(m,s)}),[m,s]),n((()=>l(m)),[m]),n((()=>e(m,u)),[m,u]),n((()=>{if(!c)return t(m)}),[m,c]),n((()=>{if(!i)return m.registerNodeTransform(a,(r=>{null!==r.getBackgroundColor()&&r.setBackgroundColor(null)}))}),[m,i,c]),null}export{c as TablePlugin};
