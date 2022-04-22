import {_} from "lib/polyglot";

export const config_a = {
  tag: 'users',
  data_endpoint: '/admin/users/data',
  columns: [
    {label: _.t('username'), data: 'username', width: '8%', visible: 'yes'},
    {label: _.t('role'), data: 'role', width: '4%', visible: 'yes'},
  ],
  width: '50%'
}
