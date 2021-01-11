export default {
  methods: {
    handleSummary ({ columns, data }, excludeSymble, excludeItems) {
      if(!columns || !data) return []
      if(!data.length) return []
      let isUniqCurrency = true
      if (excludeSymble && data[0][excludeSymble]) {
        let firstCurrencyId = data[0][excludeSymble]
        isUniqCurrency = !data.some(currency =>currency[excludeSymble] != firstCurrencyId)
      }
      const sums = {};
      let excludes = ['price', 'rate', 'isbuy', 'isclose', 'tradenumber', 'InstrumentType', 'tradeAccountText','note']
      if(!isUniqCurrency) {
        excludes.push(...excludeItems)
      }
      columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
              sums[key] = '合计'
              return;
          }
          const values = data.map(item => {
            if(item[key] != null && item[key] != undefined)
            return Number(item[key])
          });
          if (!values.every(value => isNaN(value)) && excludes.every(e =>key.toLowerCase().indexOf(e.toLowerCase()) ==-1)) {
              const v = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                      return prev + curr;
                  } else {
                      return prev;
                  }
              }, 0);
            sums[key] = v
          } else {

          }
      });
      return [...data, sums]
    }
 },
}
