export const buttonStyles = {
  variants: {
    primary: (props) => ({
      bg: "primary",
      color: "white",
      borderRadius: "5px",

      height: "40px",
      fontSize: "16px",
      fontWeight: "600",
      _hover: {
        bg: "rgba(23, 24, 24, 1)",
        color: "white",
      },
    }),
    secondary: (props) => ({
      bg: "secondary",
      color: "primary",
      borderRadius: "5px",
      height: "40px",
      fontSize: "16px",
      fontWeight: "600",
      border: "1px",
      borderColor: "#ccd0d5",
      _hover: {
        bg: "primary",
        color: "black",
        border: "0px",
      },
    }),
  },
};
