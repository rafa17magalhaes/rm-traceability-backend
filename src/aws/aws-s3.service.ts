import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION || 
        !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('Faltam variáveis de ambiente para AWS S3.');
    }

    this.bucketName = process.env.AWS_BUCKET_NAME;

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      // Monta a URL pública do objeto
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Erro ao fazer upload para S3:', error);
      throw new InternalServerErrorException('Erro ao fazer upload da imagem');
    }
  }
}
