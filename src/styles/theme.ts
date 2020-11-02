export interface Theme {
  palette: {
    primary: {
      light: string;
      main: string;
    };
    white: string;
    black: string;
    gray: string;
  };
  fontSize: number;
  headerHeight: number;
  maxPageWidth: number;
  borderRadius: number;
  lineHeight: number;
  spacing: (value: number) => number;
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  breakpoints: {
    upSm: string;
    upMd: string;
    upLg: string;
    upXl: string;
  };
}

export const theme: Theme = {
  palette: {
    primary: {
      light: "#faf2f2",
      main: "#ff6b5b",
    },
    white: "#ffffff",
    black: "#2c2c2c",
    gray: "#8a8a8a",
  },
  fontSize: 1.125,
  headerHeight: 72,
  maxPageWidth: 1200,
  borderRadius: 4,
  lineHeight: 1.7,
  spacing: (value: number) => value * 8,
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  breakpoints: {
    upSm: "@media (min-width: 576px)",
    upMd: "@media (min-width: 768px)",
    upLg: "@media (min-width: 992px)",
    upXl: "@media (min-width: 1200px)",
  },
};
