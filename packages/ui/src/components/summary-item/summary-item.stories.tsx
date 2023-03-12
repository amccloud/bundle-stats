import React from 'react';
import { Meta, Story } from '@storybook/react';

import { SummaryItem } from './summary-item';

export default {
  title: 'Components/SummaryItem',
  component: SummaryItem,
} as Meta;

const Template: Story = (args) => <SummaryItem id="webpack.totalSizeByTypeALL" {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'Bundle Size',
  current: '120KiB',
  baseline: '100KiB',
  delta: '+20%',
  deltaType: 'HIGH_NEGATIVE',
};

export const SizeLarge = Template.bind({});

SizeLarge.args = {
  ...Default.args,
  size: 'large',
};

export const TitleHoverCard = Template.bind({});

TitleHoverCard.args = {
  ...Default.args,
  titleHoverCard: 'Info',
};

export const TitleTooltip = Template.bind({});

TitleTooltip.args = {
  ...Default.args,
  titleTooltip: 'Info',
};

export const Loading = Template.bind({});

Loading.args = {
  title: 'Bundle Size',
  loading: true,
};
