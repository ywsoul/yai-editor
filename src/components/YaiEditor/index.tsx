import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';
import { MentionsPlugin, MentionItem } from './MentionsList';

export interface YaiEditorProps {
  onChange?: (editorState: EditorState) => void;
  mentions?: MentionItem[];
}

const theme = {
  // Theme config object
  paragraph: 'yai-editor-paragraph',
  text: {
    bold: 'yai-editor-text-bold',
    italic: 'yai-editor-text-italic',
    underline: 'yai-editor-text-underline',
  },
};

const initialConfig = {
  namespace: 'YaiEditor',
  theme,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function YaiEditor({ onChange, mentions = [] }: YaiEditorProps) {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="yai-editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="yai-editor-input" />}
          placeholder={<div className="yai-editor-placeholder">Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MentionsPlugin items={mentions} />
        {onChange && <OnChangePlugin onChange={onChange} />}
      </div>
    </LexicalComposer>
  );
} 