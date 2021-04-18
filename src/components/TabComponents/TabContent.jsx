import React from 'react';
import './TabContent.less';
import classNames from 'classnames';

export default function TabContent({ clicked, value, children }) {
  return (
    // set className so that CSS controls which TabContent is visible
    <div
      className={classNames(
        'tab-content',
        `tab-content--${value.replace(' ', '-').toLowerCase()}`,
        {
          'tab-content--active': clicked === value,
        }
      )}
    >
      {children}
    </div>
  );
}
