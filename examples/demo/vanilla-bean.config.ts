import tailwindcss from "@tailwindcss/vite";

export default {
  meta: {
    lang: "en",
    title: "framework",
    description: "very clean :3",
  },
  transitions: false,
  vite: { plugins: [tailwindcss()] },
};
