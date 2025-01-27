import { extendTheme } from "@chakra-ui/react";
import { buttonStyles as Button } from "./Components/buttonStyles";

// import "@fontsource/work-sans";

const breakpoints = {
  ss: "20em",
  sm: "30em",
  sl: "36em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};

export const myNewTheme = extendTheme({
  colors: {
    primary: "rgba(20, 167, 91, 1)",
    primaryGelap: "rgba(10, 107, 67, 1)",
    secondary: "rgba(241, 241, 241, 1)",
    danger: "rgba(198, 46, 46, 1)",
    gelap: "rgba(26, 54, 54, 1)",
    biru: "rgb(46, 80, 119)",
    krem: "rgba(242,230,215,1)",
  },
  components: {
    Button,
  },

  breakpoints: { ...breakpoints },
  //   fonts: {
  //     heading: `Work Sans`,
  //     body: `Work Sans`,
  //   },
});
