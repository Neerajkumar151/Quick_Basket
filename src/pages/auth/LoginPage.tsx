import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { Header } from "../../components/layout/Header";
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleLoginSuccess = (redirectUrl: string = "/dashboard") => {
    navigate(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      {/* Full-screen Video Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
        {/* Overlay - reference gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: "var(--auth-overlay-gradient)" }}
        />
      </div>

      <Header />
      <main className="flex-1 relative flex items-center justify-center z-10">
        {/* Centered Login Form matching CSS variables */}
        <div className="relative w-full max-w-[440px] p-6">
          <div
            className="rounded-2xl border p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-lg"
            style={{
              backgroundColor: "var(--auth-card-bg)",
              borderColor: "var(--auth-card-border)",
              boxShadow: `0 20px 40px var(--auth-card-shadow)`,
            }}
          >
            <LoginForm onSuccess={handleLoginSuccess} />

            <div className="mt-8 text-center">
              <span className="text-auth-text/80">
                {t("auth.login.noAccount")}{" "}
              </span>
              <Link
                to="/onboarding/basic-info"
                className="text-auth-text hover:underline font-bold"
              >
                {t("auth.login.createAccount")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
