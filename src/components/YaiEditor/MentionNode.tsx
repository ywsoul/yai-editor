import { DecoratorNode, EditorConfig, NodeKey, LexicalNode, LexicalEditor, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND } from 'lexical';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';

function MentionComponent({ text, node, nodeKey, editor }: { text: string; node: any,  nodeKey: string; editor: LexicalEditor }): ReactNode {
  const [isSelected, setSelected] = useState(false);
  const [isNodeSelected, setNodeSelection, clearNodeSelection] = useLexicalNodeSelection(nodeKey);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (selection) {
          const focus = selection.getNodes().find((node) => node.__key === nodeKey);
          console.log('SELECTION_CHANGE_COMMAND', focus);
          setSelected(!!focus);
        }
        return false;
      },
      0
    );
  }, [editor, nodeKey]);

  useEffect(() => {
    const removeDeleteListener = editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => {
        if (isSelected) {
            node.remove();
        }
        return false;
      },
      0
    );

    const removeBackspaceListener = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        if (isSelected) {
            node.remove();
        }
        return false;
      },
      0
    );

    return () => {
      removeDeleteListener();
      removeBackspaceListener();
    };
  }, [editor, nodeKey, isSelected]);

  return (
    <span
      style={{
        backgroundColor: '#e8f5fe',
        color: '#0969da',
        padding: '0 2px',
        borderRadius: '2px',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isSelected ? 'red' : 'transparent',
      }}
    >
      {text}
    </span>
  );
}

export class MentionNode extends DecoratorNode<ReactNode> {
  __text: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('span');
    return dom;
  }

  updateDOM(): false {
    return false;
  }

  decorate(editor: LexicalEditor): ReactNode {
    return <MentionComponent text={this.__text} node={this} nodeKey={this.__key} editor={editor} />;
  }

  isInline(): boolean {
    return true;
  }

  getTextContent(): string {
    return this.__text;
  }
}

export function $createMentionNode(text: string): MentionNode {
  return new MentionNode(text);
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
} 