export default function TrustSection() {
  const companies = [
    { name: 'Google', font: 'font-sans font-semibold tracking-tight text-lg' },
    {
      name: 'Microsoft',
      font: 'font-sans font-semibold tracking-tight text-base flex items-center gap-1.5',
      logo: (
        <span className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 inline-grid">
          <span className="bg-red-400/80 rounded-xs" />
          <span className="bg-green-400/80 rounded-xs" />
          <span className="bg-blue-400/80 rounded-xs" />
          <span className="bg-amber-400/80 rounded-xs" />
        </span>
      ),
    },
    { name: 'amazon', font: 'font-sans font-bold tracking-tight text-lg lowercase' },
    { name: 'IBM', font: 'font-mono font-extrabold tracking-widest text-lg' },
    { name: 'accenture', font: 'font-sans font-bold tracking-tight text-base lowercase' },
    { name: 'Infosys', font: 'font-sans font-semibold tracking-wide text-base' },
    { name: 'tcs', font: 'font-sans font-extrabold tracking-wider text-base uppercase' },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
      <p className="text-xs sm:text-sm font-medium text-slate-400 mb-6 tracking-wide">
        Trusted by students and professionals worldwide
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-14 opacity-60 hover:opacity-85 transition-opacity">
        {companies.map((c) => (
          <div
            key={c.name}
            className={`text-slate-300 select-none ${c.font} hover:text-white transition-colors cursor-default`}
          >
            {c.logo && c.logo}
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
