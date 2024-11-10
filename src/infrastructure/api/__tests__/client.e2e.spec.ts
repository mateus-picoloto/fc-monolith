import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe("E2E test for client", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should post a client without id", async () => {
    const name = "John Doe";
    const email = "test@test.com";
    const document = "111.111.111-1";
    const street = "Rua test";
    const number = "123";
    const complement = "complement";
    const city = "city";
    const state = "state";
    const zipCode = "11111-111";
    const res = await request(app).post("/clients").send({
      name,
      email,
      document,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    });
    expect(res.statusCode).toBe(200);
  });

  it("should post a client with id", async () => {
    const id = "29d2fb13-dd93-4248-8a2a-74b17c7143a7";
    const name = "John Doe";
    const email = "test@test.com";
    const document = "111.111.111-1";
    const street = "Rua test";
    const number = "123";
    const complement = "complement";
    const city = "city";
    const state = "state";
    const zipCode = "11111-111";
    const res = await request(app)
      .post("/clients")
      .send({
        id,
        name,
        email,
        document,
        street,
        number,
        complement,
        city,
        state,
        zipCode,
      });
    expect(res.statusCode).toBe(200);
  });
});
