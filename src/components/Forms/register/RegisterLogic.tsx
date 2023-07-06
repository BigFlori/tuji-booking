import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import RegisterView from "./RegisterView";

interface IRegisterLogicProps {
  defaultValues: IRegisterFormModel;
  onSubmit: SubmitHandler<IRegisterFormModel>;
}

export interface IRegisterFormModel {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const validationSchema: yup.ObjectSchema<IRegisterFormModel> = yup.object().shape({
  email: yup.string().email("Valós email címet adj meg").required("Email cím megadása kötelező"),
  password: yup.string().required("Jelszó megadása kötelező"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "A jelszavak nem egyeznek")
    .required("Jelszó megerősítése kötelező"),
  firstName: yup.string().required("Keresztnév megadása kötelező"),
  lastName: yup.string().required("Vezetéknév megadása kötelező"),
});

const RegisterLogic: React.FC<IRegisterLogicProps> = ({ defaultValues, onSubmit }) => {
  const router = useRouter();

  const form = useForm<IRegisterFormModel>({
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
    <RegisterView
      form={form}
      onSubmit={onSubmit}
      onRedirect={handleRedirect}
      showPassword={showPassword}
      toggleShowPassword={toggleShowPassword}
    />
  );
};

export default RegisterLogic;
