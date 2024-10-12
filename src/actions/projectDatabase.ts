"use server";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "clients/prisma";
import { ActionResponse } from "types/actionResponse";
import { getDb } from "clients/projectDb";
import { ProjectDbTable, DbTableInfo } from "types/projectDb";
import { createAddColumnQuery } from "utils/sql";
import { SqliteTypes } from "types/projectDb";
import { getProjectPage } from "./projectPage";

const loadProject = async (projectId: string) => {
  const user = await currentUser();
  const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;
  const dbUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  const project = await prisma.project.findUnique({
    where: { id: projectId, createdById: dbUser?.id },
  });

  return { project, user, dbUser };
};

const getAllTables = async (
  projectId: string
): Promise<ActionResponse<ProjectDbTable[] | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let response: ProjectDbTable[] = [];

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      const projectTables = await projectDbClient.execute(
        `SELECT name FROM sqlite_master WHERE type='table';`
      );

      response = [
        ...projectTables.rows
          .filter((row) => {
            return !String(row.name).includes("sqlite");
          })
          .map((row) => {
            return {
              name: String(row.name),
            };
          }),
      ];
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getAllTables action:");
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

const validateProjectBelongsToUser = async (
  projectId: string
): Promise<ActionResponse<boolean | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let projectExists = false;

    if (project !== null) {
      projectExists = true;
    }

    return {
      data: projectExists,
      error: null,
    };
  } catch (error) {
    console.group("validateProjectBelongsToUser action:");
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

const createTable = async ({
  projectId,
  tableName,
}: {
  projectId: string;
  tableName: string;
}): Promise<ActionResponse> => {
  try {
    const { project } = await loadProject(projectId);
    let response = false;

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      await projectDbClient.execute(
        `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT);`
      );

      response = true;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("createTable action:");
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

const getTableInfo = async ({
  projectId,
  tableName,
}: {
  projectId: string;
  tableName: string;
}): Promise<ActionResponse<DbTableInfo[] | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let response = null;

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      const tableInfoResponse = await projectDbClient.execute({
        sql: `SELECT name, type, "notnull" AS isRequired, dflt_value AS defaultValue, pk AS isPrimaryKey FROM pragma_table_info(?);`,
        args: [tableName],
      });
      const tableInfo = tableInfoResponse.toJSON();
      response = tableInfo.rows.map((tableInfoRow: any) => {
        return {
          name: tableInfoRow.at(0),
          type: tableInfoRow.at(1),
          isRequired:
            tableInfoRow.at(0) === "id" ? true : tableInfoRow.at(2) === 1,
          defaultValue:
            tableInfoRow.at(0) === "id" ? "AUTO" : tableInfoRow.at(3),
          isPrimaryKey: tableInfoRow.at(4) === 1,
        };
      });
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getTableInfo action:");
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

const createColumn = async ({
  projectId,
  tableName,
  column,
}: {
  projectId: string;
  tableName: string;
  column: {
    name: string;
    type: SqliteTypes;
  };
}): Promise<ActionResponse<boolean | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let response = false;

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      const sqlQuery = createAddColumnQuery({
        tableName,
        columnName: column.name,
        columnType: column.type,
      });

      await projectDbClient.execute(sqlQuery);
      response = true;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("createColumn action:");
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

const removeColumn = async ({
  projectId,
  tableName,
  columnName,
}: {
  projectId: string;
  tableName: string;
  columnName: string;
}): Promise<ActionResponse<boolean | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let response = false;

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      await projectDbClient.execute(
        `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`
      );
      response = true;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("removeColumn action:");
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

const editColumnName = async ({
  projectId,
  tableName,
  previousColumnName,
  nextColumnName,
}: {
  projectId: string;
  tableName: string;
  previousColumnName: string;
  nextColumnName: string;
}): Promise<ActionResponse<boolean | null>> => {
  try {
    const { project } = await loadProject(projectId);
    let response = false;

    if (project) {
      const projectDbClient = getDb({
        url: project.tursoDbUrl!,
        authToken: project.tursoAuthToken!,
      });

      await projectDbClient.execute(
        `ALTER TABLE ${tableName} RENAME COLUMN ${previousColumnName} TO ${nextColumnName};`
      );
      response = true;
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("removeColumn action:");
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

// TODO: add optional auth?
const getTableData = async ({
  projectId,
  pageSlug,
}: {
  projectId: string;
  pageSlug: string;
}): Promise<ActionResponse<any[] | null>> => {
  try {
    const { data: projectPage, error } = await getProjectPage({
      projectId: projectId as string,
      pageSlug,
    });
    let response = [];

    if (!error && projectPage) {
      const projectDbClient = getDb({
        url: projectPage.project.tursoDbUrl!,
        authToken: projectPage.project.tursoAuthToken!,
      });

      const tableDataResponse = await projectDbClient.execute(
        `SELECT * FROM ${projectPage.dbTable}`
      );

      if (Boolean(tableDataResponse.rows.length)) {
        response = tableDataResponse.rows.map((row) => {
          const data = new Map();
          tableDataResponse.columns.forEach((column, columnIndex) => {
            data.set(column, row[columnIndex]);
          });

          return Object.fromEntries(data.entries());
        });
      }
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getTableData action:");
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

const createTableData = async ({
  projectId,
  pageSlug,
  formData,
}: {
  projectId: string;
  pageSlug: string;
  formData: Record<string, any>;
}): Promise<ActionResponse<boolean | null>> => {
  try {
    const { data: projectPage, error } = await getProjectPage({
      projectId: projectId as string,
      pageSlug,
    });
    let response = false;

    if (!error && projectPage) {
      const projectDbClient = getDb({
        url: projectPage.project.tursoDbUrl!,
        authToken: projectPage.project.tursoAuthToken!,
      });

      const queryColumns: string[] = [];
      const queryValues: any[] = [];

      Object.keys(formData).forEach((formDataKey) => {
        const column = formDataKey;
        const value = formData[column];
        queryColumns.push(column);

        if (typeof value === "string") {
          queryValues.push(`'${value}'`);
        } else {
          queryValues.push(value);
        }
      });

      const sql = `INSERT INTO ${projectPage.dbTable} (${queryColumns.join(
        ", "
      )}) VALUES (${queryValues.join(",")})`;
      console.log(sql);
      // TODO: try args or find out how to protect query
      const tableDataResponse = await projectDbClient.execute(sql);

      console.log(tableDataResponse);
      response = true;

      // if (Boolean(tableDataResponse.rows.length)) {
      //   response = tableDataResponse.rows.map((row) => {
      //     const data = new Map();
      //     tableDataResponse.columns.forEach((column, columnIndex) => {
      //       data.set(column, row[columnIndex]);
      //     });

      //     return Object.fromEntries(data.entries());
      //   });
      // }
    }

    return {
      data: response,
      error: null,
    };
  } catch (error) {
    console.group("getTableData action:");
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

// ALTER TABLE <TABLENAME> DROP COLUMN <COLUMNNAME>;

export {
  loadProject,
  getAllTables,
  validateProjectBelongsToUser,
  createTable,
  getTableInfo,
  createColumn,
  removeColumn,
  editColumnName,
  getTableData,
  createTableData,
};
