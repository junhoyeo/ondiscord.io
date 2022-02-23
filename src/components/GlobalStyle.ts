import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;

    background-color: #100f17;
  }

  ::selection {
    background: rgba(82, 252, 255, 0.4);
    color: #ffffff;
  }
`;
