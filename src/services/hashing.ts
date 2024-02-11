import * as Hash from 'crypto';

export class Hashing {
   static #BYTES: Buffer = Hash.randomBytes(12);

   static encrypt<T>(payload: T): string {
      const stringify = JSON.stringify(payload);
      const algorithm = 'aes-256-gcm';
      const message = stringify;
      const iv = this.#BYTES;
      const sKey = process.env.SECRET_KEY as string;
      const cipher = Hash.createCipheriv(algorithm, sKey, iv);

      let encryptedData: string = cipher.update(message, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');

      const authTag: string = cipher.getAuthTag().toString("hex");
      return `${authTag}:${encryptedData}:${this.#BYTES.toString('base64')}`;
   }

   static decrypt<D>(payload: string): D {
      const [authTag, encryptedData, bytes]: string[] = payload?.split(':');
      const decipher = Hash.createDecipheriv('aes-256-gcm', process.env.SECRET_KEY as string, Buffer.from(bytes, 'base64'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decData = decipher.update(encryptedData, 'hex', 'utf-8');
      decData += decipher.final('utf-8');

      const data: D = JSON.parse(decData);
      return data;
   }
}