import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode, $createTextNode, LexicalEditor, RangeSelection } from 'lexical';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MentionMenuItem, MentionMenuOption, MentionMenuData } from '../MentionMenu';
import { $createMentionNode } from './MentionNode';
import styles from '../MentionMenu/style/mentions.module.css';

export interface MentionItem extends MentionMenuData {}

interface MentionsPluginProps {
  items: MentionItem[];
}

const MENU_ITEM_HEIGHT = 48; // Height of each menu item in pixels
const LINE_HEIGHT = 18; // Assuming line height is 24px
const MENU_MARGIN_TOP = 10; // Margin between menu and cursor
const MENU_MARGIN_LEFT = 10; // Margin between menu and cursor

export function MentionsPlugin({ items }: MentionsPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const ref = useRef<{ items: MentionItem[] }>({ items: [] });

  const options = useMemo(() => {
    if (queryString === null) {
      return items.map((item) => new MentionMenuOption(item));
    }

    const searchText = queryString.toLowerCase().trim();
    return items
      .filter((item) => item.title.toLowerCase().includes(searchText))
      .map((item) => new MentionMenuOption(item));
  }, [queryString]);

  const onSelectOption = useCallback(
    (selectedOption: MentionMenuOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const displayText = ` @${selectedOption.metionText} `;
        // Split into leading space, mention text, and trailing space
        const [leadingSpace, ...rest] = displayText.split('@');
        const mentionContent = rest.join('@').trim();
        
        const leadingSpaceNode = $createTextNode(leadingSpace);
        const mentionNode = $createMentionNode('@' + mentionContent);
        const trailingSpaceNode = $createTextNode(' ');
        
        if (nodeToReplace) {
          nodeToReplace.replace(leadingSpaceNode);
          leadingSpaceNode.insertAfter(mentionNode);
          mentionNode.insertAfter(trailingSpaceNode);
        }
        trailingSpaceNode.select();
        closeMenu();
      });
    },
    [editor]
  );

  const checkForTriggerMatch = useCallback((text: string, editor: LexicalEditor): MenuTextMatch | null => {
    const selection = editor.getEditorState().read(() => editor._editorState._selection) as RangeSelection;
    if (!selection || !selection.isCollapsed()) {
      return null;
    }

    const cursorOffset = selection.anchor.offset;
    
    // Find left boundary (position a)
    let leftPos = cursorOffset;
    while (leftPos > 0 && text[leftPos - 1].trim() !== '') {
      leftPos--;
    }
    
    // Find right boundary (position b)
    let rightPos = cursorOffset;
    while (rightPos < text.length && text[rightPos].trim() !== '') {
      rightPos++;
    }
    
    // Extract the text between boundaries
    const textToCheck = text.slice(leftPos, rightPos);
    const match = textToCheck.match(/@(\w*|$)/);
    
    console.log('[MentionsList] match', textToCheck, match);
    if (!match) {
      return null;
    }

    return {
      leadOffset: leftPos + match[0].length - (match[1] ? match[1].length : 0) - 1,
      matchingString: match[1] || '',
      replaceableString: match[0],
    };
  }, []);

  const calculateMenuPosition = (anchorElement: HTMLElement, menuHeight: number) => {
    const rect = anchorElement.getBoundingClientRect();
    const spaceAbove = rect.top;
    const twoLinesHeight = LINE_HEIGHT * 2;

    if (spaceAbove >= menuHeight + twoLinesHeight + MENU_MARGIN_TOP) {
      return {
        top: -(menuHeight + LINE_HEIGHT + MENU_MARGIN_TOP),
        left: MENU_MARGIN_LEFT,
      };
    }

    return {
      top: 0,
      left: MENU_MARGIN_LEFT,
    };
  };

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (!anchorElementRef.current || options.length === 0) return null;

        const menuHeight = Math.min(options.length * MENU_ITEM_HEIGHT, 200); // Max height of 200px
        const position = calculateMenuPosition(anchorElementRef.current, menuHeight);

        return createPortal(
          <div 
            className={styles.list}
            style={{
              position: 'absolute',
              ...position,
            }}
          >
            {options.map((option, index) => (
              <MentionMenuItem
                key={option.key}
                option={option}
                isSelected={index === selectedIndex}
                onClick={() => {
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(index);
                }}
              />
            ))}
          </div>,
          anchorElementRef.current
        );
      }}
    />
  );
} 