import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";

const LoginComponent = () => {
  return (
    <div className="h-[50vh] w-[300px] rounded-xl flex justify-center items-center sm:h-[70vh] sm:w-[75vw] lg:w-[60vw] shadow-lg overflow-hidden">
      <LoginHero />
      <LoginForm />
    </div>
  );
};

export default LoginComponent;
