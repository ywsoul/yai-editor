import { YaiEditor } from './components/YaiEditor';
import './components/YaiEditor/style.css';
import type { MentionItem } from './components/YaiEditor/MentionsList';

const demoMentions: MentionItem[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
];

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <h1>YaiEditor Demo</h1>
      <p>Try typing '@' to trigger mentions</p>
      <YaiEditor
        mentions={demoMentions}
        onChange={(editorState) => {
          console.log('Editor content changed:', editorState);
        }}
      />
    </div>
  );
}

export default App; 