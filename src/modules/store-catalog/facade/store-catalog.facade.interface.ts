import { StringLocale } from "yup/lib/locale";

export interface FindStoreCatalogFacadeInputDto {
    id: string
}

export interface FindStorageCatalogFacadeOutputDto {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}

export interface FindAllStorageCatalogFacadeOutputDto {
    products: {
        id: string;
        name: string;
        description: string;
        salesPrice: number;
    }[];
}

export default interface StoreCatalogFacadeInterface {
    find(input: FindStoreCatalogFacadeInputDto): Promise<FindStorageCatalogFacadeOutputDto>;
    findAll(): Promise<FindAllStorageCatalogFacadeOutputDto>;
}