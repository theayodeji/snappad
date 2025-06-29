export function parseAxiosError(err: any): string {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.message) {
    return err.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
