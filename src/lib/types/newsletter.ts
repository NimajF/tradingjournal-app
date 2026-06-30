import type { NoteContent } from "./note";

export type Newsletter = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content: NoteContent | null;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  created_at: string;
  is_favorite: boolean;
};

export type NewsletterImage = {
  id: string;
  newsletter_id: string;
  cloudinary_url: string;
  public_id: string;
  created_at: string;
};

export type NewslettersListProps = {
  newsletters: Newsletter[];
};

export type CreateNewsletterInput = {
  title: string;
  description?: string | null;
};

export type UpdateNewsletterInput = {
  title?: string;
  description?: string | null;
  content?: NoteContent | null;
  is_favorite?: boolean;
  cover_image_url?: string | null;
  cover_image_public_id?: string | null;
};
