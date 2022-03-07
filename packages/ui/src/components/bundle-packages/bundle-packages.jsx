import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  PACKAGE_FILTERS,
  PACKAGES_SEPARATOR,
  PACKAGE_ID_SEPARATOR,
  getBundleModulesBySearch,
  getBundlePackagesByNameComponentLink,
} from '@bundle-stats/utils';

import config from '../../config.json';
import I18N from '../../i18n';
import { Stack } from '../../layout/stack';
import { FlexStack } from '../../layout/flex-stack';
import { EmptySet } from '../../ui/empty-set';
import { Filters } from '../../ui/filters';
import { HoverCard } from '../../ui/hover-card';
import { SortDropdown } from '../../ui/sort-dropdown';
import { Tag } from '../../ui/tag';
import { Toolbar } from '../../ui/toolbar';
import { FileName } from '../../ui/file-name';
import { ComponentLink } from '../component-link';
import { MetricsTable } from '../metrics-table';
import { MetricsTableSearch } from '../metrics-table-search';
import { MetricsTableOptions } from '../metrics-table-options';
import { MetricsTableTitle } from '../metrics-table-title';
import css from './bundle-packages.module.css';

const PackagePopoverContent = ({ name, fullName, path, duplicate, CustomComponentLink }) => {
  const normalizedPackagePath =
    path || `node_modules/${fullName.split(PACKAGES_SEPARATOR).join('/node_modules/')}/`;
  const [normalizedName, packageId] = name.split(PACKAGE_ID_SEPARATOR);

  return (
    <Stack space="xxsmall" className={css.packagePopover}>
      <Stack space="xxxsmall">
        <h3 className={css.packagePopoverTitle}>
          {normalizedName}
          {packageId && (
            <span className={css.packagePopoverTitleIndex}>
              {`${PACKAGE_ID_SEPARATOR}${packageId}`}
            </span>
          )}
        </h3>
        <p className={css.packagePopoverPath}>
          <FileName className={css.packagePopoverPathValue} name={normalizedPackagePath} />
        </p>
      </Stack>

      <ul className={css.packagePopoverList}>
        <li className={css.packagePopoverItem}>
          <a
            href={`https://www.npmjs.com/package/${normalizedName}`}
            target="_blank"
            rel="noreferrer"
          >
            npmjs.com
          </a>
        </li>
        <li className={css.packagePopoverItem}>
          <a
            href={`https://bundlephobia.com/result?p=${normalizedName}`}
            target="_blank"
            rel="noreferrer"
          >
            bundlephobia.com
          </a>
        </li>
      </ul>

      <Stack space="xxxsmall" className={css.packagePopover.actions}>
        {duplicate && (
          <div>
            <CustomComponentLink {...getBundlePackagesByNameComponentLink(normalizedName)}>
              View all duplicate instances
            </CustomComponentLink>
          </div>
        )}

        <CustomComponentLink {...getBundleModulesBySearch(normalizedPackagePath)}>
          Search modules by package path
        </CustomComponentLink>
      </Stack>
    </Stack>
  );
};

PackagePopoverContent.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  duplicate: PropTypes.bool.isRequired,
  CustomComponentLink: PropTypes.elementType.isRequired,
};

PackagePopoverContent.defaultProps = {
  path: '',
};

const PackageRowHeader = ({ item, CustomComponentLink }) => {
  const packageNames = item.label.split(PACKAGES_SEPARATOR);
  const { path } = item.runs[0] || {};

  return (
    <span className={css.packageNames}>
      {packageNames.map((packageName, index) => {
        // Render duplicate flag only for the last entry
        const duplicateFlag = index === packageNames.length - 1 && item.duplicate && (
          <Tag
            title="Duplicate package"
            kind={Tag.KINDS.DANGER}
            size={Tag.SIZES.SMALL}
            className={css.tagDuplicate}
          />
        );

        return (
          <HoverCard
            className={css.packageName}
            label={
              <FlexStack space="xxxsmall" className={css.packageNameLabel}>
                {duplicateFlag}
                <span>{packageName}</span>
              </FlexStack>
            }
          >
            <PackagePopoverContent
              name={packageName}
              path={path}
              fullName={item.label}
              duplicate={item.duplicate}
              CustomComponentLink={CustomComponentLink}
            />
          </HoverCard>
        );
      })}
    </span>
  );
};

