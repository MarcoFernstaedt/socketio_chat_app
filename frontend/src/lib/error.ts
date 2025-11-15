export type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as ErrorWithResponse;
  return err?.response?.data?.message ?? fallback;
};
