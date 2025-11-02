import { createTheme } from '@nextui-org/react';

// The color theme for the application
export const theme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // Primary color
      primary: '#53917E',
      primaryBorder: '#53917E',
      primaryBorderHover: '#53917E',
      primarySolidHover: '#53917E',
      primarySolidContrast: '#FFFFFF',
      primaryShadow: '#FFFFFF',

      // Secondary color
      secondary: '#EB9C5C',
      secondaryBorder: '#EB9C5C',
      secondaryBorderHover: '#EB9C5C',
      secondarySolidHover: '#EB9C5C',
      secondarySolidContrast: '#FFFFFF',
      secondaryShadow: '#FFCC00',

      // Misc. color
      default: '#3B3C36',
      link: '#FAF5E9',
    },
    space: {},
    fonts: {},
  },
});
