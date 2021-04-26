import * as argon from "argon2";

export class PassEncryptService {
  private readonly config: ArgonConfig = {
    type: argon.argon2id,
    timeCost: 20,
    parallelism: 2,
    memoryCost: 2 ** 14,
  };

  async hash(password: string): Promise<string> {
    const hash = await argon.hash(password, this.config);
    return hash;
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return await argon.verify(hash, password, this.config);
  }
}

// Types
type ArgonConfig = argon.Options & { raw?: false | undefined };