PackageRowHeader.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    duplicate: PropTypes.bool,
    runs: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  CustomComponentLink: PropTypes.elementType.isRequired,
};

export const BundlePackages = (props) => {
  const {
    className,
    jobs,
    items,
    updateFilters,
    resetFilters,
    resetAllFilters,
    totalRowCount,
    filters,
    sortFields,
    sort,
    updateSort,
    search,
    updateSearch,
    hasActiveFilters,
    customComponentLink: CustomComponentLink,
  } = props;

  const emptyMessage = (
    <EmptySet
      resources="packages"
      filtered={totalRowCount !== 0}
      handleResetFilters={resetFilters}
      handleViewAll={resetAllFilters}
    />
  );

  const renderRowHeader = useCallback(
    (item) => <PackageRowHeader item={item} CustomComponentLink={CustomComponentLink} />,
    [CustomComponentLink],
  );

  return (
    <section className={cx(css.root, className)}>
      <Toolbar
        className={css.toolbar}
        renderActions={({ actionClassName }) => (
          <FlexStack space="xxsmall" className={cx(css.dropdown, actionClassName)}>
            <SortDropdown fields={sortFields} {...sort} onChange={updateSort} />
            <MetricsTableOptions
              handleViewAll={resetAllFilters}
              handleResetFilters={resetFilters}
            />
          </FlexStack>
        )}
      >
        <FlexStack space="xxsmall">
          <MetricsTableSearch
            className={css.toolbarSearch}
            placeholder="Search by name"
            search={search}
            updateSearch={updateSearch}
          />
          <Filters
            filters={{
              [PACKAGE_FILTERS.CHANGED]: {
                label: 'Changed',
                defaultValue: filters[PACKAGE_FILTERS.CHANGED],
                disabled: jobs.length <= 1,
              },
              [PACKAGE_FILTERS.DUPLICATE]: {
                label: 'Duplicate',
                defaultValue: filters[PACKAGE_FILTERS.DUPLICATE],
              },
            }}
            label={`Filters (${items.length}/${totalRowCount})`}
            onChange={updateFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </FlexStack>
      </Toolbar>
      <main>
        <MetricsTable
          runs={jobs}
          items={items}
          emptyMessage={emptyMessage}
          renderRowHeader={renderRowHeader}
          showHeaderSum
          title={
            <MetricsTableTitle
              title={I18N.PACKAGES}
              info={`(${items.length}/${totalRowCount})`}
              popoverInfo={I18N.PACKAGES_INFO}
              popoverHref={config.documentation.packages}
            />
          }
        />
      </main>
    </section>
  );
};

BundlePackages.defaultProps = {
  className: '',
  totalRowCount: 0,
  hasActiveFilters: false,
  customComponentLink: ComponentLink,
};

BundlePackages.propTypes = {
  className: PropTypes.string,
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      internalBuildNumber: PropTypes.number,
    }),
  ).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      runs: PropTypes.arrayOf(
        PropTypes.shape({
          displayValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          displayDelta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
      ),
    }),
  ).isRequired,
  updateFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  resetAllFilters: PropTypes.func.isRequired,
  totalRowCount: PropTypes.number,
  filters: PropTypes.shape({
    changed: PropTypes.bool,
  }).isRequired,
  hasActiveFilters: PropTypes.bool,
  sortFields: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      label: PropTypes.string,
      defaultDirection: PropTypes.bool,
    }),
  }).isRequired,
  sort: PropTypes.shape({
    sortBy: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  updateSort: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  updateSearch: PropTypes.func.isRequired,
  customComponentLink: PropTypes.elementType,
};
