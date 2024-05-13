import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';
import { user } from '../../helpers/getServer/fixtures/user.js';

const test = t.test;

test('create user with big messageThreadId', async (t) => {
  const { request, webAppHeader } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
    },
  });

  const u = {
    ...user,
    messageThreadId: 660385568312,
  };

  const resp = await request('/api/user/create', {
    method: 'POST',
    body: u,
    headers: webAppHeader,
  });

  t.match(resp, { status: 200 }, 'should return 200 status as user created');
  t.match(await resp.json(), u, 'should return created user');
});

test('create user with big botChatId', async (t) => {
  const { request, webAppHeader } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
    },
  });

  const u = {
    ...user,
    botChatId: 660385568313,
  };

  const resp = await request('/api/user/create', {
    method: 'POST',
    body: u,
    headers: webAppHeader,
  });

  t.match(resp, { status: 200 }, 'should return 200 status as user created');
  t.match(await resp.json(), u, 'should return created user');
});

test('update user with big messageThreadId', async (t) => {
  const { request, webAppHeader, getUsers } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'none',
            status: 'ACTIVE',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const [user] = await getUsers();

  const u = {
    ...user,
    messageThreadId: 660385568312,
  };

  const resp = await request(`/api/user/update/${user.id}`, {
    method: 'PATCH',
    body: u,
    headers: webAppHeader,
  });

  t.match(resp, { status: 200 }, 'should return 200 status as user created');
  t.match(await resp.json(), u, 'should return created user');
});

test('update user with big botChatId', async (t) => {
  const { request, webAppHeader, getUsers } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'none',
            status: 'ACTIVE',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const [user] = await getUsers();

  const u = {
    ...user,
    botChatId: 660385568313,
  };

  const resp = await request(`/api/user/update/${user.id}`, {
    method: 'PATCH',
    body: u,
    headers: webAppHeader,
  });

  t.match(resp, { status: 200 }, 'should return 200 status as user created');
  t.match(await resp.json(), u, 'should return created user');
});
