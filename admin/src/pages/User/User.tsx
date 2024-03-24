import { Flex, Tabs, Typography } from 'antd';
import { useLayoutEffect } from 'react';
import { useLocation, matchPath, useParams } from 'react-router-dom';
import { $fullName, $tgLink, $user, setUserId } from '../../stores/user';
import { useStore } from '@nanostores/react';
import { UserTabs } from './Tabs';

export function UserPage() {
  const { userId } = useParams<{ userId: string }>();

  useLayoutEffect(() => {
    setUserId(userId!);
  }, [userId]);

  const { data: user, loading, error } = useStore($user);
  const fullName = useStore($fullName);
  const tgLink = useStore($tgLink);
  // TODO: user age

  if (loading) {
    return 'loading...';
  }

  if (error) {
    return 'error';
  }

  return (
    <>
      <Flex style={{ marginBottom: '24px' }}>
        <div>
          <Typography.Title>{fullName}</Typography.Title>
          {tgLink ? (
            <a href={tgLink} target="_blank">
              Telegram chat
            </a>
          ) : null}
        </div>

        <div></div>
      </Flex>

      <UserTabs userId={userId!} />
    </>
  );
}
