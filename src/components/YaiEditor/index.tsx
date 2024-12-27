import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';
import { MentionsPlugin, MentionItem } from './MentionsList';
import { MentionNode } from './MentionNode';
import styles from './style/editor.module.css';

export interface YaiEditorProps {
  onChange?: (editorState: EditorState) => void;
  mentions?: MentionItem[];
}

const theme = {
  paragraph: styles.paragraph,
  text: {
    bold: styles.textBold,
    italic: styles.textItalic,
    underline: styles.textUnderline,
  },
};

const initialConfig = {
  namespace: 'YaiEditor',
  theme,
  nodes: [MentionNode],
  onError: (error: Error) => {
    console.error(error);
  },
};

export function YaiEditor({ onChange, mentions = [] }: YaiEditorProps) {
  console.log(' [YaiEditor] mentions', mentions);
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.container}>
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.input} />}
          placeholder={<div className={styles.placeholder}>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MentionsPlugin items={mentions} />
        {onChange && <OnChangePlugin onChange={onChange} />}
      </div>
    </LexicalComposer>
  );
} 