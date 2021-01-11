import index from '@/views/main'

export default {
  path: '/TemplateIndex',
  name: 'TemplateIndex',
  redirect: { name: 'TemplateIndexList' },
  component: index,
  meta: {
    title: '编号模板',
  },
  children: [
    {
      path: 'list',
      name: 'TemplateIndexList',
      component: () => import('./index'),
      meta: {
        title: '编号模板列表',
      },
    }
  ]
}