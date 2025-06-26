import { RankEntity } from "@/domain/model/RankEntity";
import { RowDataPacket } from "mysql2";

export interface RankDataModel extends RowDataPacket {
    search_query: Buffer | string;
    place_id: number;
    rank_position: number;
    created_at: string | Date;
}

export function toRankEntity(dataModel: RankDataModel): RankEntity {
    return {
        search_query: Buffer.isBuffer(dataModel.search_query)
            ? dataModel.search_query.toString('utf8')
            : dataModel.search_query,
        place_id: dataModel.place_id,
        rank_position: dataModel.rank_position,
        created_at: new Date(dataModel.created_at),
    };
}

export function toRankEntityList(dataModels: RankDataModel[]): RankEntity[] {
    return dataModels.map(toRankEntity);
}