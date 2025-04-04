import LoginLogic, { ILoginFormModel } from "./LoginLogic";
import { SubmitHandler } from "react-hook-form";
import { translate } from "@/firebase/auth-error/auth-error-translator";
import { useAuthContext } from "@/store/user-context";

const LoginApollo: React.FC = () => {
  const authCtx = useAuthContext();
  const {signInWithEmailAndPassword, loading: epLoading, error: epError} = authCtx.signInWithEmailAndPasswordState;
  const {signInWithGoogle, loading: googleLoading, error: googleError} = authCtx.signInWithGoogleState;

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

  return (
    <LoginLogic
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onGoogleLogin={googleLoginHandler}
      epError={translate(epError?.code)}
      googleError={googleError}
      isLoading={epLoading || googleLoading}
    />
  );
};

export default LoginApollo;