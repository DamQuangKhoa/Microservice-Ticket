import nats from 'node-nats-streaming'
import {Publisher} from './events/base-publisher';
import {Subjects} from './events/subjects';
import {TicketCreatedEvent} from "./events/ticket-created-event";

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
     console.log('Publisher connnected to NATS');

     const publisher = new TicketCreatedPublisher(stan);
     try {
         await publisher.publish({
             id: '123',
             title: 'concert',
             price: 20
         })
     }
     catch (e) {
         console.log(e)
     }


})
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}
