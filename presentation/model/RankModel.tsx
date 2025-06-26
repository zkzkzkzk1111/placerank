import { RankEntity } from '../../domain/model/RankEntity';

export interface RankModel {
    search_query: string;
    place_id: number;
    rank_position: number;
    createdDate: string;
}

export function fromRankEntity(entity: RankEntity): RankModel {
    return {
        search_query: entity.search_query,
        place_id: entity.place_id,
        rank_position: entity.rank_position,
        createdDate: entity.created_at
            ? new Date(entity.created_at).toLocaleDateString('ko-KR')
            : '날짜 정보 없음',
    };
}

export function fromRankEntityList(entities: RankEntity[]): RankModel[] {
    return entities.map(fromRankEntity);
}