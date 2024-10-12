import { useFormik } from "formik";
import * as yup from "yup";
import { isUndefined } from "lodash";

import { isDevEnv } from "env/client";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { isUndefined } from "lodash";
// import { v4 as uuid } from "uuid";
// import { ChangeEvent } from "react";

// import supabase from "utils/supabase/client";
// import Link from "next/link";

type InputType =
  | "text"
  | "textarea"
  | "select"
  | "datetime"
  | "file"
  | "boolean"
  | "checkbox";

interface SelectOptions {
  id: string;
  label: string;
}

export interface InputConfig {
  type: InputType;
  label: string;
  name: string;
  placeholder?: string;
  options?: SelectOptions[];
  enabled?: boolean;
  doneText?: string;
  cancelText?: string;
  datetimePresentation?: "time" | "date";
  file?: {
    accept: string;
  };
}

// type InputConfigOrNull = InputConfig & null;

interface FormProps {
  inputConfigs: (InputConfig | null)[];
  formik: ReturnType<typeof useFormik<any>>;
  validationSchema?: yup.ObjectSchema<any>;
  onChange?: (inputName: string, value: any) => void;
  // stackProps?: StackProps;
}

export default function FormFactory({
  inputConfigs,
  formik,
  validationSchema,
  onChange,
}: Readonly<FormProps>) {
  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   const file = event.target.files![0];
  //   const destinationPath = "images/lands";
  //   const fileName = file.name.split(".").at(0);
  //   const fileType = file.name.split(".").at(-1);
  //   const fileHash = uuid().split("-").at(0);
  //   const fileNameToUpload = `${destinationPath}/${fileName}-${fileHash}.${fileType}`;

  //   // const { error: uploadError } = await supabase.storage
  //   //   .from("files")
  //   //   .upload(fileNameToUpload, file);

  //   // if (uploadError) {
  //   //   alert("Error al subir el archivo");
  //   // } else {
  //   //   const {
  //   //     data: { publicUrl },
  //   //   } = supabase.storage.from("files").getPublicUrl(fileNameToUpload);

  //   //   // console.log({ publicUrl });
  //   //   formik.setFieldValue(field, publicUrl);
  //   // }
  // };

  const getElement = (inputConfig: InputConfig) => {
    const isRequired =
      ((validationSchema?.describe().fields[inputConfig.name] as any)
        .optional ?? false) === false;

    switch (inputConfig.type) {
      case "text": {
        // console.log(formik);
        // console.log(validationSchema?.describe().fields[inputConfig.name]);
        // console.log({ isRequired });
        return (
          <label className="block" key={inputConfig.label}>
            <span className="text-gray-700">
              {inputConfig.label}{" "}
              {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <input
              id={inputConfig.name}
              name={inputConfig.name}
              type="text"
              value={formik.values[inputConfig.name]}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
              placeholder={inputConfig.placeholder ?? ""}
              className="block w-full"
            />

            {formik.touched[inputConfig.name] &&
              Boolean(formik.errors[inputConfig.name]) && (
                <>
                  {typeof formik.errors[inputConfig.name] === "string" ? (
                    <span className="text-sm text-red-500">
                      {formik.errors[inputConfig.name] as string}
                    </span>
                  ) : null}
                </>
              )}
          </label>
        );
      }
      case "checkbox":
        return (
          <div className="block" key={inputConfig.label}>
            <span className="text-gray-700">
              {inputConfig.label}{" "}
              {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <div
              data-testid="checkboxesContainer"
              className="flex flex-col gap-0 mt-1"
            >
              {inputConfig.options!.map((selectOption) => (
                <label
                  key={selectOption.id}
                  className="flex flex-row gap-1 justify-start items-center"
                >
                  <input
                    type="checkbox"
                    checked={(
                      formik.values[inputConfig.name] as string[]
                    ).includes(selectOption.id)}
                    onChange={() => {
                      let currentValues = [
                        ...(formik.values[inputConfig.name] as string[]),
                      ];
                      const currentKey = selectOption.id;

                      if (currentValues.includes(currentKey)) {
                        currentValues = currentValues.filter(
                          (value) => value !== currentKey
                        );
                      } else {
                        currentValues.push(currentKey);
                      }

                      formik.setFieldValue(inputConfig.name, currentValues);

                      if (!isUndefined(onChange)) {
                        onChange(inputConfig.name, currentValues);
                      }
                    }}
                  />
                  <span>{selectOption.label}</span>
                </label>
              ))}
            </div>

            {formik.touched[inputConfig.name] &&
              Boolean(formik.errors[inputConfig.name]) && (
                <>
                  {typeof formik.errors[inputConfig.name] === "string" ? (
                    <span className="text-sm text-red-500">
                      {formik.errors[inputConfig.name] as string}
                    </span>
                  ) : null}
                </>
              )}
          </div>
        );
      case "textarea":
        // return (
        //   <Stack key={inputConfig.label} direction="column" gap={1}>
        //     <Typography component="label" htmlFor={inputConfig.name}>
        //       {inputConfig.label}
        //     </Typography>
        //     <TextField
        //       id={inputConfig.name}
        //       name={inputConfig.name}
        //       value={formik.values[inputConfig.name]}
        //       onChange={formik.handleChange}
        //       fullWidth
        //       multiline
        //       rows={4}
        //       helperText={
        //         Boolean(formik.errors[inputConfig.name])
        //           ? (formik.errors[inputConfig.name] as string)
        //           : ""
        //       }
        //     />
        //   </Stack>
        // );
        return null;
      case "boolean": {
        return (
          <label
            className="flex flex-row justify-start items-center"
            key={inputConfig.label}
          >
            <span className="text-gray-700 mr-2">
              {inputConfig.label}{" "}
              {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <input
              id={inputConfig.name}
              name={inputConfig.name}
              type="checkbox"
              // value={formik.values[inputConfig.name]}
              checked={formik.values[inputConfig.name]}
              onChange={(event) => {
                const inputValue = event.target.checked;
                formik.handleChange(event);

                if (!isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
            />
          </label>
        );
      }
      case "select": {
        return (
          <label className="block" key={inputConfig.label}>
            <span className="text-gray-700">
              {inputConfig.label}{" "}
              {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <select
              id={inputConfig.name}
              name={inputConfig.name}
              className="block w-full"
              value={formik.values[inputConfig.name]}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
            >
              <option value="" disabled>
                Choose here
              </option>
              {inputConfig.options!.map((selectOption) => (
                <option key={selectOption.id} value={selectOption.id}>
                  {selectOption.label}
                </option>
              ))}
            </select>

            {formik.touched[inputConfig.name] &&
              Boolean(formik.errors[inputConfig.name]) && (
                <>
                  {typeof formik.errors[inputConfig.name] === "string" ? (
                    <span className="text-sm text-red-500">
                      {formik.errors[inputConfig.name] as string}
                    </span>
                  ) : null}
                </>
              )}
          </label>
        );
        // return null;
        // if (isUndefined(inputConfig.enabled)) {
        //   return (
        //     <IonItem key={inputConfig.label}>
        //       <IonSelect
        //         label={inputConfig.label}
        //         labelPlacement="stacked"
        //         value={formik.values[inputConfig.name]}
        //         onIonChange={(event) =>
        //           formik.setFieldValue(inputConfig.name, event.detail.value)
        //         }
        //       >
        //         {inputConfig.options!.map((option) => (
        //           <IonSelectOption value={option.id} key={option.id}>
        //             {option.label}
        //           </IonSelectOption>
        //         ))}
        //       </IonSelect>
        //     </IonItem>
        //   );
        // } else {
        //   return Boolean(inputConfig.enabled) ? (
        //     <IonItem key={inputConfig.label}>
        //       <IonSelect
        //         label={inputConfig.label}
        //         labelPlacement="stacked"
        //         value={formik.values[inputConfig.name]}
        //         onIonChange={(event) =>
        //           formik.setFieldValue(inputConfig.name, event.detail.value)
        //         }
        //       >
        //         {inputConfig.options!.map((option) => (
        //           <IonSelectOption value={option.id} key={option.id}>
        //             {option.label}
        //           </IonSelectOption>
        //         ))}
        //       </IonSelect>
        //     </IonItem>
        //   ) : null;
        // }
      }
      case "datetime":
        return null;
      // const datetimeKey = uuid();
      // if (isUndefined(inputConfig.enabled)) {
      //   return (
      //     <IonItem key={inputConfig.label}>
      //       <div
      //         style={{
      //           display: "flex",
      //           flexDirection: "column",
      //           gap: 8,
      //           paddingTop: 6,
      //           paddingBottom: 6,
      //         }}
      //       >
      //         <IonLabel style={{ fontSize: 13 }}>
      //           {inputConfig.label}
      //         </IonLabel>
      //         <div style={{ width: "100%" }}>
      //           <IonDatetimeButton datetime={datetimeKey}></IonDatetimeButton>
      //           <IonModal keepContentsMounted={true}>
      //             <IonDatetime
      //               id={datetimeKey}
      //               presentation={inputConfig.datetimePresentation}
      //               showDefaultButtons
      //               doneText={inputConfig.doneText}
      //               cancelText={inputConfig.cancelText}
      //               value={formik.values[inputConfig.name]}
      //               onIonChange={(event) =>
      //                 formik.setFieldValue(
      //                   inputConfig.name,
      //                   event.detail.value
      //                 )
      //               }
      //             ></IonDatetime>
      //           </IonModal>
      //         </div>
      //       </div>
      //     </IonItem>
      //   );
      // } else {
      //   return Boolean(inputConfig.enabled) ? (
      //     <IonItem key={inputConfig.label}>
      //       <div
      //         style={{
      //           display: "flex",
      //           flexDirection: "column",
      //           gap: 8,
      //           paddingTop: 6,
      //           paddingBottom: 6,
      //         }}
      //       >
      //         <IonLabel style={{ fontSize: 13 }}>
      //           {inputConfig.label}
      //         </IonLabel>
      //         <div style={{ width: "100%" }}>
      //           <IonDatetimeButton datetime={datetimeKey}></IonDatetimeButton>
      //           <IonModal keepContentsMounted={true}>
      //             <IonDatetime
      //               id={datetimeKey}
      //               presentation={inputConfig.datetimePresentation}
      //               showDefaultButtons
      //               doneText={inputConfig.doneText}
      //               cancelText={inputConfig.cancelText}
      //               value={formik.values[inputConfig.name]}
      //               onIonChange={(event) =>
      //                 formik.setFieldValue(
      //                   inputConfig.name,
      //                   event.detail.value
      //                 )
      //               }
      //             ></IonDatetime>
      //           </IonModal>
      //         </div>
      //       </div>
      //     </IonItem>
      //   ) : null;
      // }
      case "file":
        // return (
        //   <Stack key={inputConfig.label} direction="column" gap={1}>
        //     <Typography component="label" htmlFor={inputConfig.name}>
        //       {inputConfig.label}
        //     </Typography>

        //     {formik.values[inputConfig.name] && (
        //       <List>
        //         {typeof formik.values[inputConfig.name] === "string" && (
        //           <ListItem
        //             disableGutters
        //             secondaryAction={
        //               <Stack direction="row">
        //                 <Link
        //                   href={formik.values[inputConfig.name]}
        //                   target="_blank"
        //                 >
        //                   <IconButton aria-label="comment">
        //                     <VisibilityIcon />
        //                   </IconButton>
        //                 </Link>
        //                 <IconButton
        //                   aria-label="comment"
        //                   onClick={() => {
        //                     formik.setFieldValue(inputConfig.name, "");
        //                   }}
        //                 >
        //                   <DeleteIcon />
        //                 </IconButton>
        //               </Stack>
        //             }
        //           >
        //             <ListItemText
        //               primary={formik.values[inputConfig.name]
        //                 .split("/")
        //                 .at(-1)}
        //             />
        //           </ListItem>
        //         )}

        //         {/* {typeof formik.values[inputConfig.name] === "object" && (
        //           <>
        //             {formik.values[inputConfig.name].map(
        //               (item: string, itemIndex: number) => (
        //                 <ListItem
        //                   disableGutters
        //                   secondaryAction={
        //                     <IconButton
        //                       aria-label="comment"
        //                       onClick={() => {
        //                         formik.setFieldValue(inputConfig.name, "");
        //                       }}
        //                     >
        //                       <DeleteIcon />
        //                     </IconButton>
        //                   }
        //                 >
        //                   <ListItemText primary={item.split("/").at(-1)} />
        //                 </ListItem>
        //               )
        //             )}
        //           </>
        //         )} */}
        //       </List>
        //     )}
        //     <Button
        //       component="label"
        //       role={undefined}
        //       variant="contained"
        //       tabIndex={-1}
        //     >
        //       Subir archivo
        //       <Input
        //         type="file"
        //         sx={{ display: "none" }}
        //         inputProps={{
        //           accept: inputConfig.file?.accept,
        //         }}
        //         onClick={(event: any) => (event.target.value = "")}
        //         // onChange={(event) => handleFileChange(event as HTMLInputElement, inputConfig.name)}
        //         onChange={(event) =>
        //           handleFileChange(
        //             event as ChangeEvent<HTMLInputElement>,
        //             inputConfig.name
        //           )
        //         }
        //       />
        //     </Button>
        //   </Stack>
        // );
        return null;

      default:
        break;
    }
    return null;
  };

  return (
    <div data-testid="formFactory" className="flex flex-col gap-2 mb-4">
      {inputConfigs.map(
        (inputConfig) => inputConfig && getElement(inputConfig)
      )}

      {isDevEnv() ? <pre>{JSON.stringify(formik.values, null, 2)}</pre> : null}
    </div>
  );
}
