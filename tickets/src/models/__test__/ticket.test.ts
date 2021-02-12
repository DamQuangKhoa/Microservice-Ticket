import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async (done) => {
    // Create the instance of a ticket 
    const ticket = Ticket.build({
        title: 'abc',
        price: 5,
        userId: 'abc'
    });

    // Save the ticket to database
    await ticket.save();
    // fetch the ticket twice 
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({price: 1});
    secondInstance!.set({price: 2});

    // save the first fetched ticket 
    await firstInstance?.save();

    // save the second fetched ticket and expect an error 
    // expect (async () => {
    //     await secondInstance?.save();
    // }).toThrow();

    try {
        await secondInstance?.save();
    } catch (error) {
        return done(); 
    }

    throw new Error(' Should not reach this point')
})

it('increments the version number on multiple save', async () => {
    const ticket = Ticket.build({
        title: 'abc',
        price: 15,
        userId: 'abc'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
} )