import dedent from 'dedent';
import { createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';

export const systemFontStack = dedent`
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif
`;

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
    word-break: keep-all;
  }

  body {
    margin: 0;
    font-family: ${systemFontStack};
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  input {
    outline: 0;
  }

  button {
    border: 0;
    outline: 0;
    background-color: transparent;
    cursor: pointer;
  }
`;
