import { TextNode, EditorConfig, NodeKey, SerializedTextNode } from 'lexical';

export class MentionNode extends TextNode {
  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.backgroundColor = '#e8f5fe';
    dom.style.color = '#0969da';
    dom.style.padding = '0 2px';
    dom.style.borderRadius = '2px';
    return dom;
  }
}

export function $createMentionNode(text: string): MentionNode {
  return new MentionNode(text);
}

export function $isMentionNode(node: TextNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
} 