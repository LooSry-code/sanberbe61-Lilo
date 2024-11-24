import mongoose from "mongoose";
import ProductModel, { Product } from "../../models/products.model";
import { create, findAll, findOne, remove, update } from "../product.service";

// Melakukan Mock pada package product.model
jest.mock("../../models/products.model");

const mockProductModel = ProductModel as unknown as jest.Mocked<typeof ProductModel>; 

afterEach(() => {
  mockProductModel.find.mockClear();
  mockProductModel.create.mockClear();
  mockProductModel.findById.mockClear();
  mockProductModel.findOneAndUpdate.mockClear();
  mockProductModel.findOneAndDelete.mockClear();
});

describe("product-service.test.ts", () => {
  test('sample', () => {
    expect(true).toBeTruthy();
  });

  test("create", async () => {
    const mockProduct: Product = {
      _id: new mongoose.Types.ObjectId(),
      name: "Product 1",
      price: 100,
      description: "Product 1 description",
      categoryId: new mongoose.Types.ObjectId(),
      qty: 10,
      createdAt: new Date().toString(),
      images: ["prod1.jpg", "prod2.jpg", "prod3.jpg"],
      updatedAt: new Date().toString(),
    };

    const mockCreate = jest.fn().mockResolvedValue(mockProduct);
    mockProductModel.create.mockImplementation(mockCreate);

    const product = await create(mockProduct);
    expect(product?._id).toBe(mockProduct._id);
  });

  test("findAll", async () => {
    const mockProducts: Product[] = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Product 1",
        price: 100,
        description: "Product 1 description",
        categoryId: new mongoose.Types.ObjectId(),
        qty: 10,
        createdAt: new Date().toString(),
        images: ["prod1.jpg", "prod2.jpg", "prod3.jpg"],
        updatedAt: new Date().toString(),
      },
    ];

    const mockFind = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockProducts),
    });

    mockProductModel.find.mockImplementation(mockFind);

    const allProducts = await findAll({});
    expect(allProducts.length).toBe(1);
  });

  test("findOne", async () => {
    const mockProduct: Product = {
      _id: new mongoose.Types.ObjectId(),
      name: "Product 1",
      price: 100,
      description: "Product 1 description",
      categoryId: new mongoose.Types.ObjectId(),
      qty: 10,
      createdAt: new Date().toString(),
      images: ["prod1.jpg", "prod2.jpg", "prod3.jpg"],
      updatedAt: new Date().toString(),
    };

    const mockFindById = jest.fn().mockResolvedValue(mockProduct);
    mockProductModel.findById.mockImplementation(mockFindById);

    const product = await findOne("product-id");
    expect(product?.name).toBe(mockProduct.name);
  });

  test("update", async () => {
    const mockId = new mongoose.Types.ObjectId();
    const mockProduct: Product = {
      name: "Product 1",
      price: 100,
      description: "Product 1 description",
      categoryId: new mongoose.Types.ObjectId(),
      qty: 10,
      createdAt: new Date().toString(),
      images: ["prod1.jpg", "prod2.jpg", "prod3.jpg"],
      updatedAt: new Date().toString(),
    };

    const mockFindOneAndUpdate = jest.fn().mockResolvedValue(mockProduct);
    mockProductModel.findOneAndUpdate.mockImplementation(mockFindOneAndUpdate);

    const product = await update(mockId.toString(), mockProduct);
    expect(product?.name).toBe(mockProduct.name);
  });

  test("remove", async () => {
    const mockId = new mongoose.Types.ObjectId();
    const mockFindOneAndDelete = jest.fn().mockResolvedValue({});
    mockProductModel.findOneAndDelete.mockImplementation(mockFindOneAndDelete);

    const product = await remove(mockId.toString());
    expect(product).toEqual({});
  });
});
