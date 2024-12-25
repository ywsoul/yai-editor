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
      className={`yai-editor-mentions-item${isSelected ? ' selected' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHighlightedIndex(index)}
      aria-selected={isSelected}
      role="option"
    >
      {option.avatar && (
        <img
          src={option.avatar}
          alt={option.name}
          className="yai-editor-mentions-avatar"
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

  const options = useMemo(() => {
    if (queryString === null) return [];
    
    if (queryString === '') {
      return items.map((item) => new MentionMenuOption(item.name, item.id, item.avatar));
    }

    const searchText = queryString.toLowerCase();
    return items
      .filter((item) => item.name.toLowerCase().includes(searchText))
      .map((item) => new MentionMenuOption(item.name, item.id, item.avatar));
  }, [items, queryString]);

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
    const match = text.match(/@(\w*)$/);
    if (!match) {
      return null;
    }
    return {
      leadOffset: match[0].length - match[1].length - 1,
      matchingString: match[1],
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
      ) =>
        anchorElementRef.current
          ? createPortal(
                // Use an outer container that is always the same height, which is the
                // max height of the visible menu. This ensures that the menu does not
                // flip orientation as the user is typing if it suddenly has less
                // results. It also makes the positioning less glitchy.
                <div data-at-mention-menu="" className={clsx('styles.popoverDimensions')}>
                    <div className={'styles.popover'}>
                        {options.map((option, index) => {
                            return <MentionMenuItem
                            key={option.key}
                            isSelected={index === selectedIndex}
                            onClick={() => {
                              selectOptionAndCleanUp(option);
                            }}
                            option={option}
                            index={index}
                            setHighlightedIndex={setHighlightedIndex}
                        />
                        })}
                    </div>
                </div>,
                anchorElementRef.current
            )
          : null
      }
    />
  );
} 