import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(product: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: product.id.id,
            name: product.name,
            document: product.document,
            street: product.address.street,
            number: product.address.number,
            complement: product.address.complement,
            city: product.address.city,
            state: product.address.state,
            zipCode: product.address.zipCode,
            items: product.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            include: [{model: InvoiceItemsModel}]
        })
    }
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: {id},
            include: [{model: InvoiceItemsModel}]
        });

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode,
            }),
            items: invoice.items.map((item) => new InvoiceItems({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }

}