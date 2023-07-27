import { auth, db } from "@/firebase/firebase.config";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import LoginLogic, { ILoginFormModel } from "./LoginLogic";
import { SubmitHandler } from "react-hook-form";
import { translate } from "@/firebase/auth-error/auth-error-translator";
import { createInitialUser } from "@/firebase/firestore-helpers/utils";

const LoginApollo: React.FC = () => {
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, epUser, epLoading, epError] = useSignInWithEmailAndPassword(auth);

  const submitHandler: SubmitHandler<ILoginFormModel> = (data) => {
    signInWithEmailAndPassword(data.email, data.password);
  };

  const googleLoginHandler = () => {
    signInWithGoogle().then((userCredential) => {
      const user = userCredential?.user;
      if (!user) return;

      createInitialUser(user, user.displayName);
    });
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
