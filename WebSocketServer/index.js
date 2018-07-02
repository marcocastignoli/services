var app = require('http').createServer()
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(3000)

let clients = []
let domain_tasks = {}
let cluster = []
let task_queue = []

io.on('connection', function (socket) {
    const client = clients.find(client => client.id === socket.id)

    io.to(socket.id).emit("init", clients);

    if(!client){
        let client = {id: socket.id}
        socket.on('sign', function (data) {
            const client_domain = clients.find(client => (client.domain_name === data.domain))
            if(client_domain){
                if(client_domain.password === data.password) {
                    client_domain.cluster.push(socket.id)
                    cluster[socket.id] = client_domain.domain_name
                    io.to(client.id).emit("signed", "Domain expanded");
                } else {
                    io.to(client.id).emit("signed", "Domain name already taken");
                }
            } else {
                client.domain_name = data.domain
                client.password = data.password
                client.template = data.template
                client.cluster = [client.id]
                clients.push(client);
                cluster[client.id] = client.domain_name
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
            for (let id of domain_client.cluster) {
                if(!(id in domain_tasks)){
                    domain_tasks[id] = socket.id
                    io.to(id).emit("request.received", data.parameters)
                    return
                }
            }
            task_queue.push({domain: domain_client.domain_name, message: data, destination: socket.id})
        } else {
            io.to(socket.id).emit("request.replied", "Domain not found");
        }
    })

    socket.on('request.reply', function (response) {
        if(domain_tasks[socket.id]){
            io.to(domain_tasks[socket.id]).emit('request.replied', response)
            delete domain_tasks[socket.id]
            const domain_ref = cluster[socket.id]
            let task_index_to_delete = null
            const new_task = task_queue.find((task,index) => {
                if(task && task.domain === domain_ref){
                    task_index_to_delete = index
                    return true
                } else {
                    return false
                }
            })
            if(new_task){
                domain_tasks[socket.id] = new_task.destination
                io.to(socket.id).emit("request.received", new_task.message.parameters)
                delete task_queue[task_index_to_delete]
            }
        }
    })
})