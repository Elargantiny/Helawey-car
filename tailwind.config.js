module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["bg-[var(--a)]", "text-[var(--a)]", "bg-[#0b1b2b]", "z-[60]", "w-[min(92vw,380px)]", "peer-checked:border-[var(--a)]", "xl:grid-cols-4"],
  theme: { extend: {} },
  plugins: [({ addVariant }) => { addVariant("rtl", '[dir="rtl"] &'); addVariant("ltr", '[dir="ltr"] &'); }]
};
