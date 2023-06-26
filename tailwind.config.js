// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
  content: ["./app/**/*.{tsx,ts}", "./pages/**/*.{tsx,ts}", "./share/elements/**/*.{tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
