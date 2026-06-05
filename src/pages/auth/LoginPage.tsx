import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import LoginHero from "../../assets/login-hero.png";
import en from "../../locales/en.json";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
    console.log("Logged in successfully");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Panel: Hidden on mobile, takes 50% width on desktop */}
        <div className="hidden lg:flex flex-1 flex-col relative bg-slate-900 border-r border-border overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/90 z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center h-full p-12 lg:p-16 max-w-2xl mx-auto">
          <h1 className="text-h1 xl:text-h1 font-extrabold text-white leading-tight tracking-tight mb-6">
            {en.auth.marketing.title}
          </h1>
          <p className="text-h3 text-slate-300 leading-relaxed max-w-lg mb-12">
            {en.auth.marketing.description}
          </p>

          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5 group mt-auto mb-auto">
            <img
              src={LoginHero}
              alt="Dashboard preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[440px] bg-card lg:bg-transparent border lg:border-none border-border rounded-2xl p-8 lg:p-0 shadow-lg lg:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700">
          <LoginForm onSuccess={handleLoginSuccess} />
          
          <div className="mt-8 text-center">
            <span className="text-muted-foreground">{en.auth.login.noAccount} </span>
            <Link to="/onboarding/basic-info" className="text-primary hover:underline font-medium">
              {en.auth.login.createAccount}
            </Link>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};
