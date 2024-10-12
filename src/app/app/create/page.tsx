"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

import DashboardHeader from "components/DashboardHeader";
import DashboardPageLayout from "components/DashboardPageLayout";
import FormFactory from "components/FormFactory";
import Button from "components/Button";
import FormActionsContainer from "components/FormActionsContainer";
import { createProject } from "actions/project";
import { revalidatePath } from "actions/revalidatePath";
import { useSnackbar } from "context/SnackbarContext";

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  slug: yup.string().required(),
});

export default function CreateProjectPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { mutate: createProjectMutation, isLoading } = useMutation(
    createProject,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          showSnackbar("Slug is taken, try another one", "error");
        } else {
          showSnackbar("Project created", "success");
          revalidatePath("/app");
          router.replace("/app");
        }
      },
    }
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      slug: "",
    },
    validationSchema,
    onSubmit: (formData) => {
      createProjectMutation(formData);
    },
  });

  // const handleFormChange = (inputName: string, value: string) => {
  //   console.log({ inputName, value });
  // };

  return (
    <DashboardPageLayout>
      <DashboardHeader title="Create app" subtitle={`lorem`} />

      <div className="w-full lg:max-w-96">
        <FormFactory
          inputConfigs={[
            {
              type: "text",
              label: "Name",
              name: "name",
            },
            {
              type: "text",
              label: "Description",
              name: "description",
            },
            {
              type: "text",
              label: "Slug",
              name: "slug",
            },
          ]}
          formik={formik}
          validationSchema={validationSchema}
          // onChange={handleFormChange}
        />
        <FormActionsContainer>
          <Button
            variant="text"
            onClick={() => router.replace("/app")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => formik.submitForm()}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Create
          </Button>
        </FormActionsContainer>
      </div>
    </DashboardPageLayout>
  );
}
