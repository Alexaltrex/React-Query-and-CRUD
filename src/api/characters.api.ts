import {ICharacter, IGetCharacters, IGetCharactersInfinite, IInfo} from "../types/character.types";
import {instanceRaM} from "./api";

export const charactersApi = {
    getAll: async (page: string): Promise<IGetCharacters> => {
        const response = await instanceRaM.get<IGetCharacters>(`character/?page=${page}`);
        return response.data;
    },
    getInfinite: async ({pageParam = "1"}): Promise<IGetCharactersInfinite> => {
        const response = await instanceRaM.get<IGetCharacters>(`character/?page=${pageParam}`);
        let nextPage = response.data.info.next ? response.data.info.next.split("https://rickandmortyapi.com/api/character/?page=")[1] : response.data.info.next;
        // if (nextPage === "4") {
        //     nextPage = null
        // }
        return {response: response.data.results, nextPage};
    },
    getById: async (id: string): Promise<ICharacter> => {
        const response = await instanceRaM.get<ICharacter>(`character/${id}`);
        return response.data;
    },
    getMultipleItems: async (ids: string[]): Promise<ICharacter[]> => {
        const url = ids.reduce((prev, curr) => prev + String(curr) + ",", "")
        const response = await instanceRaM.get<ICharacter[]>(`character/${url}`);
        return response.data;
    },
    getInfo: async (): Promise<IInfo> => {
        const response = await instanceRaM.get<IGetCharacters>("character");
        return response.data.info
    }
}