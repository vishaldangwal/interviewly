const theme2 = {
  dark: {
    bg: "bg-black",
    card: {
      front:
        "bg-neutral-900 shadow-lg shadow-black/40 border border-neutral-800",
      back: "bg-neutral-950 border border-neutral-800 shadow-lg shadow-black/20",
      textFront: "text-white",
      textBack: "text-neutral-200",
      accent: "text-blue-400",
    },
    button: {
      primary:
        "bg-neutral-800 hover:bg-neutral-700 text-white shadow-lg shadow-black/30 border border-neutral-700",
      secondary:
        "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700",
    },
    text: {
      primary: "text-white",
      secondary: "text-neutral-400",
    },
    input:
      "bg-neutral-900 border-neutral-700 text-neutral-200 focus:border-blue-500 focus:ring-blue-500",
    modal: "bg-neutral-950 border border-neutral-800",
  },
  light: {
    bg: "bg-white",
    card: {
      front:
        "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200",
      back: "bg-white border border-blue-200 shadow-xl shadow-blue-100/50",
      textFront: "text-white",
      textBack: "text-gray-900",
      accent: "text-blue-600",
    },
    button: {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
      secondary:
        "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200 shadow-sm",
    },
    text: {
      primary: "text-gray-900",
      secondary: "text-blue-600",
    },
    input:
      "bg-white border-blue-300 text-blue-800 focus:border-blue-500 focus:ring-blue-500",
    modal: "bg-white border border-blue-200",
  },
};

export default theme2;