import { Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { IForgetPasswordFormModel } from "./ForgetPasswordLogic";
import { UseFormReturn, SubmitHandler, Controller } from "react-hook-form";
import { grey } from "@mui/material/colors";
import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";
import SpacerLine from "@/components/UI/SpacerLine";
import { translate } from "@/firebase/auth-error/auth-error-translator";
import { AuthError } from "firebase/auth";

interface IForgetPasswordViewProps {
  form: UseFormReturn<IForgetPasswordFormModel>;
  onSubmit: SubmitHandler<IForgetPasswordFormModel>;
  onRedirect: (to: string) => void;
  isLoading: boolean;
  error?: AuthError;
  success: boolean;
}

const ForgetPasswordView: React.FC<IForgetPasswordViewProps> = ({
  form,
  onSubmit,
  onRedirect,
  isLoading,
  error,
  success,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const translatedError = error ? translate(error.code) : null;

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
        Tuji Booking - Elfelejtett jelszó
      </Typography>
      <SpacerLine sx={{ marginBlock: 1 }} />

      {success && (
        <Alert severity="success" sx={{ width: "100%" }}>
          A jelszó-visszaállító email elküldve! Kérjük, ellenőrizze a postafiókját.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {translatedError?.message || "Hiba történt a jelszó-visszaállítás során."}
        </Alert>
      )}

      <Typography variant="body2" sx={{ textAlign: "center", mb: 2, color: grey[600] }}>
        Add meg az email címed, és küldünk egy jelszó-visszaállító linket.
      </Typography>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="E-mail"
            variant="outlined"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            disabled={isLoading || success}
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ padding: 1 }}
        disabled={isLoading || success}
      >
        {isLoading ? <CircularProgress size={24} /> : "Jelszó-visszaállítás"}
      </Button>

      <SpacerLine sx={{ marginBlock: 1 }} />
      <Button
        sx={{ textTransform: "initial", color: (theme) => (theme.palette.mode === "light" ? grey[800] : grey[300]) }}
        onClick={() => onRedirect("login")}
        disabled={isLoading}
      >
        Vissza a bejelentkezéshez
      </Button>
    </ElevatedFormBox>
  );
};

export default ForgetPasswordView;