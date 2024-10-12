"use server";
import { Prisma, ProjectPage } from "@prisma/client";

import prisma from "clients/prisma";
import { ActionResponse } from "types/actionResponse";
import { loadProject } from "./projectDatabase";

const createProjectPage = async ({
  projectId,
  projectPage,
}: {
  projectId: string;
  projectPage: Partial<ProjectPage>;
}): Promise<ActionResponse<boolean | null>> => {
  try {
    const { project, dbUser } = await loadProject(projectId);
    let response = false;

    if (project) {
      await prisma.projectPage.create({
        data: {
          ...(projectPage as ProjectPage),
          createdById: dbUser?.id as string,
          layoutConfig: JSON.stringify({}),
          projectId: project.id,
        },
      });

      response = true;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("createProjectPage action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const getProjectPages = async ({
  projectId,
}: {
  projectId: string;
}): Promise<ActionResponse<ProjectPage[] | null>> => {
  try {
    const { project, dbUser } = await loadProject(projectId);
    let response = null;

    if (project) {
      const projectPages = await prisma.projectPage.findMany({
        where: { projectId: project.id, createdById: dbUser?.id },
      });
      response = projectPages;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getProjectPages action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

// const userWithCars = Prisma.validator<Prisma.UserArgs>()({
//   include: { cars: true },
// })
const projectPageWithProject =
  Prisma.validator<Prisma.ProjectPageDefaultArgs>()({
    include: {
      project: true,
    },
  });

const getProjectPage = async ({
  projectId,
  pageSlug,
}: {
  projectId: string;
  pageSlug: string;
}): Promise<
  ActionResponse<Prisma.ProjectPageGetPayload<
    typeof projectPageWithProject
  > | null>
> => {
  try {
    let response = null;

    const projectPage = await prisma.projectPage.findUnique({
      where: {
        projectId,
        slug: pageSlug,
      },
      include: {
        project: true,
      },
    });
    response = projectPage;

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getProjectPage action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

export { createProjectPage, getProjectPages, getProjectPage };
