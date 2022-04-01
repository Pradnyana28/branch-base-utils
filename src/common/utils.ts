export const hideSensitiveData = <T>(data: any): T => {
  delete (data as any).password;
  delete (data as any).__v;

  return data;
};
