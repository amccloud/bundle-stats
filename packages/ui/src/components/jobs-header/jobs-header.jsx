import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { formatDistanceToNow } from 'date-fns';
import { formatDate, formatTime } from '@bundle-stats/utils';

import { Box } from '../../ui/box';
import { Icon } from '../../ui/icon';
import { SummaryItem } from '../summary-item';
import css from './jobs-header.module.css';

const TOTAL_BUNDLE_SIZE = 'webpack.assets.totalSizeByTypeALL';

export const JobsHeader = (props) => {
  const { className, loading, jobs } = props;

  const rootClassName = cx(css.root, className, loading && css.loading);

  return (
    <Box className={rootClassName}>
      {loading && (
        <>
          <div className={css.job}>
            <div className={css.jobDescription}>
              <div className={css.jobTitle} />
            </div>

            <SummaryItem
              className={css.jobSummaryItem}
              size="large"
              loading
              id={TOTAL_BUNDLE_SIZE}
            />
          </div>
          <div className={css.job}>
            <div className={css.jobDescription}>
              <div className={css.jobTitle} />
            </div>

            <SummaryItem
              className={css.jobSummaryItem}
              size="large"
              loading
              id={TOTAL_BUNDLE_SIZE}
            />
          </div>
        </>
      )}

      {!loading && jobs && jobs.map((job, index) => (
        <div className={css.job}>
          <div className={css.jobDescription}>
            <h1 className={css.jobTitle}>
              {`#${job.internalBuildNumber}`}
            </h1>

            <div className={css.jobMeta}>
              {job.builtAt && (
                <span
                  className={css.jobMetaItem}
                  title={`${formatDate(job.builtAt)} ${formatTime(job.builtAt)}`}
                >
                  <Icon glyph="clock" className={css.jobMetaIcon} />
                  {formatDistanceToNow(new Date(job.builtAt))}
                </span>
              )}

              {job.hash && (
                <span className={css.jobMetaItem} title="Webpack bundle hash">
                  <Icon glyph="commit" className={css.jobMetaIcon} />
                  {job.hash}
                </span>
              )}
            </div>
          </div>

          <SummaryItem
            className={css.jobSummaryItem}
            size="large"
            loading={false}
            id={TOTAL_BUNDLE_SIZE}
            data={job.summary[TOTAL_BUNDLE_SIZE]}
            showDelta={index + 1 < jobs.length}
          />
        </div>
      ))}
    </Box>
  );
};

JobsHeader.propTypes = {
  /** Adopted child classname */
  className: PropTypes.string,

  /** Loading flag */
  loading: PropTypes.bool,

  /** Jobs data */
  jobs: PropTypes.arrayOf(PropTypes.shape({
    internalBuildNumber: PropTypes.number,
    builtAt: PropTypes.string,
    hash: PropTypes.string,
    summary: PropTypes.shape({
      [PropTypes.string]: PropTypes.shape({
        current: PropTypes.number,
        baseline: PropTypes.number,
      }),
    }),
  })),
};

JobsHeader.defaultProps = {
  className: '',
  loading: false,
  jobs: null,
};