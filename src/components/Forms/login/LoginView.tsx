import { UseFormReturn, SubmitHandler, Controller } from "react-hook-form";
import { ILoginFormModel } from "./LoginLogic";
import { Box, Button, TextField, Typography } from "@mui/material";
import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";

interface ILoginViewProps {
  form: UseFormReturn<ILoginFormModel>;
  onSubmit: SubmitHandler<ILoginFormModel>;
  onGoogleLogin: () => void;
}

const LoginView: React.FC<ILoginViewProps> = ({ form, onSubmit, onGoogleLogin }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100vh' }}>
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
          Bejelentkezés
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Box sx={{ width: "100%" }}>
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            </Box>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Box sx={{ width: "100%" }}>
              <TextField
                {...field}
                label="Jelszó"
                variant="outlined"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            </Box>
          )}
        />
        <Button variant="contained" type="submit" fullWidth>
          Bejelentkezés
        </Button>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Vagy
        </Typography>
        <Button variant="contained" onClick={onGoogleLogin} fullWidth>
          Jelentkezzen be Google fiókjával
        </Button>
      </ElevatedFormBox>
    </Box>
  );
};

export default LoginView;
