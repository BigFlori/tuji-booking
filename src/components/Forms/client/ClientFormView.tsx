import { Box, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import ModalControls from "@/components/UI/Modal/ModalControls";
import ExternalActionButton from "@/components/UI/Button/ExternalActionButton";
import { IClientFormViewProps } from "./ClientFormTypes";

const ClientFormView: React.FC<IClientFormViewProps> = (props) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = props.form;

  return (
    <Box component="form" autoComplete="off" noValidate onSubmit={handleSubmit(props.onSubmit)} sx={{ height: "100%" }}>
      <ModalControls
        title={props.mode === 'create' ? "Új ügyfél létrehozása" : "Ügyfél szerkesztése"}
        onClose={props.onClose}
        onDelete={props.mode === 'edit' ? props.onDelete : undefined}
        isEdit={props.mode === 'edit'}
        saveButtonProps={{ type: "submit" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                id="name"
                label="Név"
                type="text"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                id="phone"
                label="Telefonszám"
                type="text"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                InputProps={{
                  endAdornment: (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <ExternalActionButton type="tel" value={watch("phone")} />
                      <ExternalActionButton type="sms" value={watch("phone")} />
                    </Box>
                  ),
                }}
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                id="email"
                label="E-mail cím"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  endAdornment: <ExternalActionButton type="mailto" value={watch("email")} />,
                }}
                {...field}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                id="address"
                label="Lakcím"
                type="text"
                error={!!errors.address}
                helperText={errors.address?.message}
                {...field}
              />
            )}
          />
        </Box>
      </ModalControls>
    </Box>
  );
};

export default ClientFormView;