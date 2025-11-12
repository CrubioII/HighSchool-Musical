import React from 'react';

function BaseIcon({ size = 20, children, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconUser = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" />
  </BaseIcon>
);

export const IconLock = (props) => (
  <BaseIcon {...props}>
    <path d="M7 11V7a5 5 0 0110 0v4" />
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="16" r="1.6" />
  </BaseIcon>
);

export const IconHome = (props) => (
  <BaseIcon {...props}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </BaseIcon>
);

export const IconActivity = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 12 8 12 11 20 14 4 17 12 21 12" />
  </BaseIcon>
);

export const IconBarChart = (props) => (
  <BaseIcon {...props}>
    <line x1="4" y1="19" x2="4" y2="12" />
    <line x1="9" y1="19" x2="9" y2="4" />
    <line x1="14" y1="19" x2="14" y2="8" />
    <line x1="19" y1="19" x2="19" y2="14" />
  </BaseIcon>
);

export const IconLayers = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 3 3 9 12 15 21 9 12 3" />
    <polyline points="3 14 12 20 21 14" />
  </BaseIcon>
);

export const IconUsers = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 21c0-4 3-6 8-6" />
    <circle cx="19" cy="11" r="3" />
    <path d="M17 21c0-2.5 1.5-4.5 4-5" />
  </BaseIcon>
);

export const IconCheckCircle = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </BaseIcon>
);

export const IconLogOut = (props) => (
  <BaseIcon {...props}>
    <path d="M15 3h-6a2 2 0 00-2 2v14a2 2 0 002 2h6" />
    <path d="M10 12h10" />
    <path d="M17 8l4 4-4 4" />
  </BaseIcon>
);

export const IconEdit = (props) => (
  <BaseIcon {...props}>
    <path d="M17 3a2.8 2.8 0 014 4L8 20l-5 1 1-5L17 3z" />
    <path d="M13 7l4 4" />
  </BaseIcon>
);

export const IconPlus = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
);

export const IconRefresh = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 4 3 10 9 10" />
    <polyline points="21 20 21 14 15 14" />
    <path d="M5.5 19A9 9 0 0114 4.5l2 .5" />
    <path d="M18.5 5A9 9 0 0110 19.5l-2-.5" />
  </BaseIcon>
);

export const IconTrash = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6l1-2h6l1 2" />
    <rect x="6" y="6" width="12" height="14" rx="2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseIcon>
);

export const IconCalendarPlus = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="3" y1="11" x2="21" y2="11" />
    <line x1="12" y1="15" x2="12" y2="19" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </BaseIcon>
);

export const IconClipboard = (props) => (
  <BaseIcon {...props}>
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="9" y="2" width="6" height="4" rx="1.5" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </BaseIcon>
);

export const IconTrendingUp = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </BaseIcon>
);

export const IconUserCheck = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 21c0-4 3-6 8-6" />
    <path d="M17 11l2 2 4-4" />
    <path d="M15 21a5 5 0 015-5" />
  </BaseIcon>
);
