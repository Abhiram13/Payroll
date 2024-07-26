export class PayloadError extends Error {
    public name: string = "PayloadError";    
}

export class MongoError extends Error {
    public name: string = "MongoError";
}