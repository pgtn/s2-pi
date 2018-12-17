# coding: utf-8

import json
import sys
import time

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class S2Pi(WebSocket):

    def handleMessage(self):
        payload = json.loads(self.data)
        print(payload)
        client_cmd = payload['command']
        if client_cmd == 'send_sensehat':
            t = int(payload['t'])
            p = int(payload['p'])
            h = int(payload['h'])

            print t
            print p
            print h

        elif client_cmd == 'ready':
            pass
        else:
            print("Unknown command received", client_cmd)

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')


def run_server():
    server = SimpleWebSocketServer('', 9000, S2Pi)
    server.serveforever()

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        sys.exit(0)
