import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Chip, 
  Alert, 
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { Controller, Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useClientContext } from '@/store/client-context';
import ExternalActionButton from '@/components/UI/Button/ExternalActionButton';
import { IClientOption, NOT_SELECTED_CLIENT_OPTION } from '../Forms/client-option/clientOptionHelper';
import ClientSearch from './ClientSearch';

interface ClientSectionProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  errors: any;
  clientOptions: IClientOption[];
  defaultMode?: 'search' | 'new' | 'edit';
  initialSelectedClient?: IClientOption;
}

const ClientSection: React.FC<ClientSectionProps> = ({ 
  control, 
  setValue, 
  getValues, 
  errors, 
  clientOptions, 
  defaultMode = 'search',
  initialSelectedClient = NOT_SELECTED_CLIENT_OPTION
}) => {
  // State az ügyfélkezelés módjának követésére
  const [mode, setMode] = useState<'search' | 'new' | 'edit'>(defaultMode);
  const [selectedClient, setSelectedClient] = useState<IClientOption>(initialSelectedClient);
  
  const clientCtx = useClientContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Frissítsük az állapotot, ha változik a kezdeti érték
  useEffect(() => {
    if (initialSelectedClient && initialSelectedClient.clientId !== 'not-selected') {
      setSelectedClient(initialSelectedClient);
      setMode('edit');
    }
  }, [initialSelectedClient]);
  
  // Ha van kiválasztott ügyfél és nem az alapértelmezett
  const hasSelectedClient = selectedClient && selectedClient.clientId !== 'not-selected';
  
  // Ügyfél adatainak frissítése
  const updateClientData = (client?: any) => {
    if (client && client.id !== 'not-selected') {
      setValue("clientName", client.name);
      setValue("clientPhone", client.phone ? client.phone : "");
      setValue("clientEmail", client.email ? client.email : "");
      setValue("clientAddress", client.address ? client.address : "");
    } else {
      setValue("clientName", "");
      setValue("clientPhone", "");
      setValue("clientEmail", "");
      setValue("clientAddress", "");
    }
  };
  
  // Jelenlegi állapot kezelése
  const handleModeChange = (newMode: 'search' | 'new' | 'edit') => {
    if (newMode === 'new') {
      // Ha új ügyfél létrehozásra váltunk, töröljük a kiválasztott ügyfelet
      setValue("selectedClientOption", NOT_SELECTED_CLIENT_OPTION);
      // Töröljük az ügyfél adatokat
      updateClientData(undefined);
      setSelectedClient(NOT_SELECTED_CLIENT_OPTION);
    }
    setMode(newMode);
  };
  
  // Ügyfél kiválasztásának kezelése
  const handleClientSelect = (option: IClientOption) => {
    setSelectedClient(option);
    setValue("selectedClientOption", option);
    
    if (option.clientId !== 'not-selected') {
      // Ha létező ügyfelet választottunk, szerkesztési módba váltunk
      setMode('edit');
      updateClientData(clientCtx.getClientById(option.clientId));
    }
  };

  return (
    <>
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: { xs: 2, sm: 0 },
          mb: 2 
        }}>
          <Typography variant="body1" fontWeight="500" sx={{ mb: { xs: 1, sm: 0 } }}>
            Ügyfél kiválasztása
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Chip 
              icon={<SearchIcon />} 
              label="Keresés" 
              color={mode === 'search' ? "primary" : "default"}
              onClick={() => handleModeChange('search')}
              variant={mode === 'search' ? "filled" : "outlined"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            />
            <Chip 
              icon={<PersonAddIcon />} 
              label="Új ügyfél" 
              color={mode === 'new' ? "primary" : "default"}
              onClick={() => handleModeChange('new')}
              variant={mode === 'new' ? "filled" : "outlined"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            />
            {hasSelectedClient && (
              <Chip 
                icon={<EditIcon />} 
                label="Szerkesztés" 
                color={mode === 'edit' ? "primary" : "default"}
                onClick={() => handleModeChange('edit')}
                variant={mode === 'edit' ? "filled" : "outlined"}
                sx={{ flexGrow: { xs: 1, sm: 0 } }}
              />
            )}
          </Box>
        </Box>
        
        {mode === 'search' && (
          <Controller
            name="selectedClientOption"
            control={control}
            render={({ field }) => (
              <ClientSearch
                id="selectedClientOption"
                options={clientOptions}
                value={field.value}
                onChange={(option) => {
                  field.onChange(option);
                  handleClientSelect(option);
                }}
                onClientDataChange={(clientId) => {
                  updateClientData(clientCtx.getClientById(clientId));
                }}
                error={!!errors.selectedClientOption}
                helperText={errors.selectedClientOption?.message}
                required
              />
            )}
          />
        )}
        
        {mode === 'new' && (
          <Alert severity="info">
            Új ügyfél létrehozása - töltse ki az alábbi mezőket az ügyfél adataival.
          </Alert>
        )}
        
        {mode === 'edit' && hasSelectedClient && (
          <Alert severity="info">
            <strong>{selectedClient.label}</strong> ügyfél adatainak szerkesztése.
          </Alert>
        )}
      </Box>
      
      <Divider />
      
      <Typography variant="body1" fontWeight="500" marginTop={2} marginBottom={2}>
        {mode === 'new' ? 'Új ügyfél adatai' : 'Ügyfél adatai'}
      </Typography>
      
      {/* Az eredeti űrlapmezők, nem változnak a reszponzivitással */}
      <Controller
        name="clientName"
        control={control}
        render={({ field }) => (
          <TextField
            id="clientName"
            label="Név"
            type="text"
            error={!!errors.clientName}
            helperText={errors.clientName?.message}
            {...field}
            disabled={mode === 'search'}
            required={mode === 'new'}
            fullWidth
          />
        )}
      />
      
      <Controller
        name="clientPhone"
        control={control}
        render={({ field }) => (
          <TextField
            id="clientPhone"
            label="Telefonszám"
            type="text"
            error={!!errors.clientPhone}
            helperText={errors.clientPhone?.message}
            {...field}
            disabled={mode === 'search'}
            fullWidth
            InputProps={{
              endAdornment: field.value ? (
                <Box sx={{ display: 'flex' }}>
                  <ExternalActionButton type="tel" value={field.value} />
                  <ExternalActionButton type="sms" value={field.value} />
                </Box>
              ) : null
            }}
          />
        )}
      />
      
      <Controller
        name="clientEmail"
        control={control}
        render={({ field }) => (
          <TextField
            id="clientEmail"
            label="E-mail cím"
            type="email"
            error={!!errors.clientEmail}
            helperText={errors.clientEmail?.message}
            {...field}
            disabled={mode === 'search'}
            fullWidth
            InputProps={{
              endAdornment: field.value ? <ExternalActionButton type="mailto" value={field.value} /> : null
            }}
          />
        )}
      />
      
      <Controller
        name="clientAddress"
        control={control}
        render={({ field }) => (
          <TextField
            id="clientAddress"
            label="Lakcím"
            type="text"
            error={!!errors.clientAddress}
            helperText={errors.clientAddress?.message}
            {...field}
            disabled={mode === 'search'}
            fullWidth
          />
        )}
      />
    </>
  );
};

export default ClientSection;