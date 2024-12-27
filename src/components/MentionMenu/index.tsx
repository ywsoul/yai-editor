import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './style/mentions.module.css';

export interface MentionMenuData {
  id: string;
  icon?: ReactNode;
  title: string;
  subTitle?: string;
  type: string;
  nextType?: string;
  data?: any;
}

export class MentionMenuOption extends MenuOption {
  id: string;
  icon?: ReactNode;
  title: string;
  subTitle?: string;
  type: string;
  nextType?: string;
  data?: any;

  constructor(item: MentionMenuData) {
    super(item.title);
    this.id = item.id;
    this.icon = item.icon;
    this.title = item.title;
    this.subTitle = item.subTitle;
    this.type = item.type;
    this.nextType = item.nextType;
    this.data = item.data;
  }
}

export interface MentionMenuItemProps {
  option: MentionMenuOption;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function MentionMenuItem({
  option,
  isSelected,
  onClick,
  onMouseEnter,
}: MentionMenuItemProps) {
  return (
    <div
      className={clsx(styles.item, isSelected && styles.selected)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-selected={isSelected}
      role="option"
    >
      {option.icon && <span className={styles.icon}>{option.icon}</span>}
      <div className={styles.content}>
        <div className={styles.title}>{option.title}</div>
        {option.subTitle && <div className={styles.subtitle}>{option.subTitle}</div>}
      </div>
    </div>
  );
} 