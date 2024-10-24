import InvoiceFacade from "../facade/invoice.facade";
import InvoiceFacadeInterface from "../facade/invoice.facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default abstract class InvoiceFacadeFactory {
    static create(): InvoiceFacadeInterface {
        const repository = new InvoiceRepository();
        const findUseCase = new FindInvoiceUseCase(repository);
        const generateUseCase = new GenerateInvoiceUseCase(repository);

        return new InvoiceFacade({
            findUseCase,
            generateUseCase
        });
    }
}