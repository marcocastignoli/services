import VueRouter from 'vue-router'
import Home from './pages/Home'
import AppPage from './pages/AppPage'

export default new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/:domain_name', component: AppPage, props: true }
    ]
})