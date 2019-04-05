import React from 'react';
import { storiesOf } from '@storybook/react';

import TaskList from '../../components/TaskList';

/* statuses
pending, accepted, rejected,
partially completed, cancelled, anomaly,
completed */

const data = [
  {
    id: 1,
    name: 'Put nickles in Dwights phone',
    windowOpen: 1554416208102,
    windowClose: 1554416208102,
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Defeat Dwight in a snowball fight',
    windowOpen: 1554416208102,
    windowClose: 1554416208102,
    status: 'Anomaly'
  },
  {
    id: 3,
    name: 'Put more nickles in Dwights phone',
    windowOpen: 1554416208102,
    windowClose: 1554468784443,
    status: 'Pending'
  },
  {
    id: 4,
    name: 'Yet more nickles',
    windowOpen: 1554416208102,
    windowClose: 1554696000000,
    status: 'Pending'
  },
  {
    id: 5,
    name: 'Remove nickles so he smacks himself in the face',
    windowOpen: 1554416208102,
    windowClose: 1554782400000,
    status: 'Partially Completed'
  }
];

const columns = ['Task', 'Start Date', 'End Date', 'Current Status'];

const stories = storiesOf('Components|TaskList', module);

stories.add('Default', () => {
  return <TaskList task={data} />;
});

stories.add('Custom Headers', () => {
  return <TaskList headers={columns} task={data} />;
});
