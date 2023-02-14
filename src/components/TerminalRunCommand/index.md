Some explanation!

```js
import Command from '../Command';

<TerminalRunCommand target="consul">
  <Command>
    ls -las
  </Command>
  <Command>
    ls
  </Command>
  <Command>
    ls \
      -las
  </Command>
</TerminalRunCommand>
```

```js
import Command from '../Command';

<TerminalRunCommand target="consul" text="My Button Text">
  <Command>
    ls -las
  </Command>
  <Command>
    ls
  </Command>
  <Command>
    ls \
      -las
  </Command>
</TerminalRunCommand>
```