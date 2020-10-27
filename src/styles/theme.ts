export interface Theme {
  palette: {
    primary: {
      light: string;
      main: string;
    };
    white: string;
    black: string;
  };
  headerHeight: number;
  borderRadius: number;
  spacing: (value: number) => number;
}

export const theme: Theme = {
  palette: {
    primary: {
      light: "#faf2f2",
      main: "#ff6b5b",
    },
    white: "#ffffff",
    black: "#2c2c2c",
  },
  headerHeight: 72,
  borderRadius: 8,
  spacing: (value: number) => value * 8,
};
