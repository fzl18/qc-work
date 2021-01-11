import { utils } from '@/utils/utils';
import { api } from '@/api/api';
import router from '@/router'
import { mainUrl } from './baseUrl'
const goMainLogin = () => {
    let host = window.location.host;
    // let tenantCode = localStorage.getItem('tenantCode');
    // if (!tenantCode) {
    //     window.location.href = mainUrl;
    //     return;
    // }

    // let mainLoginUrl = `${mainUrl}/-${tenantCode}/Account/Login`;
    let mainLoginUrl = `${mainUrl}/Account/Login`;
    //TODO:: module value TBD
    const MODULE = 128;

    let currentRouter = router.history.current.fullPath;

    var returnUrl = `http://${host}/fastlogin?redirect=${currentRouter}`;
    let newUrl =
        mainLoginUrl +
        utils.param({
            'module': MODULE,
            returnUrl,
        });

    if (process.env.NODE_ENV === 'development') {
        router.push({
            name: 'login'
        })
    } else {
        window.location.href = newUrl;
    }
};
export default goMainLogin;