import { auth } from "@/firebase/firebase.config";
import RegisterLogic, { IRegisterFormModel } from "./RegisterLogic";
import { SubmitHandler } from "react-hook-form";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { createInitialUser } from "@/firebase/firestore-helpers/utils";

const RegisterApollo: React.FC = () => {
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const submitHandler: SubmitHandler<IRegisterFormModel> = (data) => {
    createUserWithEmailAndPassword(data.email, data.password).then((userCredential) => {
      const user = userCredential?.user;
      if (!user) return;

      const displayName = `${data.firstName} ${data.lastName}`;
      createInitialUser(user, displayName);
    });
  };

  const defaultValues: IRegisterFormModel = {
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  };

  return (
    <>
      {error && <p>{error.message}</p>}
      <RegisterLogic defaultValues={defaultValues} onSubmit={submitHandler} />
    </>
  );
};

export default RegisterApollo;
