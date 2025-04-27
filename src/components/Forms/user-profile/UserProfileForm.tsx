import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Grid, 
  TextField, 
  Typography,
  Alert,
  Tooltip
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUser } from '@/store/user-context';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { updateProfile } from 'firebase/auth';
import { useSnack } from '@/hooks/useSnack';
import InfoIcon from '@mui/icons-material/Info';

interface IUserProfileFormValues {
  displayName: string;
}

const schema = yup.object().shape({
  displayName: yup.string().required('Név megadása kötelező'),
});

const UserProfileForm = () => {
  const user = useUser();
  const showSnackbar = useSnack();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IUserProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
    }
  });

  // Form resetelése, ha a felhasználó adatai megváltoznak
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: IUserProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Display name frissítése
      if (data.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: data.displayName
        });
        showSnackbar('Név sikeresen frissítve!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hiba történt a profil frissítése során');
      showSnackbar('Hiba történt a profil frissítése során!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccountCircleIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" component="h2" fontWeight="medium">
          Profil adatok
        </Typography>
      </Box>
      
      <Typography color="text.secondary" paragraph sx={{ mb: 3 }}>
        Itt módosíthatod a profil alapvető adatait.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teljes név"
                fullWidth
                variant="outlined"
                error={!!errors.displayName}
                helperText={errors.displayName?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Email cím"
            fullWidth
            variant="outlined"
            value={user?.email || ''}
            disabled={true}
            InputProps={{
              endAdornment: (
                <Tooltip title="Az email cím nem módosítható">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              ),
            }}
            helperText="Az email cím nem módosítható"
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
          {isSubmitting ? 'Mentés...' : 'Mentés'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfileForm;