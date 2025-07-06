'use server';

import { revalidatePath } from 'next/cache';

export async function logoutAction(path: string) {
  revalidatePath(path);
}
