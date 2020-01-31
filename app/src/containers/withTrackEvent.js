import React from 'react';

const withTrackEvent = (Component) => {
  return ({ ...props }) => {
    const trackEvent = (eventCategory, action, value, eventLabel) => {
      global.gtag(
        'event', action, {
          event_category: eventCategory,
          event_label: eventLabel,
          value,
        },
      );
    };

    return <Component
      trackEvent={trackEvent}
      {...props}
    />
  };
};

export default withTrackEvent;
