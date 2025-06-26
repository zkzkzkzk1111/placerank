import { RankEntity } from '../model/RankEntity';
import { RankRepository } from '../repository/RankRepository';

export class GetRanksUseCase {
  constructor(private rankRepository: RankRepository) {}

  async execute(): Promise<RankEntity[]> {
    return await this.rankRepository.fetchDocs();
  }
}