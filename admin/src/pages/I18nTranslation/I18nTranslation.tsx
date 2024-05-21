import { useLayoutEffect } from 'react';
import {
  Flex,
  Form,
  Button,
  Popconfirm,
  Typography,
  notification,
  Input,
} from 'antd';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import {
  $createUpdateTranslation,
  $deleteTranslation,
  $translation,
  setI18nOptions,
} from '../../stores/i18n';
import type { tLang, tNamespace, iI18nTranslation } from '../../types';
import { ROUTES } from '../../constants/routes';
import TextArea from 'antd/es/input/TextArea';

export function I18nTranslationPage() {
  const { id, lang, namespace } = useParams<{
    id: string;
    lang: tLang;
    namespace: tNamespace;
  }>();
  const navigate = useNavigate();

  const { data: translation, isReady } = useStore($translation);
  const { mutate: createUpdateTranslation } = useStore(
    $createUpdateTranslation,
  );
  const { mutate: deleteTranslation } = useStore($deleteTranslation);

  useLayoutEffect(() => {
    setI18nOptions(lang!, namespace!, id);
  }, [lang, namespace, id]);

  async function onFinish(data: iI18nTranslation) {
    try {
      const resp = (await createUpdateTranslation({
        ...data,
        id: Number(id),
        lang: lang!,
        ns: namespace!,
      })) as Response;
      const respData = await resp.json();

      if (resp.ok) {
        return navigate(
          generatePath(ROUTES.I18N_UPDATE, {
            id: String(respData.id),
            lang: lang!,
            namespace: namespace!,
          }),
          { replace: true },
        );
      }

      if ('error' in respData && typeof respData.error === 'string') {
        return notification.error({ message: respData.error });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  async function onDelete({ id }: Required<Pick<iI18nTranslation, 'id'>>) {
    try {
      const resp = (await deleteTranslation({ id })) as Response;
      const respData = await resp.json();

      if (resp.ok) {
        return navigate(
          generatePath(ROUTES.I18N_NAMESPACE, {
            lang: lang!,
            namespace: namespace!,
          }),
          { replace: true },
        );
      }

      if ('error' in respData && typeof respData.error === 'string') {
        return notification.error({ message: respData.error });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  if (id && !isReady) {
    return 'Loading...';
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <div>
          <Typography.Title>
            {id ? 'Edit' : 'Create'} translation
          </Typography.Title>

          <br />

          <Typography.Text>
            Lang: <b>{lang}</b>
            <br />
            Namespace: <b>{namespace}</b>
          </Typography.Text>
        </div>

        {id ? (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDelete({ id: Number(id) })}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ) : null}
      </Flex>

      <br />

      <Form
        name="translation"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={translation}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<iI18nTranslation>
          label="Key"
          name="key"
          rules={[{ required: true, message: 'Please write down the translation key' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<iI18nTranslation>
          label="Translation"
          name="translation"
          rules={[{ required: true, message: 'Please write down the translation itself' }]}
        >
          <TextArea rows={10} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            {id ? 'Save' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
