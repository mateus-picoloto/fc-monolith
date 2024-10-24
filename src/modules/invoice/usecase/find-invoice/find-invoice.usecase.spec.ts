import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "John Doe",
    document: "123456",
    address: new Address({
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "123456",
    }),
    items: [new InvoiceItems({
        id: new Id("123"),
        name: "Item 1",
        price: 10
    })]
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockResolvedValue(invoice),
    }
}

describe("Find invoice use case unit test", () => {
    it("should find and invoice", async () => {
        const repository = MockRepository();
        const useCase = new FindInvoiceUseCase(repository);

        const foundedInvoice = await useCase.execute({
            id: "1"
        });

        expect(foundedInvoice.id).toBe(invoice.id.id);
        expect(foundedInvoice.name).toBe(invoice.name);
        expect(foundedInvoice.document).toBe(invoice.document);
        expect(foundedInvoice.address.street).toBe(invoice.address.street);
        expect(foundedInvoice.address.number).toBe(invoice.address.number);
        expect(foundedInvoice.address.complement).toBe(invoice.address.complement);
        expect(foundedInvoice.address.city).toBe(invoice.address.city);
        expect(foundedInvoice.address.state).toBe(invoice.address.state);
        expect(foundedInvoice.address.zipCode).toBe(invoice.address.zipCode);
        expect(foundedInvoice.items.length).toBe(1);
        expect(foundedInvoice.items[0].id).toBe(invoice.items[0].id.id);
        expect(foundedInvoice.items[0].name).toBe(invoice.items[0].name);
        expect(foundedInvoice.items[0].price).toBe(invoice.items[0].price);
        expect(foundedInvoice.total).toEqual(invoice.total);
        expect(foundedInvoice.createdAt).toEqual(invoice.createdAt);
    });
});