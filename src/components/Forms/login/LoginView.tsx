import { UseFormReturn, SubmitHandler, Controller } from "react-hook-form";
import { ILoginFormModel } from "./LoginLogic";
import { Box, Button, TextField, Typography } from "@mui/material";
import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import GoogleIcon from "../../../assets/google-icon.png";
import SpacerLine from "@/components/UI/SpacerLine";
import ToggleIconButton from "@/components/UI/Button/ToggleIconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthError } from "firebase/auth";
import TranslatedAuthError from "@/firebase/auth-error/auth-error-model";
import AuthErrorType from "@/firebase/auth-error/auth-error-type-model";

interface ILoginViewProps {
  form: UseFormReturn<ILoginFormModel>;
  onSubmit: SubmitHandler<ILoginFormModel>;
  onGoogleLogin: () => void;
  onRedirect: (to: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  epError?: TranslatedAuthError;
  googleError?: AuthError;
  isLoading: boolean;
}

const LoginView: React.FC<ILoginViewProps> = ({
  form,
  onSubmit,
  onGoogleLogin,
  onRedirect,
  showPassword,
  toggleShowPassword,
  epError,
  googleError,
  isLoading,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <ElevatedFormBox
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        margin: "0 auto",
        marginTop: 10,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Tuji Booking
      </Typography>
      <SpacerLine sx={{ marginBlock: 1 }} />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="E-mail"
            variant="outlined"
            type="email"
            error={!!errors.email || !!epError?.code}
            disabled={isLoading || isSubmitting}
            helperText={
              errors.email?.message ||
              ((epError?.type === AuthErrorType.EMAIL || epError?.type === AuthErrorType.ACCOUNT) && epError.message)
            }
            fullWidth
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Jelszó"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            error={!!errors.password || !!epError?.code}
            helperText={errors.password?.message || (epError?.type === AuthErrorType.PASSWORD && epError.message)}
            fullWidth
            disabled={isLoading || isSubmitting}
            InputProps={{
              endAdornment: (
                <ToggleIconButton
                  onIcon={<Visibility />}
                  offIcon={<VisibilityOff />}
                  onToggle={toggleShowPassword}
                  state={showPassword}
                />
              ),
            }}
          />
        )}
      />
      <Button
        variant="contained"
        color="success"
        type="submit"
        fullWidth
        sx={{ padding: 1 }}
        disabled={isLoading || isSubmitting}
      >
        Bejelentkezés
      </Button>

      <SpacerLine>
        <Typography variant="body1" sx={{ color: grey[500], marginInline: 3 }}>
          Vagy
        </Typography>
      </SpacerLine>
      <Button
        onClick={onGoogleLogin}
        fullWidth
        disabled={isLoading || isSubmitting}
        sx={{
          padding: 1,
          color: (theme) => (theme.palette.mode === "light" ? grey[800] : grey[300]),
          textTransform: "initial",
          border: `${grey[300]} 1px solid`,
          display: "flex",
          gap: 2,
        }}
      >
        <Image src={GoogleIcon} alt="Google" width={20} height={20} />
        Jelentkezzen be Google fiókjával
      </Button>
      {/*TODO: ÁSZF és Adatvédelmi szabályzat*/}
      <SpacerLine sx={{ marginBlock: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Button
          sx={{
            textTransform: "initial",
            color: (theme) => (theme.palette.mode === "light" ? grey[800] : grey[300]),
          }}
          onClick={() => onRedirect("forgot-password")}
          disabled={isLoading || isSubmitting}
        >
          Elfelejtettem a jelszavam
        </Button>

        <Button
          sx={{ textTransform: "initial" }}
          color="success"
          onClick={() => onRedirect("register")}
          disabled={isLoading || isSubmitting}
        >
          Regisztráció
        </Button>
      </Box>
    </ElevatedFormBox>
  );
};

export default LoginView;
