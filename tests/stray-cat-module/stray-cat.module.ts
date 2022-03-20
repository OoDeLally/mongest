import { Module } from '@nestjs/common';
import { catMongooseModule } from '../cat-module/cat-mongoose.module';
import { StrayCatsNestService } from './stray-cat.service';

@Module({
  imports: [catMongooseModule],
  providers: [StrayCatsNestService],
})
export class StrayCatModule {}
