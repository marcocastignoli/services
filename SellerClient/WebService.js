class WSReply {
    constructor(emit, task_id){
        this.emit = emit
        this.task_id = task_id
    }
    reply(response, options) {
        let response_object = {
            data: response,
            task_id: this.task_id,
            buffer: options.buffer | false
        }
        this.emit('request.reply', response_object);
    }
}
class WebService {
    constructor(WebSocketService, template, routes, init) {
        if (WebSocketService && typeof WebSocketService.on === "function"  && typeof WebSocketService.emit === "function") {
            this.on = WebSocketService.on
            this.emit = WebSocketService.emit
            this.on('init', (data) => {
                init(data)
            });
        }
        if (template) {
            this.template = template
        }
        if (routes) {
            this.routes = routes
        }
    }
    sign(domain, password) {
        if (!domain || !password || !this.template) {
            return false;
        }
        this.domain = domain
        this.on('signed', (msg) => {
            console.log(msg)
            this.on('request.received', (data) => {
                let message = data.parameters
                if(this.routes && typeof this.routes[message.action] === "function"){
                    let wsReply = new WSReply(this.emit, data.task_id)
                    this.routes[message.action](message.arguments, wsReply)
                }
            });
        })
        this.emit('sign', {
            domain: this.domain,
            password: password,
            template: this.template
        });
    }
}