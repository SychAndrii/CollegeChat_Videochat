import { Socket } from "socket.io";
import LobbyClient from "../LobbyClient";

export type RouteHandler = (...args: any[]) => any;
export type RouteMiddleware = (lobbyClient: LobbyClient) => boolean;

interface Route {
  handler: RouteHandler;
  middleware: RouteMiddleware[];
}

interface RouteDTO extends Route {
  name: string;
}

export default class RoutesContainer {
  private routeMap: Map<string, Route> = new Map();
  private readonly socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  getRoute(name: string) {
    return this.routeMap.get(name);
  }

  addRoute(route: RouteDTO) {
    this.routeMap.set(route.name, {
      handler: route.handler,
      middleware: route.middleware
    });
  }

  routeExists(name: string) {
    return this.routeMap.get(name) !== undefined;
  }

  activateRoutes(lobbyClient: LobbyClient) {
    this.routeMap.forEach((route, eventName) => {
      const actualHandler = (data: any) => {
        let canContinue = true;

        for(const middleware of route.middleware) {
          canContinue = middleware(lobbyClient);
          if(!canContinue) {
            break;
          }
        }
        if(canContinue) {
          route.handler(data);
        }
      };

      this.socket.on(eventName, actualHandler);
    });
  }
}
