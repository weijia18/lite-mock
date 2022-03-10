import { VueConstructor } from 'vue/types/vue';
import Vue from 'vue'
import MockCenter from './mockCenter'
import { RawLocation } from 'vue-router';

let _Vue: VueConstructor
let _installed = false

export const install = (Vue: VueConstructor) => {
    if (_installed && _Vue === Vue) return
    const mockCenter = new MockCenter()
    Vue.prototype.$mockCenter = mockCenter
    Vue.mixin({
        beforeRouteLeave(to, from, next) {
            next((vm: Vue) => {
                vm.$mockCenter.unRegisterAll()
            })
        }
    })
    _installed = true
    _Vue = Vue
}