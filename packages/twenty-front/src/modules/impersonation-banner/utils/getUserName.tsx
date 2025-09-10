import { type CurrentUser } from '@/auth/states/currentUserState';
import { isNonEmptyString } from '@sniptt/guards';

export const getUserName = (user?: CurrentUser | null): string => {
  if (!user) return '';

  const parts = [user.firstName, user.lastName].filter(isNonEmptyString);
  const fullName = parts.join(' ');

  if (isNonEmptyString(fullName)) return fullName;
  if (isNonEmptyString(user.email)) return user.email;
  return '';
};
