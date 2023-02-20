import AWS from "aws-sdk";
import { configs } from "../../../configs";

const signedUrlExpireSeconds = 60 * 60 * 8;

export class S3Client {
  private static instance: S3Client;
  private s3: AWS.S3;
  private readonly bucket: string;

  private constructor() {
    this.s3 = new AWS.S3(configs.awsConfigs.options);
    this.bucket = configs.awsConfigs.bucket;
  }

  public static getInstance(): S3Client {
    if (!S3Client.instance) {
      S3Client.instance = new S3Client();
    }

    return S3Client.instance;
  }

  public async getSignedUrl(key: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    };
    return this.s3.getSignedUrlPromise("getObject", params);
  }

  public async putObject(
    fileName: string,
    buffer: Buffer | string
  ): Promise<string> {
    try {
      const key = `pictures/${fileName}`;
      const params = {
        ACL: "public-read",
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
      };
      await this.s3.putObject(params).promise();
      return this.getPublicUrl(key);
    } catch (error) {
      console.error("Failed to put object", error);
      throw error;
    }
  }

  private getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}

export const s3Client = S3Client.getInstance();
