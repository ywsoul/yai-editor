import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, MenuTextMatch, SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode, $createTextNode, } from 'lexical';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MentionMenuItem, MentionMenuOption, MentionMenuData } from '../MentionMenu';
import styles from '../MentionMenu/style/mentions.module.css';

export interface MentionItem extends MentionMenuData {}

interface MentionsPluginProps {
  items: MentionItem[];
}

export function MentionsPlugin({ items }: MentionsPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  // const [highlightedIndex, setHighlightedIndex] = useState(0);
  const ref = useRef<{ items: MentionItem[] }>({ items: [] });

  useEffect(() => {
    ref.current.items = items;
  }, [items]);

  const options = useMemo(() => {
    if (queryString === null) {
      return ref.current.items.map((item) => new MentionMenuOption(item));
    }

    const searchText = queryString.toLowerCase().trim();
    return ref.current.items
      .filter((item) => item.title.toLowerCase().includes(searchText))
      .map((item) => new MentionMenuOption(item));
  }, [queryString]);

  // useEffect(() => {
  //   setHighlightedIndex(0);
  // }, [queryString]);

  const onSelectOption = useCallback(
    (selectedOption: MentionMenuOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createTextNode(`@${selectedOption.title} `);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        closeMenu();
      });
    },
    [editor]
  );

  const checkForTriggerMatch = useCallback((text: string): MenuTextMatch | null => {
    const match = text.match(/@(\w*|$)/);
    if (!match) {
      return null;
    }
    return {
      leadOffset: match[0].length - (match[1] ? match[1].length : 0) - 1,
      matchingString: match[1] || '',
      replaceableString: match[0],
    };
  }, []);

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && options.length > 0
          ? createPortal(
              <div className={styles.list}>
                {options.map((option, index) => (
                  <MentionMenuItem
                    key={option.key}
                    option={option}
                    isSelected={index === selectedIndex}
                    onClick={() => selectOptionAndCleanUp(option)}
                    onMouseEnter={() => {
                      setHighlightedIndex(index);
                    }}
                  />
                ))}
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
} 