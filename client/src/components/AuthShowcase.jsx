import { ShieldCheck, Sparkles } from "lucide-react";

const AuthShowcase = ({ eyebrow, title, description, image, stats = [], points = [] }) => {
  return (
    <div className="surface-dark relative hidden min-h-[620px] overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between">
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#170e18]/45 via-[#190f1c]/72 to-[#120b17]/92" />
      <div className="grid-pattern absolute inset-0 opacity-25" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-brand-100">
          <Sparkles className="h-3.5 w-3.5 text-brand-200" />
          {eyebrow}
        </div>
        <h1 className="font-display mt-6 max-w-lg text-5xl leading-tight">{title}</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/76">{description}</p>
      </div>

      <div className="relative space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="mt-1 text-sm text-white/68">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-black text-brand-100">
            <ShieldCheck className="h-4 w-4 text-brand-200" />
            Why people stay signed in
          </div>
          <div className="mt-4 grid gap-3">
            {points.map((point) => (
              <div key={point} className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/78">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
