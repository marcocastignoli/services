import VueRouter from 'vue-router'
import Home from './pages/Home'

export default new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/:msg', component: Home, props: true }
    ]
})