import { s3Client, S3Client } from "../lib/s3Client";

export class MediaService {
  private s3Client: S3Client;
  constructor() {
    this.s3Client = s3Client;
  }

  public async uploadPhoto(
    buffer: string | Buffer,
    mimeType: string
  ): Promise<string | boolean> {
    try {
      const name = `${String(Date.now())}.${mimeType.split("/")[1]}`;
      return await this.s3Client.putObject(name, buffer);
    } catch (e) {
      console.log("Failed to upload Photo");
      return false;
    }
  }
}
