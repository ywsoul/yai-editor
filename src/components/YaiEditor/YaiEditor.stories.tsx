import type { Meta, StoryObj } from '@storybook/react';
import { YaiEditor } from './index';
import { UserIcon, HashtagIcon, AtSymbolIcon } from '@heroicons/react/24/outline';

const meta = {
  title: 'Components/YaiEditor',
  component: YaiEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YaiEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const mentionItems = [
  {
    id: '1',
    icon: <UserIcon className="w-4 h-4 text-blue-500" />,
    title: 'John Doe',
    subTitle: 'Software Engineer',
    type: 'user',
  },
  {
    id: '2',
    icon: <UserIcon className="w-4 h-4 text-blue-500" />,
    title: 'Jane Smith',
    subTitle: 'Product Manager',
    type: 'user',
  },
  {
    id: '3',
    icon: <HashtagIcon className="w-4 h-4 text-green-500" />,
    title: 'frontend',
    subTitle: '1.2k members',
    type: 'channel',
  },
  {
    id: '4',
    icon: <AtSymbolIcon className="w-4 h-4 text-purple-500" />,
    title: 'everyone',
    subTitle: 'Notify all members',
    type: 'group',
  },
];

export const WithMentions: Story = {
  args: {
    mentions: mentionItems,
  },
};

export const WithOnChange: Story = {
  args: {
    mentions: mentionItems,
    onChange: (editorState) => {
      console.log('Editor state changed:', editorState);
    },
  },
}; 