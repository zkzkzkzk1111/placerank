import { RankEntity } from '../model/RankEntity';

export interface RankRepository {
  fetchDocs(): Promise<RankEntity[]>;
}