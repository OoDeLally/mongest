import { Module } from '@nestjs/common';
import { catMongooseModule } from 'tests/cat-module/cat-mongoose.module';
import { HomeCatsNestService } from './home-cat.service';

@Module({
  imports: [catMongooseModule],
  providers: [HomeCatsNestService],
})
export class HomeCatModule {}
