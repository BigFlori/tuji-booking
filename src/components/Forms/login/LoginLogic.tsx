import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LoginView from "./LoginView";

interface ILoginLogicProps {
  defaultValues: ILoginFormModel;
  onSubmit: SubmitHandler<ILoginFormModel>;
  onGoogleLogin: () => void;
}

export interface ILoginFormModel {
  email: string;
  password: string;
}

const validationSchema: yup.ObjectSchema<ILoginFormModel> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginLogic: React.FC<ILoginLogicProps> = ({ defaultValues, onSubmit, onGoogleLogin }) => {
  const form = useForm<ILoginFormModel>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return <LoginView form={form} onSubmit={onSubmit} onGoogleLogin={onGoogleLogin} />;
};

export default LoginLogic;
