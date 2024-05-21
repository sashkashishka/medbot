import { Flex, Table, type TableProps } from 'antd';
import { Link, generatePath } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $config } from '../../stores/i18n';
import { type iI18nConfig } from '../../types';
import { ROUTES } from '../../constants/routes';

const columns: TableProps<iI18nConfig>['columns'] = [
  {
    title: 'Translations for',
    dataIndex: 'ns',
  },
  {
    title: 'Language',
    dataIndex: 'lang',
    render(lang: iI18nConfig['lang'], config) {
      return (
        <Flex gap={16}>
          {lang.map((l) => (
            <Link
              key={l}
              to={generatePath(ROUTES.I18N_NAMESPACE, {
                lang: l,
                namespace: config.ns,
              })}
            >
              {l}
            </Link>
          ))}
        </Flex>
      );
    },
  },
];

export function I18nPage() {
  const { data, loading } = useStore($config);

  return (
    <Table
      rowKey="ns"
      loading={loading}
      columns={columns}
      dataSource={data || []}
    />
  );
}
