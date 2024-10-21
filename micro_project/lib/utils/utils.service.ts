import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Timestamp } from '@proto/google/protobuf/timestamp.pb';

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

  public static dateToTimestamp(date: Date): Timestamp {
    // Create an object that conforms to the Timestamp interface
    const timestamp: Timestamp = {
      seconds: Math.floor(date.getTime() / 1000), // Get seconds from epoch
      nanos: (date.getTime() % 1000) * 1000000, // Get nanoseconds
    };
    return timestamp;
  }

  public static timestampToDate(timestamp: Timestamp): Date {
    // Calculate total milliseconds from seconds and nanoseconds
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanos / 1000000;

    // Create a new Date object using the milliseconds
    return new Date(milliseconds);
  }
}
