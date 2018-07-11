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
                    this.routes[message.action](message.arguments, (response) => {
                        let response_object = {
                            data: response,
                            task_id: message.task_id
                        }
                        socket.emit('request.reply', response_object);
                    })
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