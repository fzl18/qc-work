import index from '@/views/main'
// import i18n from '@/i18n'

export default {
  index: 10,
  path: '/tradeCalendar',
  name: 'tradeCalendar',
  redirect: { name: 'tradeCalendarList' },
  component: index,
  meta: {
    title: '交易日历',
  },
  children: [
    {
      path: 'list',
      name: 'tradeCalendarList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}