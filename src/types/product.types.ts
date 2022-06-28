export interface IProduct {
    id: string
    name: string
    size: number
    weight: number
    description: string
}

export type ProductUpdateType = Omit<IProduct, "id">