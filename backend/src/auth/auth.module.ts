import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../shared/models/user.model';
import { Database } from 'src/enums/database.enum';
import { EndPoints } from 'src/enums/endPoints.enum';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Database.user, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: `${EndPoints.auth}/${EndPoints.autoLogin}/`,
      method: RequestMethod.ALL,
    });
  }
}
