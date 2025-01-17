import { object, string, minLength, optional, email, pipe } from 'valibot';

export const UpdateUserPayloadSchema = object({
  firstName: optional(pipe(string(), minLength(1))),
  lastName: optional(pipe(string(), minLength(1))),
  email: optional(pipe(string(), email())),
});

export const ChangePasswordPayloadSchema = object({
  currentPassword: pipe(string(), minLength(8)),
  newPassword: pipe(string(), minLength(8)),
});
