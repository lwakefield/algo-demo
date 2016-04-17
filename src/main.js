import Vue from 'vue'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'
import Viewer from './Viewer.vue'
import Watcher from './Watcher.vue'

Vue.use(VueFire);
Vue.use(VueRouter);

require('!style!css!bootstrap/dist/css/bootstrap.css');

let App = Vue.extend({});
let router = new VueRouter();
router.map({
    '/': {
        component: require('./App.vue')
    },
    '/viewer': {
        component: Viewer
    },
    '/watcher/:uid': {
        component: Watcher
    }
});
router.start(App, '#app');
