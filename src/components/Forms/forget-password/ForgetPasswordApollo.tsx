import { SubmitHandler } from "react-hook-form";
import { useAuthContext } from "@/store/user-context";
import ForgetPasswordLogic, { IForgetPasswordFormModel } from "./ForgetPasswordLogic";
import { useSnack } from "@/hooks/useSnack";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ForgetPasswordApollo: React.FC = () => {
  const authCtx = useAuthContext();
  const { resetPassword, resetState, loading, error, success } = authCtx.resetPasswordState;
  const showSnackbar = useSnack();
  const router = useRouter();

  // Komponens betöltésekor reseteljük az állapotot
  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Router esemény figyelése - ha a felhasználó elhagyja az oldalt, reseteljük az állapotot
  useEffect(() => {
    const handleRouteChange = () => {
      resetState();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (success) {
      showSnackbar("Jelszó-visszaállító email elküldve!", "success");
    }
  }, [success, showSnackbar]);

  const submitHandler: SubmitHandler<IForgetPasswordFormModel> = async (data) => {
    await resetPassword(data.email);
  };

  const defaultValues: IForgetPasswordFormModel = {
    email: "",
  };

  return (
    <ForgetPasswordLogic
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      isLoading={loading}
      error={error}
      success={success}
    />
  );
};

export default ForgetPasswordApollo;