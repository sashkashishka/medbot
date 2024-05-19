import { Table, Flex, Typography, type TableProps, Button } from 'antd';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $translations, setI18nOptions } from '../../stores/i18n';
import type { tI18n, tLang, tNamespace } from '../../types';
import { ROUTES } from '../../constants/routes';
import { useLayoutEffect, useMemo } from 'react';

export function I18nNamespacePage() {
  const { lang, namespace } = useParams<{
    lang: tLang;
    namespace: tNamespace;
  }>();

  const { data, loading } = useStore($translations);

  useLayoutEffect(() => {
    setI18nOptions(lang!, namespace!);
  }, [lang, namespace]);

  const columns: TableProps<tI18n>['columns'] = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Key',
        dataIndex: 'key',
      },
      {
        title: 'Translation',
        dataIndex: lang,
        render(translation: string) {
          return (
            <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>
              {translation}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: 'Edit',
        render(_v: unknown, record: tI18n) {
          return (
            <Link
              to={generatePath(ROUTES.I18N_UPDATE, {
                lang: lang!,
                namespace: namespace!,
                id: String(record.id),
              })}
            >
              Edit
            </Link>
          );
        },
      },
    ],
    [lang, namespace],
  );

  return (
    <>
      <Flex justify="space-between">
        <div>
          <Typography>
            Lang: <b>{lang}</b>
          </Typography>
          <br />
          <Typography>
            Namespace: <b>{namespace}</b>
          </Typography>
        </div>

        <div>
          <Link
            to={generatePath(ROUTES.I18N_CREATE, {
              lang: lang!,
              namespace: namespace!,
            })}
          >
            <Button type="primary">Create new translation</Button>
          </Link>
        </div>
      </Flex>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data || []}
      />
    </>
  );
}
