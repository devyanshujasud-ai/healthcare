import clinexaLogo from "@/assets/clinexa-logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={clinexaLogo} alt="Clinexa" className="h-10 w-auto" />
      {showText && <span className="text-2xl font-bold text-foreground">Clinexa</span>}
    </div>
  );
};
