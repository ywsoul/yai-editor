import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode, $createTextNode } from 'lexical';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './style/mentions.module.css';

export interface MentionItem {
  id: string;
  name: string;
  avatar?: string;
}

class MentionMenuOption extends MenuOption {
  id: string;
  name: string;
  avatar?: string;

  constructor(name: string, id: string, avatar?: string) {
    super(name);
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}

function MentionMenuItem({
  option,
  isSelected,
  onClick,
  index,
  setHighlightedIndex,
}: {
  option: MentionMenuOption;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  setHighlightedIndex: (index: number) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={itemRef}
      className={clsx(styles.item, isSelected && styles.selected)}
      onClick={onClick}
      onMouseEnter={() => setHighlightedIndex(index)}
      aria-selected={isSelected}
      role="option"
    >
      {option.avatar && (
        <img
          src={option.avatar}
          alt={option.name}
          className={styles.avatar}
        />
      )}
      <span>{option.name}</span>
    </div>
  );
}

interface MentionsPluginProps {
  items: MentionItem[];
}

export function MentionsPlugin({ items }: MentionsPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(' [MentionsPlugin] items update', items);
  }, [items]);

  const options = useMemo(() => {
    console.log(' [MentionsPlugin] queryString', queryString);
    if (queryString === null) {
      console.log(' [MentionsPlugin] items', items);
      return items.map((item) => new MentionMenuOption(item.name, item.id, item.avatar));
    }

    const searchText = queryString.toLowerCase().trim();
    return items
      .filter((item) => item.name.toLowerCase().includes(searchText))
      .map((item) => new MentionMenuOption(item.name, item.id, item.avatar));
  }, [items, queryString]);
  console.log(' [MentionsPlugin] options', options);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [queryString]);

  const onSelectOption = useCallback(
    (selectedOption: MentionMenuOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createTextNode(`@${selectedOption.name} `);
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
    console.log(' [MentionsPlugin] checkForTriggerMatch', match);
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
        { selectedIndex, selectOptionAndCleanUp, options }
      ) => {
        console.log(' [MentionsPlugin] anchorElementRef', anchorElementRef, options);
        return anchorElementRef.current
          ? createPortal(
              <div className={styles.list}>
              {options.map((option, index) => (
                <MentionMenuItem
                  key={option.key}
                  isSelected={index === selectedIndex}
                  onClick={() => {
                    selectOptionAndCleanUp(option);
                  }}
                  option={option}
                  index={index}
                  setHighlightedIndex={setHighlightedIndex}
                />
              ))}
              </div>,
              anchorElementRef.current
            )
          : null
      }
    }
    />
  );
} 