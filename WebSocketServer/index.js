var app = require('http').createServer()
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(3000)

let clients = []
let domain_tasks = {}

io.on('connection', function (socket) {
    const client = clients.find(client => client.id === socket.id)

    io.to(socket.id).emit("init", clients);

    if(!client){
        let client = {id: socket.id}
        socket.on('sign', function (data) {
            if(clients.find(client => client.domain_name === data.domain)){
                io.to(client.id).emit("signed", "Domain name already taken");
            } else {
                client.domain_name = data.domain
                client.template = data.template
                clients.push(client);
                io.to(client.id).emit("signed", "Signed with domain name '" + client.domain_name + "'");
            }
        })
    }

    socket.on('disconnect', function(){
        clients = clients.filter(client => client.id !== socket.id);
    });

    socket.on('request.send', function (data) {
        const domain_client = clients.find(client => client.domain_name === data.domain)
        if(domain_client){
            domain_tasks[domain_client.id] = socket.id
            io.to(domain_client.id).emit("request.received", data.parameters);
        } else {
            io.to(socket.id).emit("request.replied", "Domain not found");
        }
    })

    socket.on('request.reply', function (response) {
        if(domain_tasks[socket.id]){
            io.to(domain_tasks[socket.id]).emit('request.replied', response)
        }
    })
})