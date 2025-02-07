import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { Image } from './entities/image.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly categoryService: CategoriesService,
    private readonly productRepository: ProductRepository,
  ) {}
  async createProduct(
    createProductDTO: CreateProductDTO,
    files: Express.Multer.File[],
  ) {
    const category = await this.categoryService.getOneCategoryById(
      createProductDTO.category,
    );
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const uploadedFiles = await this.uploadImages(files);

    const product = this.productRepository.createProduct(
      createProductDTO,
      category,
      uploadedFiles,
    );

    return product;
  }

  async uploadImages(files: Express.Multer.File[]): Promise<Image[]> {
    const uploadedFiles: Image[] = [];
    for (const file of files) {
      const uploaded = await this.uploadImage(file);
      const image = new Image();
      image.publicId = uploaded.public_id;
      image.url = uploaded.url;
      image.secureUrl = uploaded.secure_url;
      image.width = uploaded.width;
      image.height = uploaded.height;
      image.size = uploaded.bytes;
      image.format = uploaded.format;
      image.altText = file.originalname;
      uploadedFiles.push(image);
    }
    return uploadedFiles;
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      return await this.cloudinaryService.uploadImage(file);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Upload failed:', error.message);
      throw new InternalServerErrorException('Upload failed');
    }
  }

  async getOneProductById(id: string) {
    const product = await this.productRepository.findOneProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  async deleteProductById(id: string) {
    const product = await this.getOneProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return this.productRepository.deleteProductById(product);
  }

  async updateStock(id: string, quantity: number) {
    const stock = await this.productRepository.findOneStockById(id);
    if (!stock) {
      throw new BadRequestException('Stock not found');
    }
    stock.stock -= quantity;
    if (stock.stock < 0) {
      throw new BadRequestException('Stock not enough');
    }
    return this.productRepository.updateStock(stock);
  }
}
