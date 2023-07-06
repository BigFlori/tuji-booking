import { auth } from "@/firebase/firebase.config";
import RegisterLogic, { IRegisterFormModel } from "./RegisterLogic";
import { SubmitHandler } from "react-hook-form";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const RegisterApollo: React.FC = () => {
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const submitHandler: SubmitHandler<IRegisterFormModel> = (data) => {
    // console.log(data);
    // createUserWithEmailAndPassword(data.email, data.password);
  };

  const defaultValues: IRegisterFormModel = {
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  };

  return <RegisterLogic defaultValues={defaultValues} onSubmit={submitHandler} />;
};

export default RegisterApollo;
