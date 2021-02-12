import { PaymentCreatedEvent, Publisher, Subjects } from "@tedvntickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}