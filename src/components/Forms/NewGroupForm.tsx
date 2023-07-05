import Group from "@/models/group/group-model";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import ModalControls from "../UI/Modal/ModalControls";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface INewGroupFormProps {
  onClose: () => void;
  onSubmit: (values: INewGroupFormState) => void;
}

export interface INewGroupFormState {
  title: string;
  description?: string;
  state: string;
  type: string;
}

const validationSchema: yup.ObjectSchema<INewGroupFormState> = yup.object().shape({
  title: yup.string().max(25, "A csoport neve maximum 25 karakter lehet").required("A csoport neve kötelező"),
  description: yup.string().optional(),
  state: yup.string().required("A csoport állapota kötelező"),
  type: yup.string().required("A csoport típusa kötelező"),
});

const NewGroupForm: React.FC<INewGroupFormProps> = (props: INewGroupFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<INewGroupFormState>({
    defaultValues: {
      title: "",
      description: "",
      state: GroupState.ACTIVE,
      type: GroupType.CAR,
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(props.onSubmit, (error) => console.log(error))}
    >
      <ModalControls title="Új csoport" onClose={props.onClose} saveButtonProps={{ type: "submit" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
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

export default NewGroupForm;
