import { pathMatchRegexp } from 'utils'

const NAMESPACE = 'personal'

export default {
    namespace: NAMESPACE,
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (pathMatchRegexp(`/${NAMESPACE}`, location.pathname)) {
            // 初始化
          }
        })
      }
    }
}
