import { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Grid, 
  TextField, 
  Typography,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUser } from '@/store/user-context';
import LockIcon from '@mui/icons-material/Lock';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useSnack } from '@/hooks/useSnack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface IChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  currentPassword: yup.string().required('Jelenlegi jelszó megadása kötelező'),
  newPassword: yup
    .string()
    .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
    .required('Új jelszó megadása kötelező'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'A jelszavak nem egyeznek')
    .required('Jelszó megerősítése kötelező'),
});

const UserPasswordForm = () => {
  const user = useUser();
  const showSnackbar = useSnack();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<IChangePasswordFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: IChangePasswordFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Újra bejelentkezés a felhasználó hitelesítő adataival
      const credential = EmailAuthProvider.credential(
        user.email!, 
        data.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Jelszó módosítása
      await updatePassword(user, data.newPassword);
      
      showSnackbar('Jelszó sikeresen megváltoztatva!', 'success');
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error(err);
      
      // Specifikus hibák kezelése
      if (err.code === 'auth/wrong-password') {
        setError('Helytelen jelenlegi jelszó');
      } else if (err.code === 'auth/weak-password') {
        setError('Az új jelszó túl gyenge');
      } else {
        setError(err.message || 'Hiba történt a jelszó megváltoztatása során');
      }
      
      showSnackbar('Hiba történt a jelszó megváltoztatása során!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LockIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" component="h2" fontWeight="medium">
          Jelszó módosítása
        </Typography>
      </Box>
      
      <Typography color="text.secondary" paragraph sx={{ mb: 3 }}>
        A jelszómódosításhoz add meg a jelenlegi jelszavad, valamint az új jelszót kétszer.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Jelenlegi jelszó"
                fullWidth
                variant="outlined"
                type={showCurrentPassword ? 'text' : 'password'}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Új jelszó"
                fullWidth
                variant="outlined"
                type={showNewPassword ? 'text' : 'password'}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Új jelszó megerősítése"
                fullWidth
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Mentés...' : 'Jelszó módosítása'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserPasswordForm;