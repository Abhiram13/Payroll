import { MONGO } from "../../index";
import {IMongo, StatusCode, IProjectFields, ObjectId, Collection, Filter, UpdateFilter, Document, OptionalUnlessRequiredId} from "../types/export.types";

export default class Controller<T extends Document> {
   body: T;
   aggregate?: Document[];
   #collection: Collection<T>;

   constructor(collectionName: string) {
      this.body = {} as T;
      this.aggregate = [];
      this.#collection = MONGO.db().collection<T>(collectionName);
   }

   async insert(): Promise<StatusCode.BAD_REQUEST | StatusCode.OK | StatusCode.NOT_MODIFIED> {
      try {         
         const document = this.#collection.insertOne(this.body as OptionalUnlessRequiredId<T>);
         const { acknowledged } = await document;
         const status: StatusCode = acknowledged ? StatusCode?.OK : StatusCode?.NOT_MODIFIED

         return status;
      } catch(e) {
         return StatusCode?.BAD_REQUEST;
      }
   };

   async update(filter: Filter<Document> = {}, set: UpdateFilter<T>): Promise<StatusCode> {     
      const document = this.#collection.updateOne(filter, set)
      const { acknowledged } = await document;
      const status: StatusCode = acknowledged ? StatusCode?.OK : StatusCode?.NOT_MODIFIED

      return status;
   };

   async list(): Promise<T[]> {
      const data = await this.#collection.aggregate<T>(this.aggregate).toArray();

      return data;
   };

   async find(filter: Filter<T>): Promise<T[]> {
      const data = await this.#collection?.find(filter)?.toArray();

      return data as T[];
   }

   async findById(id: string, includeFields: Partial<IProjectFields<T & IMongo>> = {}, excludeFields: Partial<IProjectFields<T & IMongo>> = {}): Promise<T | null> {
      try {
         const aggregate: Document[] = [
            { $match: { _id: new ObjectId(id) } }
         ];

         Object.keys(includeFields)?.length && aggregate.push({ $project: includeFields });
         Object.keys(excludeFields)?.length && aggregate.push({ $project: excludeFields });

         const data = await this.#collection.aggregate<T>(aggregate).toArray();

         return data?.length ? data[0] : null;
      } catch (e) {
         return null;
      }
   };
}