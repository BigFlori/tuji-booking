import { auth } from "@/firebase/firebase.config";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import LoginLogic, { ILoginFormModel } from "./LoginLogic";
import { SubmitHandler } from "react-hook-form";

const LoginApollo: React.FC = () => {
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, epUser, epLoading, epError] = useSignInWithEmailAndPassword(auth);

  const submitHandler: SubmitHandler<ILoginFormModel> = (data) => {
    signInWithEmailAndPassword(data.email, data.password);
  };

  const googleLoginHandler = () => {
    signInWithGoogle();
  };

  const defaultValues: ILoginFormModel = {
    email: "",
    password: "",
  };

  return <LoginLogic defaultValues={defaultValues} onSubmit={submitHandler} onGoogleLogin={googleLoginHandler} />;
};

export default LoginApollo;
