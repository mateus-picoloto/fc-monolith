import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { default as ClientModelCheckout } from "../../../modules/checkout/gateway/client.model";
import OrderModel from "../../../modules/checkout/gateway/order.model";
import { default as ProductModelCheckout } from "../../../modules/checkout/gateway/product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { default as ProductModelCatalog } from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { InvoiceProductModel } from "../../../modules/invoice/repository/invoice-product.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([
      ClientModelCheckout,
      ProductModelCheckout,
      OrderModel,
      ClientModel,
      ProductModel,
      ProductModelCatalog,
      InvoiceProductModel,
      InvoiceModel,
      TransactionModel,
    ]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should place an order", async () => {
    const client = {
      id: "2efd5dd5-46b6-42c5-9e34-3bc6632edd2e",
      name: "Cliente 1",
      email: "teste@teste.com",
      document: "12345678900",
      street: "Rua",
      number: "1",
      complement: "complement",
      city: "City",
      state: "RS",
      zipcode: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ClientModel.create(client);

    const products: any[] = [
      {
        id: "60084cf6-7e47-4ccf-bf8f-3114583305c3",
        name: "Product1",
        description: "Product1 description",
        purchasePrice: 11.0,
        salesPrice: 11.0,
        stock: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "e0ee51da-8657-4fc8-b71d-4fb411476915",
        name: "Product2",
        description: "Product2 description",
        purchasePrice: 43.0,
        salesPrice: 44.8,
        stock: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await ProductModel.bulkCreate(products);

    const total = products.reduce((acc, item) => acc + item.salesPrice, 0);

    const res = await request(app)
      .post("/checkout")
      .send({
        clientId: client.id,
        products: products.map((product) => product.id),
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("invoiceId");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("products");
    expect(res.body.total).toBe(total);
    expect(res.body.products).toHaveLength(products.length);
  });
});
