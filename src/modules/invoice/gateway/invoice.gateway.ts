import Invoice from "../domain/invoice.entity";

export default interface InvoiceGateway {
    add(product: Invoice): Promise<void>;
    find(id: string): Promise<Invoice>;
}
