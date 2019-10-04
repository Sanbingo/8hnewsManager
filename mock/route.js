import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    zh: {
      name: '仪表盘'
    },
    'pt-br': {
      name: 'Dashboard'
    },
    route: '/dashboard',
  },
  {
    id: '6',
    name: 'news',
    zh: {
      name: '新闻源'
    },
    icon: 'appstore',
    route: '/news'
  },
  {
    id: '7',
    // breadcrumbParentId: '1',
    name: 'Spider',
    zh: {
      name: '爬虫采集'
    },
    icon: 'bug',
    route: '/spider',
  },
  {
    id: '8',
    // breadcrumbParentId: '1',
    name: 'Posts',
    zh: {
      name: '文章管理'
    },
    icon: 'read',
    route: '/posts',
  },
  {
    id: '9',
    name: 'Setting',
    zh: {
      name: '系统设置'
    },
    icon: 'setting'
  },
  {
    id: '91',
    breadcrumbParentId: '9',
    menuParentId: '9',
    name: 'site',
    zh: {
      name: '站点管理'
    },
    icon: 'ie',
    route: '/site',
  },
  {
    id: '92',
    breadcrumbParentId: '9',
    menuParentId: '9',
    name: 'Employee',
    zh: {
      name: '员工管理'
    },
    icon: 'user',
    route: '/employee',
  },
  {
    id: '93',
    breadcrumbParentId: '9',
    menuParentId: '9',
    name: 'tool',
    zh: {
      name: '参数设置'
    },
    icon: 'tool',
    route: '/tool'
  },
  {
    id: '94',
    breadcrumbParentId: '9',
    menuParentId: '9',
    name: 'sensitive',
    zh: {
      name: '敏感词设置'
    },
    icon: 'alert',
    route: '/sensitive'
  },
  {
    id: '10',
    name: 'platform',
    zh: {
      name: '平台管理'
    },
    icon: 'global',
  },
  {
    id: '101',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'Sources',
    zh: {
      name: '采集管理'
    },
    icon: 'appstore',
    route: '/sources'
  },
  {
    id: '102',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'spidercfg',
    zh: {
      name: '爬虫配置'
    },
    icon: 'form',
    route: '/spidercfg'
  },
  {
    id: '103',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'Spider',
    zh: {
      name: '爬虫任务'
    },
    icon: 'bug',
    route: '/spider',
  },
  {
    id: '104',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'tags',
    zh: {
      name: '标签管理'
    },
    icon: 'tags',
    route: '/tags'
  },
  {
    id: '105',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'administrator',
    zh: {
      name: '合作管理'
    },
    icon: 'team',
    route: '/administrator',
  },
  {
    id: '106',
    // breadcrumbParentId: '10',
    // menuParentId: '10',
    name: 'personal',
    zh: {
      name: '个人中心'
    },
    icon: 'user',
    route: '/personal',
  },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    zh: {
      name: '用户详情'
    },
    'pt-br': {
      name: 'Detalhes do usuário'
    },
    route: '/user/:id',
  },
  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Request',
    zh: {
      name: 'Request'
    },
    'pt-br': {
      name: 'Requisição'
    },
    icon: 'api',
    route: '/request',
  },
  {
    id: '4',
    breadcrumbParentId: '1',
    name: 'UI Element',
    zh: {
      name: 'UI组件'
    },
    'pt-br': {
      name: 'Elementos UI'
    },
    icon: 'camera-o',
  },
  {
    id: '45',
    breadcrumbParentId: '4',
    menuParentId: '4',
    name: 'Editor',
    zh: {
      name: 'Editor'
    },
    'pt-br': {
      name: 'Editor'
    },
    icon: 'edit',
    route: '/UIElement/editor',
  },
  {
    id: '5',
    breadcrumbParentId: '1',
    name: 'Charts',
    zh: {
      name: 'Charts'
    },
    'pt-br': {
      name: 'Graficos'
    },
    icon: 'code-o',
  },
  {
    id: '51',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'ECharts',
    zh: {
      name: 'ECharts'
    },
    'pt-br': {
      name: 'ECharts'
    },
    icon: 'line-chart',
    route: '/chart/ECharts',
  },
  {
    id: '52',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'HighCharts',
    zh: {
      name: 'HighCharts'
    },
    'pt-br': {
      name: 'HighCharts'
    },
    icon: 'bar-chart',
    route: '/chart/highCharts',
  },
  {
    id: '53',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'Rechartst',
    zh: {
      name: 'Rechartst'
    },
    'pt-br': {
      name: 'Rechartst'
    },
    icon: 'area-chart',
    route: '/chart/Recharts',
  },
]

module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}
