import RegisterLogic, { IRegisterFormModel } from "./RegisterLogic";
import { SubmitHandler } from "react-hook-form";
import { useAuthContext } from "@/store/user-context";

const RegisterApollo: React.FC = () => {
  const { error, loading } = useAuthContext().createUserState;
  const authCtx = useAuthContext();

  const submitHandler: SubmitHandler<IRegisterFormModel> = (data) => {
    authCtx.createUserState.createUserWithEmailAndPassword(data);
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
