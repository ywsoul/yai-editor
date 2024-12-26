import type { Preview } from "@storybook/react";
import './preview.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: true,
        iframeHeight: 500,
      },
    },
    layout: {
      mode: 'centered',
      padding: '2rem',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export default preview; 