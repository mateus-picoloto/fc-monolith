import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

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

        const generatedInvoice = await facade.generate(input);

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

    it("should find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

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

        const generatedInvoice = await facade.generate(input);

        const foundedInvoice = await facade.find({
            id: generatedInvoice.id
        });

        expect(foundedInvoice.id).toBeDefined();
        expect(foundedInvoice.name).toBe(input.name);
        expect(foundedInvoice.document).toBe(input.document);
        expect(foundedInvoice.address.street).toBe(input.street);
        expect(foundedInvoice.address.number).toBe(input.number);
        expect(foundedInvoice.address.complement).toBe(input.complement);
        expect(foundedInvoice.address.city).toBe(input.city);
        expect(foundedInvoice.address.state).toBe(input.state);
        expect(foundedInvoice.address.zipCode).toBe(input.zipCode);
        expect(foundedInvoice.items.length).toBe(1);
        expect(foundedInvoice.items[0].id).toBe(input.items[0].id);
        expect(foundedInvoice.items[0].name).toBe(input.items[0].name);
        expect(foundedInvoice.items[0].price).toBe(input.items[0].price);
        expect(foundedInvoice.total).toEqual(10);
        expect(foundedInvoice.createdAt).toBeDefined();
    });
})