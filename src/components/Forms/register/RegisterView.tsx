import { Box, Button, TextField, Typography } from "@mui/material";
import { IRegisterFormModel } from "./RegisterLogic";
import { UseFormReturn, SubmitHandler, Controller } from "react-hook-form";
import { grey } from "@mui/material/colors";
import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";
import SpacerLine from "@/components/UI/SpacerLine";
import ToggleIconButton from "@/components/UI/Button/ToggleIconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface IRegisterViewProps {
  form: UseFormReturn<IRegisterFormModel>;
  onSubmit: SubmitHandler<IRegisterFormModel>;
  onRedirect: (to: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const RegisterView: React.FC<IRegisterViewProps> = ({
  form,
  onSubmit,
  onRedirect,
  showPassword,
  toggleShowPassword,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100svh", background: grey[50] }}
    >
      <ElevatedFormBox
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Tuji Booking - Regisztráció
        </Typography>
        <SpacerLine sx={{ marginBlock: 1 }} />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
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
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
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

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Jelszó megerősítése"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              fullWidth
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
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Keresztnév"
              variant="outlined"
              type="text"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Vezetéknév"
              variant="outlined"
              type="text"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          )}
        />
        {/*TODO: Elfogadom a felhasználási feltételek stb...*/}
        <Button variant="contained" color="success" type="submit" fullWidth sx={{ padding: 1 }}>
          Regisztrálok
        </Button>
        <SpacerLine sx={{ marginBlock: 1 }} />
        <Button sx={{ textTransform: "initial", color: grey[800] }} onClick={() => onRedirect("login")}>
            Van már fiókom, bejelentkezek
          </Button>
      </ElevatedFormBox>
    </Box>
  );
};

export default RegisterView;
