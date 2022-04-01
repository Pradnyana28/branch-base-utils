import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { BonsaiOptions } from "./BonsaiModule.interface";

@Global()
@Module({})
export default class BonsaiModule {
  public static registerAsync(options: BonsaiOptions): DynamicModule {
    return {
      module: BonsaiModule,
      imports: [
        ConfigModule.forRoot(),
        ClientsModule.register([
          {
            name: options.service?.user.name ?? process.env.SERVICE_USER_NAME,
            transport: Transport.TCP,
            options: {
              host: options.service?.user.host ?? process.env.SERVICE_USER_HOST,
              port: parseFloat(options.service?.user.port ?? process.env.SERVICE_USER_PORT),
            },
          },
        ]),
        JwtModule.register({
          secret: options.JwtSecretKey ?? process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
      ]
    }
  }
}