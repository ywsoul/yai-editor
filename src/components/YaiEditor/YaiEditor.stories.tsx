import type { Meta, StoryObj } from '@storybook/react';
import { YaiEditor } from './index';
import { EditorState } from 'lexical';

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

export const Default: Story = {
  args: {
    onChange: (editorState: EditorState) => console.log('Content changed:', editorState),
    mentions: [],
  },
};

export const WithMentions: Story = {
  args: {
    onChange: (editorState: EditorState) => console.log('Content changed:', editorState),
    mentions: [
      { id: '1', name: '@张三' },
      { id: '2', name: '@李四' },
      { id: '3', name: '@王五' },
    ],
  },
}; 