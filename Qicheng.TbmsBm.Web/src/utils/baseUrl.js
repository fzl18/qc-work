let baseUrl = '';
// Window.devApiUrl = 'http://localhost:53436'
// Window.testUrl = 'http://xgbmsoperate01:9233'
// Window.releaseUrl = 'http://xgbmsoperate:8888'
switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = Window.devApiUrl
    break
  case 'production':
    baseUrl = Window.releaseUrl
    break
  case 'test':
    baseUrl = Window.testUrl
}
export default baseUrl