import StoreCatalogFacade from "../facade/store-catalog.facade";
import StoreCatalogFacadeInterface from "../facade/store-catalog.facade.interface";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";

export default class StoreCatalogFacadeFactory {
    static create(): StoreCatalogFacade {
        const productRepository = new ProductRepository();

        const findUseCase = new FindProductUseCase(productRepository);
        const findAllUseCase = new FindAllProductsUseCase(productRepository);

        return new StoreCatalogFacade({
            findUseCase,
            findAllUseCase,
        });
    }
}