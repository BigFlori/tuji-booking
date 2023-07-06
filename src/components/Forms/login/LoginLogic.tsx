import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LoginView from "./LoginView";
import { useState } from "react";
import { useRouter } from "next/router";

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
  email: yup.string().email("Valós email címet adj meg").required("Email cím megadása kötelező"),
  password: yup.string().required("Jelszó megadása kötelező"),
});

const LoginLogic: React.FC<ILoginLogicProps> = ({ defaultValues, onSubmit, onGoogleLogin }) => {
  const router = useRouter();

  const form = useForm<ILoginFormModel>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRedirect = (to: string) => {
    router.push(`/${to}`);
  };

  return (
    <LoginView
      form={form}
      onSubmit={onSubmit}
      onGoogleLogin={onGoogleLogin}
      onRedirect={handleRedirect}
      showPassword={showPassword}
      toggleShowPassword={toggleShowPassword}
    />
  );
};

export default LoginLogic;
