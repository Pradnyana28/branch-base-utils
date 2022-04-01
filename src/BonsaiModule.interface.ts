export interface BonsaiOptions {
  JwtSecretKey?: string;
  service?: {
    [service: string]: {
      name: string;
      host: string;
      port: string;
    }
  }
}