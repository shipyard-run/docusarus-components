Some explanation!

```js
import Terminal from '../Terminal';

<TerminalVisor>
  <Terminal 
    target="1.consul.server.container.shipyard.run" 
    shell="/bin/sh" 
    id="consul" 
    webSocketURI="ws://localhost:30003" 
    name="Consul"/>
  <Terminal 
    target="1.consul.server.container.shipyard.run" 
    shell="/bin/sh" 
    id="nginx" 
    webSocketURI="ws://localhost:30003"
    name="Nginx"/>
</TerminalVisor>
```