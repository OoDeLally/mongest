import { Module } from '@nestjs/common';
import { catMongooseModule } from './cat-mongoose.module';
import { CatsNestService } from './cat.service';

@Module({
  imports: [catMongooseModule],
  providers: [CatsNestService],
})
export class CatModule {}
