var app = require('http').createServer()
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(3000)

let clients = []
let domain_tasks = []
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
                var this_domain_task = domain_tasks.filter(domain_task => (domain_task.domain_id === id && !domain_task.async))
                if(!this_domain_task.length){
                    let task_id = Date.now()
                    domain_tasks.push({task_id: task_id, domain_id: id, client_id: socket.id})
                    data.task_id = task_id
                    io.to(id).emit("request.received", data)
                    return
                }
            }
            task_queue.push({domain: domain_client.domain_name, data: data, destination: socket.id})
        } else {
            io.to(socket.id).emit("request.replied", "Domain not found");
        }
    })

    socket.on('request.reply', function (response) {
        console.log(response)
        const domain_task = domain_tasks.find(domain_task => domain_task.task_id === response.task_id)
        if(domain_task){
            io.to(domain_task.client_id).emit('request.replied', response)
            if(!response.buffer){
                // delete the task just done
                domain_tasks = domain_tasks.filter(domain_task_to_delete => domain_task_to_delete.task_id !== domain_task.task_id);
                // Check inside the queue if there is a pending task
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
                    let task_id = Date.now()
                    domain_tasks.push({taks_id: task_id, domain_id: socket.id, client_id: new_task.destination })
                    new_task.data.task_id = task_id
                    io.to(socket.id).emit("request.received", new_task.data)
                    delete task_queue[task_index_to_delete]
                }
            } else {
                domain_task.async = true
            }
        }
    })
})