import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
}

describe("Generate invoice unit test", () => {
    it("should generate an invoice", async () => {
        const repository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(repository);

        const input = {
            name: "John Doe",
            document: "123456",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "123456",
            items: [{
                id: "123",
                name: "Item 1",
                price: 10
            }]
        };

        const generatedInvoice = await useCase.execute(input);

        expect(generatedInvoice.id).toBeDefined();
        expect(generatedInvoice.name).toBe(input.name);
        expect(generatedInvoice.document).toBe(input.document);
        expect(generatedInvoice.street).toBe(input.street);
        expect(generatedInvoice.number).toBe(input.number);
        expect(generatedInvoice.complement).toBe(input.complement);
        expect(generatedInvoice.city).toBe(input.city);
        expect(generatedInvoice.state).toBe(input.state);
        expect(generatedInvoice.zipCode).toBe(input.zipCode);
        expect(generatedInvoice.items.length).toBe(1);
        expect(generatedInvoice.items[0].id).toBe(input.items[0].id);
        expect(generatedInvoice.items[0].name).toBe(input.items[0].name);
        expect(generatedInvoice.items[0].price).toBe(input.items[0].price);
        expect(generatedInvoice.total).toEqual(10);
    });
})