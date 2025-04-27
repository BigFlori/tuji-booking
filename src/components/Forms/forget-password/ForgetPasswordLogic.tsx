import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import ForgetPasswordView from "./ForgetPasswordView";
import { AuthError } from "firebase/auth";

interface IForgetPasswordLogicProps {
  defaultValues: IForgetPasswordFormModel;
  onSubmit: SubmitHandler<IForgetPasswordFormModel>;
  isLoading: boolean;
  error?: AuthError;
  success: boolean;
}

export interface IForgetPasswordFormModel {
  email: string;
}

const validationSchema: yup.ObjectSchema<IForgetPasswordFormModel> = yup.object().shape({
  email: yup.string().email("Valós email címet adj meg").required("Email cím megadása kötelező"),
});

const ForgetPasswordLogic: React.FC<IForgetPasswordLogicProps> = ({
  defaultValues,
  onSubmit,
  isLoading,
  error,
  success,
}) => {
  const router = useRouter();

  const form = useForm<IForgetPasswordFormModel>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const handleRedirect = (to: string) => {
    router.push(`/${to}`);
  };

  return (
    <ForgetPasswordView
      form={form}
      onSubmit={onSubmit}
      onRedirect={handleRedirect}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
};

export default ForgetPasswordLogic;