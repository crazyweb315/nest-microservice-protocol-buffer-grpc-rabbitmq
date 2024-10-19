import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

type ClassWithColumns<T> = {
  new (): T;
  columns(): string[];
};

@Injectable()
export class UtilsService {
  public generatePassword(): string {
    return crypto.randomUUID();
  }

  public static extractFieldsToJson<T>(
    type: ClassWithColumns<T>,
    omitFields: (keyof T)[],
  ): { [key: string]: boolean } {
    const fields: { [key: string]: boolean } = {};

    // Call the static columns method to get all field names
    const allFields = type.columns();

    for (const prop of allFields) {
      // Only include properties that are not in the omitFields array
      if (!omitFields.includes(prop as keyof T)) {
        fields[prop] = true;
      }
    }
    return fields;
  }

  public static omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  }
}
