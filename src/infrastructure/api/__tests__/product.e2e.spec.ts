import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";

describe("E2E test for product", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ProductModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });


  it("should post a product without id", async () => {
    const name = "Product";
    const description = "Product description";
    const purchasePrice = 5.0;
    const salesPrice = 10.0;
    const stock = 5;
    const res = await request(app)
      .post("/products")
      .send({ name, description, purchasePrice, salesPrice, stock });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      name,
      description,
      purchasePrice,
      salesPrice,
      stock,
    });
    expect(res.body).toHaveProperty("id");
  });

  it("should post a product with id", async () => {
    const id = "19794048-c726-4e67-a3d8-37465b1efee9";
    const name = "Product";
    const description = "Product description";
    const purchasePrice = 5.0;
    const salesPrice = 10.0;
    const stock = 5;
    const res = await request(app)
      .post("/products")
      .send({ id, name, description, purchasePrice, salesPrice, stock });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id,
      name,
      description,
      purchasePrice,
      salesPrice,
      stock,
    });
  });
});
