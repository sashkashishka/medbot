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
import { faker } from '@faker-js/faker';
import { API } from '../constants/api';
import type { iAppointment, iOrder, iProduct, iUser } from '../types';
import { ModelDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';

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
  // user: Factory.extend<iUser>({
  //   id(i) {
  //     return i;
  //   },
  // }),
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
// AppSchema
// ==========================
// ==========================
type tAppRegistry = Registry<typeof models, typeof factories>;
type tAppSchema = Schema<tAppRegistry>;

// ==========================
// ==========================
// ENDPOINTS
// ==========================
// ==========================
function productEndpoints(server: Server) {
  server.get(API.PRODUCT_LIST, (schema: tAppSchema) => {
    const product = schema.all('product');

    return new Response(200, {}, product.models);
  });
}

function userEndpoints(server: Server) {
  server.get(API.USER, (schema: tAppSchema, request) => {
    const user = schema.find('user', request.params.id);

    return new Response(200, {}, user ? user : 'null');
  });
}

function orderEndpoints(server: Server) {
  server.get(API.ACTIVE_ORDER, (schema: tAppSchema, request) => {
    const order = schema.findBy('order', (order) => {
      return (
        order.userId === Number(request.params.id) && order.status === 'ACTIVE'
      );
    });

    return new Response(200, {}, order ? order : 'null');
  });
}

export function setupMirage() {
  const mirageServer = createServer({
    logging: false,
    models,
    factories,
    seeds(server) {
      server.createList('product', 9);
    },
  });

  mirageServer.logging = false;

  productEndpoints(mirageServer);
  userEndpoints(mirageServer);
  orderEndpoints(mirageServer);

  return mirageServer;
}
