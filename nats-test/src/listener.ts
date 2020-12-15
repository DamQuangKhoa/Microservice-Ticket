import { randomBytes } from 'crypto';
import nats, {Message, Stan} from 'node-nats-streaming'
console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})


stan.on('connect', () => {
    console.log('Listener connnected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
        
    })

    const options = stan
                    .subscriptionOptions()
                    .setManualAckMode(true)
    const subscription = stan.subscribe(
        'ticket:created', 
        'orders-service-queue-group');

    subscription.on('message', (msg: Message) => {
        console.log('Message received');

        const data = msg.getData();
        if(typeof data === 'string'){
            console.log(` Received event #${msg.getSequence()} with data: ${data}`);
            
        }

        msg.ack();
        
    })
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;
    private client: Stan;
    private actWait: number = 5 * 1000;

    constructor(client: Stan){
        this.client = client;
    }

    subscriptionOptions(){
        return this.client
                    .subscriptionOptions()
                    .setDeliverAllAvailable()
                    .setManualAckMode(true)
                    .setAckWait(this.actWait)
                    .setDurableName(this.queueGroupName);
    }

    listen(){
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName} `);
            const parsedData = this.parseMesssage(msg)

            this.onMessage(parsedData, msg);
        });

    }

    parseMesssage(msg: Message){
        const data = msg.getData();
        return typeof data === 'string'? JSON.parse(data): JSON.parse(data.toString('utf-8'))
    }
}

class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payment-service';

    onMessage(data: any, msg: Message){
        console.log('Event DATA!', data);
        
        msg.ack();
    }

}