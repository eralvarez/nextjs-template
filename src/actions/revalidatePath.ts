"use server";
import { revalidatePath as originalRevalidatePath } from "next/cache";

const revalidatePath = (
  originalPath: string,
  type: "layout" | "page" = "page"
) => {
  originalRevalidatePath(originalPath, type);
};

export { revalidatePath };
