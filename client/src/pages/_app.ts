import type { App } from 'vue';
import Notifications from '@kyvg/vue3-notification'

export default (app: App) => {
  app.use(Notifications);
}