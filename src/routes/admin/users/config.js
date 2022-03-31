import {_} from "lib/polyglot";

export const config_a = {
  data_endpoint: '/admin/users/data',
  columns: [
    {label: _.t('username'), data: 'username'},
    {label: _.t('level'), data: 'level'}
  ]
}
