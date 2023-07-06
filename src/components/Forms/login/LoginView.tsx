import { UseFormReturn, SubmitHandler, Controller } from "react-hook-form";
import { ILoginFormModel } from "./LoginLogic";
import { Box, Button, TextField, Typography } from "@mui/material";
import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import GoogleIcon from "../../../assets/google-icon.png";
import SpacerLine from "@/components/UI/SpacerLine";
import ToggleIconButton from "@/components/UI/ToggleIconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ILoginViewProps {
  form: UseFormReturn<ILoginFormModel>;
  onSubmit: SubmitHandler<ILoginFormModel>;
  onGoogleLogin: () => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const LoginView: React.FC<ILoginViewProps> = ({ form, onSubmit, onGoogleLogin, showPassword, toggleShowPassword }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: grey[50] }}
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
          Tuji Booking
        </Typography>
        <SpacerLine sx={{ marginBlock: 1 }} />
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
            </Box>
          )}
        />
        <Button variant="contained" color="success" type="submit" fullWidth sx={{ padding: 1 }}>
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
          sx={{
            padding: 1,
            color: grey[800],
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
          <Button sx={{ textTransform: "initial", color: grey[800] }} size="large">
            Elfelejtettem a jelszavam
          </Button>
          <Button sx={{ textTransform: "initial" }} color="success" size="large">
            Regisztráció
          </Button>
        </Box>
      </ElevatedFormBox>
    </Box>
  );
};

export default LoginView;
