import { Publisher, Subjects, TicketUpdatedEvent } from "@tedvntickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
