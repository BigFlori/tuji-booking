import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography,
  Avatar,
  Alert,
  TextField,
  Stack
} from '@mui/material';
import { useUser } from '@/store/user-context';
import { updateProfile, getAuth } from 'firebase/auth';
import { useSnack } from '@/hooks/useSnack';
import DeleteIcon from '@mui/icons-material/Delete';

const UserAvatarUpload = () => {
  const user = useUser();
  const showSnackbar = useSnack();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // URL a profilképhez - alapértelmezett érték üres string
  const [photoURL, setPhotoURL] = useState<string>('');
  // Megjelenített avatar fotó URL-je
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    if (user?.photoURL) {
      setAvatarUrl(user.photoURL);
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !auth.currentUser) return;

    // Basic URL validation
    if (photoURL && !photoURL.match(/^https?:\/\/.+/)) {
      setError('Kérjük, adjon meg egy érvényes URL-t (http:// vagy https:// előtaggal)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateProfile(auth.currentUser, {
        photoURL: photoURL || null
      });
      
      setAvatarUrl(photoURL || null);
      showSnackbar('Profilkép sikeresen frissítve!', 'success');
    } catch (err: any) {
      console.error(err);
      setError('Hiba történt a profilkép frissítése során');
      showSnackbar('Hiba történt a profilkép frissítése során', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !auth.currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateProfile(auth.currentUser, {
        photoURL: ""
      });
      
      setAvatarUrl(null);
      setPhotoURL('');
      
      showSnackbar('Profilkép sikeresen törölve!', 'success');
    } catch (err: any) {
      console.error(err);
      setError('Hiba történt a kép törlése során');
      showSnackbar('Hiba történt a kép törlése során', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" component="h2" fontWeight="medium" sx={{ mb: 3, textAlign: 'center' }}>
        Profilkép
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 3 }}>
        <Avatar
          src={avatarUrl || undefined}
          alt={user?.displayName || 'Felhasználó'}
          sx={{
            width: 160,
            height: 160,
            fontSize: 64,
            boxShadow: 3,
            mb: 2
          }}
        />
        {isLoading && (
          <CircularProgress
            size={30}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-15px',
              marginLeft: '-15px',
            }}
          />
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mb: 2 }}>
        <TextField
          label="Profilkép URL-je"
          variant="outlined"
          fullWidth
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          placeholder="https://example.com/image.jpg"
          helperText="Adja meg a profilképhez használni kívánt kép URL-jét"
          sx={{ mb: 2 }}
          disabled={isLoading}
        />
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            Mentés
          </Button>
          
          {avatarUrl && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAvatar}
              disabled={isLoading}
              startIcon={<DeleteIcon />}
            >
              Törlés
            </Button>
          )}
        </Stack>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        Adjon meg egy nyilvános képet tartalmazó URL-t a profilképhez.
      </Typography>
    </Box>
  );
};

export default UserAvatarUpload;