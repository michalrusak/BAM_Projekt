import { object, string, email, minLength, pipe } from 'valibot';

export const LoginPayloadSchema = object({
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8)),
});
export const RegisterPayloadSchema = object({
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8)),
  firstName: pipe(string(), minLength(1)),
  lastName: pipe(string(), minLength(1)),
});
