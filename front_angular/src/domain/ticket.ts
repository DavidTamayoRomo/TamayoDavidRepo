
export interface Ticket {
    id?:string;
    category:string;
    status:string;
    priority:string;
    title:string;
    description:string;
    createdAt?: Date;
    updatedAt?:Date;
}