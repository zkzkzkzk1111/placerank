import { GetRanksUseCase } from '../../domain/usecase/GetRanksUseCase';
import { RankRepositoryImpl } from '../impl/RankRepositoryImpl';

export const rankRepository = RankRepositoryImpl;

export const getRanksUseCase = new GetRanksUseCase(rankRepository);

