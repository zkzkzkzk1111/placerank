import pool from '@/data/db/dbconfig';
import { RankRepository } from '@/domain/repository/RankRepository';
import { RankEntity } from '@/domain/model/RankEntity';

import { RankDataModel, toRankEntityList } from '../model/RankDataModel';

export const RankRepositoryImpl: RankRepository = {
  async fetchDocs(): Promise<RankEntity[]> {

    const [rows] = await pool.query<RankDataModel[]>('SELECT * FROM rank_results');

    const rankEntities = toRankEntityList(rows);

    return rankEntities;
  },
};