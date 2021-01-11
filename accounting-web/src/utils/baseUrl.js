let baseUrl = "";
let mainUrl = "";
switch (process.env.NODE_ENV) {
    case 'development':
        baseUrl = Window.devApiUrl
        mainUrl = Window.devMainUrl
        break
    case 'production':
        baseUrl = Window.releaseUrl
        mainUrl = Window.releaseMainUrl
        break;
    case 'test':
        baseUrl = Window.testUrl
        break;
}
export { mainUrl }
export default baseUrl