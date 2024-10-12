"use server";
import { Project } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { v4 as uuid } from "uuid";

import turso from "clients/turso";
import prisma from "clients/prisma";
import { ActionResponse } from "types/actionResponse";

const createProject = async (
  project: Partial<Project>
): Promise<ActionResponse> => {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    const projectSlug = `${project.slug}-${uuid().split("-").at(0)}`;

    const dbName = `${process.env.TURSO_GROUP}-project-${project
      .name!.replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(" ")
      .join("-")
      .toLocaleLowerCase()}-${uuid().split("-").at(0)}`;

    const newDb = await turso.databases.create(dbName, {
      group: process.env.TURSO_GROUP,
      // schema: "genapp-project",
    });
    const tursoAuthToken = await turso.databases.createToken(dbName, {
      authorization: "full-access",
    });

    await prisma.project.create({
      data: {
        ...(project as Project),
        slug: projectSlug,
        createdById: dbUser?.id as string,
        tursoDbUrl: `libsql://${newDb.hostname}`,
        tursoAuthToken: tursoAuthToken.jwt,
        tursoDbName: dbName,
      },
    });

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.group("createProject action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof PrismaClientKnownRequestError) {
      errorMessage = "DB error";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const getAllProjects = async (): Promise<ActionResponse<Project[] | null>> => {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    const projects = await prisma.project.findMany({
      where: { createdById: dbUser?.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: projects,
      error: null,
    };
  } catch (error) {
    console.group("getAllProjects action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof PrismaClientKnownRequestError) {
      errorMessage = "DB error";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const isSlugAvailable = async (
  slug: string
): Promise<ActionResponse<boolean | null>> => {
  try {
    const response = await prisma.project.findUnique({
      where: {
        slug,
      },
    });

    return { data: !Boolean(response), error: null };
  } catch (error) {
    console.group("createProject action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof PrismaClientKnownRequestError) {
      errorMessage = "DB error";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

export { createProject, getAllProjects, isSlugAvailable };
