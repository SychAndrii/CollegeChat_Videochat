import { Socket } from "socket.io";
import RoutesContainer, {
  RouteHandler,
  RouteMiddleware,
} from "./RoutesContainer";

export default class RoutesContainerBuilder {
  private routesContainer: RoutesContainer;
  private socket: Socket;

  /**
   * A fresh builder instance should contain a blank router container object, which is
   * used in further assembly.
   */
  constructor(socket: Socket) {
    this.socket = socket;
    this.routesContainer = new RoutesContainer(socket);
    this.reset();
  }

  public reset(): void {
    this.routesContainer = new RoutesContainer(this.socket);
  }

  public build(): RoutesContainer {
    const result = this.routesContainer;
    this.reset();
    return result;
  }

  addRouteWithMiddleware(
    routeName: string,
    routeMiddleware: RouteMiddleware[],
    routeHandler: RouteHandler
  ) {
    this.verifyRouteWithSameName(routeName);

    this.routesContainer.addRoute({
      name: routeName,
      handler: routeHandler,
      middleware: routeMiddleware,
    });
    return this;
  }

  addRoute(routeName: string, routeHandler: RouteHandler) {
    this.verifyRouteWithSameName(routeName);

    this.routesContainer.addRoute({
      name: routeName,
      handler: routeHandler,
      middleware: [],
    });
    return this;
  }

  private verifyRouteWithSameName(name: string) {
    if (this.routesContainer.routeExists(name)) {
      throw new Error("Route with the same name already exists");
    }
  }
}
