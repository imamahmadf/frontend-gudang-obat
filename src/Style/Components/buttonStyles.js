export const buttonStyles = {
  variants: {
    primary: (props) => ({
      bg: "primary",
      color: "white",
      borderRadius: "5px",
      px: "30px",
      height: "40px",
      fontSize: "16px",
      fontWeight: "600",
      _hover: {
        bg: "rgba(10, 107, 67, 1)",
      },
    }),
    secondary: (props) => ({
      bg: "rgba(239, 251, 239, 1)",
      color: "primary",
      borderRadius: "5px",
      border: "1px",
      borderColor: "primary",
      height: "40px",
      fontSize: "16px",
      fontWeight: "600",

      _hover: {
        bg: "rgba(10, 107, 67, 1)",
        color: "white",
        borderColor: "white",
      },
    }),
  },
};
