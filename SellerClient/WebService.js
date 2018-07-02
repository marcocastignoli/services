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
                if(this.routes && typeof this.routes[data.action] === "function"){
                    this.routes[data.action](data.arguments, (response) => {
                        socket.emit('request.reply', response);
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