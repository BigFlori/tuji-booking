import Group from "@/models/group/group-model";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ModalControls from "../UI/Modal/ModalControls";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { group } from "console";

interface IGroupEditFormProps {
  group: Group;
  onSubmit: (values: IGroupEditFormValues) => void;
  onClose: () => void;
  onDelete: () => void;
}

export interface IGroupEditFormValues {
  title: string;
  description?: string;
  state: string;
  type: string;
}

const validationSchema: yup.ObjectSchema<IGroupEditFormValues> = yup.object().shape({
  title: yup.string().max(25, "A csoport neve maximum 25 karakter lehet").required("A csoport neve kötelező"),
  description: yup.string().optional(),
  state: yup.string().required("A csoport állapota kötelező"),
  type: yup.string().required("A csoport típusa kötelező"),
});

const GroupEditForm: React.FC<IGroupEditFormProps> = (props: IGroupEditFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IGroupEditFormValues>({
    defaultValues: {
      title: props.group.title,
      description: props.group.description,
      state: props.group.state,
      type: props.group.type,
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(props.onSubmit, (error) => console.log(error))}
    >
      <ModalControls
        title="Csoport szerkesztése"
        onClose={props.onClose}
        onDelete={props.onDelete}
        isEdit
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

export default GroupEditForm;
