import {
  Factory,
  Model,
  Registry,
  Server,
  belongsTo,
  createServer,
  hasMany,
  Response,
} from 'miragejs';
import { RouteHandler, ServerConfig } from 'miragejs/server';
import { faker } from '@faker-js/faker';
import { API } from '../constants/api';
import type { iAppointment, iOrder, iProduct, iUser } from '../types';
import { ModelDefinition } from 'miragejs/-types';

// ==========================
// ==========================
// MODELS
// ==========================
// ==========================
const product: ModelDefinition<iProduct> = Model.extend({
  order: hasMany(),
});
const user: ModelDefinition<iUser> = Model.extend({
  order: hasMany(),
  appointment: hasMany(),
});
const order: ModelDefinition<iOrder> = Model.extend({
  user: belongsTo(),
  product: belongsTo(),
  appointment: hasMany(),
});
const appointment: ModelDefinition<iAppointment> = Model.extend({
  user: belongsTo(),
  order: belongsTo(),
});

const models = {
  product,
  user,
  order,
  appointment,
};

// ==========================
// ==========================
// FACTORIES
// ==========================
// ==========================
const factories = {
  product: Factory.extend<iProduct>({
    id(i) {
      return i + 1;
    },
    name() {
      return faker.commerce.productName();
    },
    description() {
      return faker.commerce.productDescription();
    },
    price() {
      return parseInt(faker.commerce.price());
    },
    memberQty(i) {
      return i;
    },
    subscriptionDuration(i) {
      return i;
    },
  }),
  user: Factory.extend<iUser>({
    id() {
      return 2102;
    },
    name() {
      return faker.person.firstName();
    },
    surname() {
      return faker.person.lastName();
    },
    patronymic() {
      return faker.person.fullName();
    },
    birthDate() {
      return faker.date.birthdate().toISOString();
    },
    email() {
      return faker.internet.email();
    },
    phone() {
      return faker.phone.number();
    },
  }),
  // appointment: Factory.extend({
  //   id(i) {
  //     return i;
  //   },
  // }),
  // order: Factory.extend({
  //   id(i) {
  //     return i;
  //   },
  // }),
};
// ==========================
// ==========================
// SCENARIOS
// ==========================
// ==========================

function hasActiveOrder(server: Server<tAppRegistry>) {
  server.create('user');
  server.create('order', { userId: 2102, status: 'ACTIVE' });
}

const SCENARIOS = {
  hasActiveOrder,
};

// ==========================
// ==========================
// AppSchema
// ==========================
// ==========================
type tAppRegistry = Registry<typeof models, typeof factories>;

// ==========================
// ==========================
// ENDPOINTS
// ==========================
// ==========================

type tEndpoints = {
  [key in API]?: RouteHandler<tAppRegistry>;
};

const GET_ENDPOINTS: tEndpoints = {
  [API.PRODUCT_LIST]: (schema) => {
    const product = schema.all('product');

    return product.models;
  },
  [API.USER]: (schema, request) => {
    const user = schema.find('user', request.params.userId);

    return user ? user : 'null';
  },
  [API.ACTIVE_ORDER]: (schema, request) => {
    const order = schema.findBy('order', (order) => {
      return (
        order.userId === Number(request.params.userId) &&
        order.status === 'ACTIVE'
      );
    });

    return order ? order : 'null';
  },
  [API.WAITING_FOR_PAYMENT_ORDER]: (schema, request) => {
    const order = schema.findBy('order', (order) => {
      return (
        order.userId === Number(request.params.userId) &&
        order.status === 'WAITING_FOR_PAYMENT'
      );
    });

    return order ? order : 'null';
  },
};

// ==========================
// ==========================
// SETUP SERVER
// ==========================
// ==========================

interface iErrorRouteConfig {
  code: number;
  times: number;
}

type tErrorRoutes = {
  [key in API]?: iErrorRouteConfig;
};

interface iCreateHandlerOptions {
  handler: RouteHandler<tAppRegistry>;
  config?: iErrorRouteConfig;
}

function createHandler({
  handler,
  config,
}: iCreateHandlerOptions): RouteHandler<tAppRegistry> {
  let times = config?.times || 0;

  return (...args) => {
    const code = times === 0 ? 200 : config?.code || 200;
    times = Math.max(0, times - 1);

    const body = handler(...args);

    return new Response(code, {}, body as any);
  };
}

interface iMirageOptions extends ServerConfig<any, any> {
  errorRoutes?: {
    get?: tErrorRoutes;
    post?: tErrorRoutes;
    patch?: tErrorRoutes;
  };
  scenario?: keyof typeof SCENARIOS;
}

export function setupMirage({ errorRoutes, scenario }: iMirageOptions = {}) {
  const mirageServer = createServer({
    logging: false,
    models,
    factories,
    seeds(server) {
      server.createList('product', 9);

      if (scenario) {
        SCENARIOS[scenario]?.(server);
      }
    },
  });

  mirageServer.logging = false;

  Object.keys(GET_ENDPOINTS).forEach((key) => {
    const endpoint = key as unknown as API;

    mirageServer.get(
      endpoint,
      createHandler({
        config: errorRoutes?.get?.[endpoint],
        handler: GET_ENDPOINTS[endpoint]!,
      }),
    );
  });

  mirageServer.passthrough()

  return mirageServer;
}
