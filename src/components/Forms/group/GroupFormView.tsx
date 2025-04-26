import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { IGroupFormModel } from "./GroupFormTypes";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import ModalControls from "@/components/UI/Modal/ModalControls";
import { IGroupFormViewProps } from "./GroupFormTypes";

const GroupFormView: React.FC<IGroupFormViewProps> = (props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = props.form;

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <ModalControls
        title={props.mode === 'create' ? "Új csoport" : "Csoport szerkesztése"}
        onClose={props.onClose}
        onDelete={props.mode === 'edit' ? props.onDelete : undefined}
        isEdit={props.mode === 'edit'}
        saveButtonProps={{ type: "submit" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Alapinformációk
          </Typography>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField id="title" label="Név" error={!!errors.title} helperText={errors.title?.message} {...field} />
            )}
          />

          <FormControl>
            <InputLabel id="type">Típus</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="type"
                  id="type"
                  label="Típus"
                  value={field.value}
                  ref={field.ref}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  error={!!errors.type}
                >
                  <MenuItem value="CAR">Autó</MenuItem>
                  <MenuItem value="HOUSE">Lakás</MenuItem>
                  <MenuItem value="DRIVER">Sofőr</MenuItem>
                  <MenuItem value="CAR_WASH">Autókozmetika</MenuItem>
                  <MenuItem value="OTHER">Egyéb</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl>
            <InputLabel id="state">Állapot</InputLabel>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="state"
                  id="state"
                  label="Állapot"
                  value={field.value}
                  ref={field.ref}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  error={!!errors.state}
                >
                  <MenuItem value="ACTIVE">Aktív</MenuItem>
                  <MenuItem value="SOLD">Eladva</MenuItem>
                  <MenuItem value="IN_SERVICE">Szervízben</MenuItem>
                  <MenuItem value="INACTIVE">Inaktív</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                id="description"
                label="Leírás"
                rows={4}
                multiline
                {...field}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Box>
      </ModalControls>
    </Box>
  );
};

export default GroupFormView;