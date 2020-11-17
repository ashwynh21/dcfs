import { Injectable } from '@angular/core';
import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {CookieService} from 'ngx-cookie-service';
import { ServicesModule } from "./services.module";

import config from '../configurations/configuration.json';

@Injectable({
  providedIn: ServicesModule
})
export class SocketService extends Socket {
  token: string;

  constructor(private cookies: CookieService) {
    super({
      url: config.socket,
      options: {
        query: (() => {
          if (cookies.check('user')) {
            const token = JSON.parse(cookies.get('user')).token;

            return `token=${token}`;
          }
          return;
        })(),
        autoConnect: false,
        transports: ['websocket']
      }
    } as SocketIoConfig);
  }

  /*
  * Lets add a function that will allow us to reconnect the socket if the user is logging in
  * */
  public init(){
    if (!this.ioSocket.isConnected) {
      this.ioSocket.io.opts.query = (() => {
        if (this.cookies.check('user')) {
          const token = JSON.parse(this.cookies.get('user')).token;

          return `token=${token}`;
        }
        return;
      })();

      this.connect();
    }
  }

  public destroy() {
    if (this.ioSocket) {
      this.ioSocket.removeAllListeners();
      this.ioSocket.close();
      this.ioSocket = undefined;
    }
  }
}
