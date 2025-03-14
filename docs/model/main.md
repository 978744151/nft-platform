# 主应用

>介绍 

#### 系统环境配置

名称      micro-main

本地       http://localhost:1888

测试环境    http://micro.dev.gpyh.com/

生产环境    https://back.gpyh.com/

api测试接口   http://mainframe-api.qa.gpyh.com

api 接口   https://mainframe-api.gpyh.com

代码地址   https://codeup.aliyun.com/gpyh/e-commerce/frontend/gpyh-main-frame-microfront

# vite 环境配置

NODE_ENV 环境

VITE_PROXY //未用到

VITE_APP_PATH //未用到

VITE_TOKEN // 主 token

VITE_TGC // 二级 token

VITE_TGT // 三级 token

VITE_URL_API // api 接口

VITE_URL // 域名

VITE_BACK_URL // 后台域名

VITE_LOGIN_URL // 登录地址

VITE_TICKET // ticket 地址


# development 

开发环境

NODE_ENV='development'

VITE_PROXY='/api'

VITE_APP_PATH = '/g-user'

VITE_TOKEN='gpyh_token_test'

VITE_TGC='TGC_development'

VITE_TGT='TGT_development'

VITE_URL_API="http://mainframe-api.qa.gpyh.com/"

VITE_URL="http://micro.dev.gpyh.com/"

VITE_BACK_URL='http://back.qa.gpyh.com'

VITE_LOGIN_URL='http://localhost:5173/'

VITE_TICKET='gpyh_ticket_development'


# dev 

测试环境

NODE_ENV='dev'

VITE_PROXY='/api'

VITE_TOKEN='gpyh_token_test'

VITE_TGC='TGC_dev'

VITE_TGT='TGT_dev'

VITE_URL_API="http://mainframe-api.qa.gpyh.com/"

VITE_URL="http://micro.dev.gpyh.com/"

VITE_BACK_URL='http://back.qa.gpyh.com'

VITE_LOGIN_URL='http://cas-microfront.dev.gpyh.com/'

VITE_TICKET='gpyh_ticket_dev'


# prod

生产环境

NODE_ENV='prod'

VITE_PROXY='/'

VITE_TOKEN='gpyh_token_prod'

VITE_TGC='TGC_prod'

VITE_TGT='TGT_prod'

VITE_URL_API="https://mainframe-api.gpyh.com/"

VITE_URL="https://back.gpyh.com/"

VITE_BACK_URL='https://oldback.gpyh.com'

VITE_LOGIN_URL='https://cas.gpyh.com'

VITE_TICKET='gpyh_ticket'

