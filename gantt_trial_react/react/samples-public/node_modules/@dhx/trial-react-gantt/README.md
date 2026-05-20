# DHTMLX React Gantt

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)
[![npm: v.9.1.4](https://img.shields.io/badge/npm-v.9.1.4-blue.svg)](https://npm.dhtmlx.com/-/web/detail/@dhx/trial-react-gantt)

[Getting started](#getting-started) | [Features](#features) | [License](#license) | [Useful links](#links) | [Follow us](#followus)

[DHTMLX React Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt-for-React/) is a React wrapper for the [DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) library. 

It provides a declarative way to integrate all of DHTMLX Gantt's rich project scheduling features - such as tasks, dependencies, auto-scheduling, and resource management - directly into React apps. By combining React's component-based workflow with DHTMLX Gantt's robust JavaScript engine, this library delivers a seamless experience for building interactive Gantt charts in modern React projects.


<a name="getting-started"></a>
## Getting started

**Install package**

Professional Evaluation version:

~~~bash
npm config set @dhx:registry=https://npm.dhtmlx.com
npm install @dhx/trial-react-gantt
~~~

Professional version:

Generate your login and password for private npm in your Client's Area: https://dhtmlx.com/clients/

~~~bash
npm config set @dhx:registry=https://npm.dhtmlx.com
npm login --registry=https://npm.dhtmlx.com --scope=@dhx --auth-type=legacy
npm install @dhx/react-gantt
~~~

And initialize:

~~~jsx
import { useState } from 'react';
import ReactGantt from '@dhx/trial-react-gantt';
import '@dhx/trial-react-gantt/dist/react-gantt.css';
import { demoData } from './DemoData'

export default function BasicGantt() {
  const [theme, setTheme] = useState("terrace");
  const [tasks, setTasks] = useState(demoData.tasks);
  const [links, setLinks] = useState(demoData.links);

  return (
    <div style={ { height: '500px' } }>
      <ReactGantt
        tasks={tasks}
        links={links}
        theme={theme}
      />
    </div>
  );
}
~~~

`demoData` is an example tasks/links dataset. Replace it with your own project data.

### Requirements

- React `18.x` or newer

### Complete guides


- https://docs.dhtmlx.com/gantt/integrations/react/



<a name="features"></a>
## Features

- React components in templates of grid cells, headers, timelines
- easy customization with React components
- seamless theming and MUI compatibility
- compatibility with Redux Toolkit
- TypeScript support
- 4 types of tasks linking: finish-to-start, start-to-start, finish-to-finish, start-to-finish
- dragging and dropping multiple tasks horizontally
- multi-task selection
- backward planning
- tasks filtering
- resources filtering
- inline editing
- managing editability/readonly modes of individual tasks
- undo/redo functionality
- configurable columns in the grid
- customizable time scale and task edit form
- progress percent coloring for tasks
- 7 different skins
- online export to PDF, PNG, Excel, iCal, and MS Project
- 32 locales
- keyboard navigation
- resource management
- critical path calculation
- auto scheduling


<a name="license"></a>
## License

DHTMLX Gantt for React v.9.1.4 Professional Evaluation

This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get a proprietary license. Usage without proper license is prohibited.

(c) XB Software


<a name="links"></a>
## Useful links

- [DHTMLX React Gantt product page](https://dhtmlx.com/docs/products/dhtmlxGantt-for-React/)
- [DHTMLX Gantt product page](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- [Official documentation](https://docs.dhtmlx.com/gantt/)
- [Online samples](https://docs.dhtmlx.com/gantt/samples/)
- [Video tutorials](https://www.youtube.com/watch?v=cCvULTQxPfg&list=PLKS_XdyIGP4MEW6yvvQUZT8vJKHVOq2S0)
- [Export services](https://dhtmlx.com/docs/products/dhtmlxGantt/export.shtml)
- [List of available integrations](https://dhtmlx.com/docs/products/integrations/)
- [Support forum](https://forum.dhtmlx.com/c/gantt)

<a name="followus"></a>
## Follow us

Read us on [Medium](https://medium.com/@dhtmlx) :newspaper:

Follow us on [Twitter](https://twitter.com/dhtmlx) :bird:

Like our page on [Facebook](https://www.facebook.com/dhtmlx/) :thumbsup:
