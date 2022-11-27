// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
  content: ["./pages/**/*.{tsx,ts}", "./share/elements/**/*.{tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
