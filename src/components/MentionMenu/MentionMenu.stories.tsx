import type { Meta, StoryObj } from '@storybook/react';
import { MentionMenuItem, MentionMenuOption, MentionMenuData } from './index';
import { UserIcon, HashtagIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import styles from './style/mentions.module.css';

const meta = {
  title: 'Components/MentionMenu',
  component: MentionMenuItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MentionMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuListStyle = {
  width: '200px',
};  

const menuItems = [
  {
    id: '1',
    icon: <UserIcon className="w-4 h-4 text-blue-500" />,
    title: 'John Doe',
    subTitle: 'Software Engineer',
    type: 'user',
    metionText: 'JohnDoeForMetion',
  },
  {
    id: '2',
    icon: <UserIcon className="w-4 h-4 text-blue-500" />,
    title: 'Jane Smith',
    subTitle: 'Product Manager',
    type: 'user',
    metionText: 'JaneSmithForMetion',
  },
  {
    id: '3',
    icon: <HashtagIcon className="w-4 h-4 text-green-500" />,
    title: 'frontend',
    subTitle: '1.2k members',
    type: 'channel',
    metionText: 'frontendForMetion',
  },
  {
    id: '4',
    icon: <AtSymbolIcon className="w-4 h-4 text-purple-500" />,
    title: 'everyone',
    subTitle: 'Notify all members',
    type: 'group',
    metionText: 'everyoneForMetion',
  },

] as MentionMenuData[];


export const MenuListNormal: Story = {
    decorators: [
      (Story) => (
        <div className={styles.list}>
          {menuItems.map((item, index) => (
            <MentionMenuItem
              key={item.id}
              option={new MentionMenuOption(item)}
              isSelected={index === 1}
              onClick={() => console.log('Clicked', item)}
              onMouseEnter={() => console.log('Mouse entered', item)}
            />
          ))}
        </div>
      ),
    ],
    args: {},
  }; 

export const MenuListOverFlow: Story = {
  decorators: [
    (Story) => (
      <div style={menuListStyle} className={styles.list}>
        {menuItems.map((item, index) => (
          <MentionMenuItem
            key={item.id}
            option={new MentionMenuOption(item)}
            isSelected={index === 1}
            onClick={() => console.log('Clicked', item)}
            onMouseEnter={() => console.log('Mouse entered', item)}
          />
        ))}
      </div>
    ),
  ],
  args: {},
}; 