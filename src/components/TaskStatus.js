import React from 'react';
import PropTypes from 'prop-types';

import StatusIndicator from './StatusIndicator';

import { formatDate } from '../lib/datetime';

const DEFAULT_HEADERS = ['Window Open', 'Window Close'];

const STATUS_LIST = [
  {
    label: 'Pending',
    id: 'pending'
  },
  {
    label: 'Accepted',
    id: 'accepted'
  },
  {
    label: 'Partially Completed',
    id: 'partially-completed'
  },
  {
    label: 'Completed',
    id: 'completed'
  }
];

const TaskStatus = ({ headers = DEFAULT_HEADERS, task }) => {
  const { windowOpen, windowClose } = task;

  return (
    <div className="task-status">
      <section className="task-status-info">
        <div className="task-status-window-open">
          <p className="status-info status-info-window-open">{headers[0]}</p>
          <p className="status-info">{formatDate(windowOpen)}</p>
        </div>

        <div className="task-status-status-indicator">
          <StatusIndicator activeId={task.status} statusList={STATUS_LIST} />
        </div>

        <div className="task-status-window-open">
          <p className="status-info status-info-window-close">{headers[1]}</p>
          <p>{formatDate(windowClose)}</p>
        </div>
      </section>
    </div>
  );
};

TaskStatus.propTypes = {
  headers: PropTypes.array,
  task: PropTypes.array
};

export default TaskStatus;
