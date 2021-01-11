import i18n from '@/i18n/index'
export default {
  isBuyOptions: [ // 买/卖
    {
      'value': 'true',
      'text': i18n.t('buy')
    },
    {
      'value': 'false',
      'text': i18n.t('sell')
    }
  ],
  isCloseOptions: [ // 开平
    {
      'value': 'false',
      'text': i18n.t('open')
    },
    {
      'value': 'true',
      'text': i18n.t('close')
    }
  ],
  hedgeFlagTypeOptions: [ // 投机保值
    {
      'value': i18n.t('speculate'),
      'text': i18n.t('speculate')
    },
    {
      'value': i18n.t('valuePreservation'),
      'text': i18n.t('valuePreservation')
    }
  ],
  hedgeFlagTypeOptions1: [ // 投保
    {
      'value': i18n.t('speculate'),
      'text': i18n.t('investment')
    },
    {
      'value': i18n.t('valuePreservation'),
      'text': i18n.t('insurance')
    }
  ],
  yONOptions: [ // 是否
    {
      'value': 'true',
      'text': i18n.t('是')
    },
    {
      'value': 'false',
      'text': i18n.t('否')
    }
  ],
  isDisabledOptions: [ // 是否
    {
      'value': 'false',
      'text': i18n.t('是')
    },
    {
      'value': 'true',
      'text': i18n.t('否')
    }
  ],
  instructionTypeOptions: [ // 普通指令 移仓指令
    {
      'value': 'false',
      'text': i18n.t('generalInstruction')
    },
    {
      'value': 'true',
      'text': i18n.t('shiftingInstruction')
    }
  ],
  matchPriority: [
    {
      label: i18n.t('byTime'),
      value: 1
    },
    {
      label: i18n.t('byWeight'),
      value: 2
    },
    {
      label: i18n.t('byPrice'),
      value: 3
    }
  ]
}
