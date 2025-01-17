import { object, string, minLength, maxLength, pipe } from 'valibot';

export const NoteSchema = object({
  title: pipe(string(), minLength(1), maxLength(100)),
  content: pipe(string(), minLength(1)), //
  userId: pipe(string(), minLength(24), maxLength(24)),
});
