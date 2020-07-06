const { io } = require('../server');
const { TicketControl } = require('../classes/ticket');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.on('nuevoTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();

        console.log(siguiente);
        callback(siguiente);
    });

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                error: true,
                mensaje: 'El escritorio en necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
    });

});