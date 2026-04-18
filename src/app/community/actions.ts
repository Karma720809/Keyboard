"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost } from "@/lib/store";

export async function submitPost(formData: FormData) {
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const authorInput = formData.get("author")?.toString();
  
  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const author = authorInput && authorInput.trim() !== "" ? authorInput.trim() : "익명";

  await createPost({ title, content, author });
  
  revalidatePath("/community");
  redirect("/community");
}
