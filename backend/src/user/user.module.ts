import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Database } from 'src/enums/database.enum';
import { UserSchema } from 'src/shared/models/user.model';
import { EndPoints } from 'src/enums/endPoints.enum';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Database.user, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: `${EndPoints.user}*`, method: RequestMethod.ALL });
  }
}
