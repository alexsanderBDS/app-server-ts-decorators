import "reflect-metadata";
import { App } from "../../App";
import { Methods } from "./types/Methods";
import { MetadataKeys } from "./types/MetadataKeys";

export function controller(routePath: string) {
  return function (target: Function) {
    const router = App.getRoute();

    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path: string = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      if (path) {
        router[method](`${routePath}${path}`, ...middlewares, routeHandler);
      }
    }
  };
}
