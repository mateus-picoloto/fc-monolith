import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceProductModel } from "../../../modules/invoice/repository/invoice-product.model";

describe("E2E test for invoice", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel, InvoiceModel, InvoiceProductModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should get an invoice with the given id", async () => {
    const products: any[] = [
      {
        id: "bd261e7f-9c73-4536-a826-9052548907a6",
        invoice_id: "f0bbd82d-6079-493a-814f-6952641dafca",
        name: "Product1",
        price: 10.0
      },
      {
        id: "0f0fe63b-b97c-4f8f-bfe2-6012dd5403e2",
        invoice_id: "f0bbd82d-6079-493a-814f-6952641dafca",
        name: "Product2",
        price: 15.8
      },
      {
        id: "3c35422e-cac0-47ed-9c45-c3951bbaa13d",
        invoice_id: "f0bbd82d-6079-493a-814f-6952641dafca",
        name: "Product3",
        price: 14.0
      },
    ];

    const total = products.reduce((acc, item) => acc + item.price, 0);

    const invoice = {
      id: "f0bbd82d-6079-493a-814f-6952641dafca",
      name: "Cliente 1",
      document: "12345678900",
      street: "Rua",
      number: "1",
      complement: "Ap 2",
      city: "city",
      state: "ST",
      zipCode: "00000000",
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await InvoiceModel.create(invoice);
    await InvoiceProductModel.bulkCreate(products);

    const res = await request(app).get(`/invoice/${invoice.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(invoice.id);
    expect(res.body.name).toBe(invoice.name);
    expect(res.body.document).toBe(invoice.document);
    expect(res.body.address).toMatchObject({
      street: invoice.street,
      number: invoice.number,
      complement: invoice.complement,
      city: invoice.city,
      state: invoice.state,
      zipCode: invoice.zipCode,
    });
    expect(res.body.items).toHaveLength(products.length);
    expect(res.body.total).toBe(total);
  });
});
