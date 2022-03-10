import MockCenter from '../lib/mockCenter'

declare module 'vue/types/vue' {
    interface Vue {
        $mockCenter: MockCenter
    }
}