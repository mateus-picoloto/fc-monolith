import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address";
import InvoiceItems from "../domain/invoice-items.entity";
import InvoiceRepository from "./invoice.repository";

describe("Invoice repository test", () => {
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

    it("should create an invoice", async () => {
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

        const repository = new InvoiceRepository();

        await repository.add(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [{ model: InvoiceItemsModel }]
        });

        expect(invoice.id.id).toBe(invoiceDb.id);
        expect(invoice.name).toBe(invoiceDb.name);
        expect(invoice.document).toBe(invoiceDb.document);
        expect(invoice.address.street).toBe(invoiceDb.street);
        expect(invoice.address.number).toBe(invoiceDb.number);
        expect(invoice.address.complement).toBe(invoiceDb.complement);
        expect(invoice.address.city).toBe(invoiceDb.city);
        expect(invoice.address.state).toBe(invoiceDb.state);
        expect(invoice.address.zipCode).toBe(invoiceDb.zipCode);
        expect(invoice.items.length).toBe(1);
        expect(invoice.items[0].id.id).toBe(invoiceDb.items[0].id);
        expect(invoice.items[0].name).toBe(invoiceDb.items[0].name);
        expect(invoice.items[0].price).toBe(invoiceDb.items[0].price);
    });

    it("should find an invoice", async () => {
        const date = new Date();
        await InvoiceModel.create({
            id: "1",
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
            }],
            createdAt: date,
            updatedAt: date,
        }, { include: [{ model: InvoiceItemsModel }] });

        const repository = new InvoiceRepository();

        const foundedInvoice = await repository.find("1");

        expect(foundedInvoice.id.id).toBe("1");
        expect(foundedInvoice.name).toBe("John Doe");
        expect(foundedInvoice.document).toBe("123456");
        expect(foundedInvoice.address.street).toBe("Street 1");
        expect(foundedInvoice.address.number).toBe("123");
        expect(foundedInvoice.address.complement).toBe("Complement 1");
        expect(foundedInvoice.address.city).toBe("City 1");
        expect(foundedInvoice.address.state).toBe("State 1");
        expect(foundedInvoice.address.zipCode).toBe("123456");
        expect(foundedInvoice.items.length).toBe(1);
        expect(foundedInvoice.items[0].id.id).toBe("123");
        expect(foundedInvoice.items[0].name).toBe("Item 1");
        expect(foundedInvoice.items[0].price).toBe(10);
        expect(foundedInvoice.createdAt).toEqual(date);
        expect(foundedInvoice.updatedAt).toEqual(date);
    });
})