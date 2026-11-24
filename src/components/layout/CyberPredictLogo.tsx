import logo from "../../assets/logo.png"
export function CyberPredictLogo({ className = "h-9" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Stylized Violet Infinity Wave Icon */}
      <img src={logo} alt="logo" className="w-15 h-15" />
      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className="font-extrabold text-[15px] tracking-wider text-slate-900 font-sans leading-none">
          CYBERPREDICT
        </span>
        <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 leading-none">
          Intelligence Before Impact.
        </span>
      </div>
    </div>
  );
}
