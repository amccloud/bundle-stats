import { template } from 'lodash';

import { FILE_TYPES, FILE_TYPE_CSS, FILE_TYPE_JS } from '../config/file-types';
import {
  ASSET_ENTRY_TYPE,
  ASSET_FILE_TYPE,
  ASSET_FILTERS,
  COMPONENT,
  PACKAGE_FILTERS,
  SECTIONS,
} from '../config/component-links';
import I18N from '../i18n';

export const getAssetFileTypeFilters = (value = true) =>
  FILE_TYPES.reduce(
    (agg, fileTypeFilter) => ({
      ...agg,
      [`${ASSET_FILE_TYPE}.${fileTypeFilter}`]: value,
    }),
    {},
  );

export const getAssetEntryTypeFilters = (value = true) =>
  [ASSET_FILTERS.ENTRY, ASSET_FILTERS.INITIAL, ASSET_FILTERS.CHUNK, ASSET_FILTERS.ASSET].reduce(
    (agg, entryTypeFilter) => ({
      ...agg,
      [`${ASSET_ENTRY_TYPE}.${entryTypeFilter}`]: value,
    }),
    {},
  );

export const TOTALS = {
  section: SECTIONS.TOTALS,
  title: I18N.COMPONENT_LINK_TOTALS,
};

export const BUNDLE_ASSETS_INITIAL_JS = {
  section: SECTIONS.ASSETS,
  title: I18N.COMPONENT_LINK_BUNDLE_ASSETS_INITIAL_JS,
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: false,
        [`${ASSET_ENTRY_TYPE}.${ASSET_FILTERS.INITIAL}`]: true,
        [`${ASSET_FILE_TYPE}.${FILE_TYPE_JS}`]: true,
      },
    },
  },
};

export const BUNDLE_ASSETS_INITIAL_CSS = {
  section: SECTIONS.ASSETS,
  title: I18N.COMPONENT_LINK_BUNDLE_ASSETS_INITIAL_CSS,
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: false,
        [`${ASSET_ENTRY_TYPE}.${ASSET_FILTERS.INITIAL}`]: true,
        [`${ASSET_FILE_TYPE}.${FILE_TYPE_CSS}`]: true,
      },
    },
  },
};

export const BUNDLE_ASSETS_CACHE_INVALIDATION = {
  section: SECTIONS.ASSETS,
  title: I18N.COMPONENT_LINK_BUNDLE_ASSETS_CACHE_INVALIDATION,
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: true,
        ...getAssetEntryTypeFilters(true),
        ...getAssetFileTypeFilters(true),
      },
    },
  },
};

export const BUNDLE_ASSETS_COUNT = {
  section: SECTIONS.ASSETS,
  title: I18N.COMPONENT_LINK_BUNDLE_ASSETS_COUNT,
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: false,
        ...getAssetEntryTypeFilters(true),
        ...getAssetFileTypeFilters(true),
      },
    },
  },
};

export const BUNDLE_ASSETS_CHUNK_COUNT = {
  section: SECTIONS.ASSETS,
  title: I18N.COMPONENT_LINK_BUNDLE_ASSETS_CHUNK_COUNT,
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: false,
        [`${ASSET_ENTRY_TYPE}.${ASSET_FILTERS.CHUNK}`]: true,
        ...getAssetFileTypeFilters(true),
      },
    },
  },
};

export const BUNDLE_MODULES = {
  section: SECTIONS.MODULES,
  title: I18N.COMPONENT_LINK_MODULES,
};

export const BUNLDE_PACKAGES_COUNT = {
  section: SECTIONS.PACKAGES,
  title: I18N.COMPONENT_LINK_PACKAGES_COUNT,
  params: {
    [COMPONENT.BUNDLE_PACKAGES]: {
      filters: {
        [PACKAGE_FILTERS.CHANGED]: false,
      },
    },
  },
};

export const BUNDLE_PACKAGES_DUPLICATE = {
  section: SECTIONS.PACKAGES,
  title: I18N.COMPONENT_LINK_PACKAGES_DUPLICATE,
  params: {
    [COMPONENT.BUNDLE_PACKAGES]: {
      filters: {
        [PACKAGE_FILTERS.CHANGED]: false,
        [PACKAGE_FILTERS.DUPLICATE]: true,
      },
    },
  },
};

export const getBundleAssetsFileTypeComponentLink = (fileType, label) => ({
  section: SECTIONS.ASSETS,
  title: template(I18N.COMPONENT_LINK_BUNDLE_ASSETS_BY_FILE_TYPE)({ label }),
  params: {
    [COMPONENT.BUNDLE_ASSETS]: {
      filters: {
        [ASSET_FILTERS.CHANGED]: false,
        ...getAssetEntryTypeFilters(true),
        ...getAssetFileTypeFilters(false),
        [`${ASSET_FILE_TYPE}.${fileType}`]: true,
      },
    },
  },
});

export const getBundlePackagesByNameComponentLink = (search) => ({
  section: SECTIONS.PACKAGES,
  title: I18N.COMPONENT_LINK_VIEW_PACKAGE,
  params: {
    [COMPONENT.BUNDLE_PACKAGES]: {
      search,
      filters: {
        [PACKAGE_FILTERS.CHANGED]: false,
        [PACKAGE_FILTERS.DUPLICATE]: true,
      },
    },
  },
});

export const METRIC_COMPONENT_LINKS = new Map([
  ['webpack.totalSizeByTypeALL', { link: TOTALS }],
  ['webpack.totalInitialSizeJS', { link: BUNDLE_ASSETS_INITIAL_JS }],
  ['webpack.totalInitialSizeCSS', { link: BUNDLE_ASSETS_INITIAL_CSS }],
  [
    'webpack.cacheInvalidation',
    {
      link: BUNDLE_ASSETS_CACHE_INVALIDATION,
      showDelta: false,
    },
  ],
  ['webpack.assetCount', { link: BUNDLE_ASSETS_COUNT }],
  ['webpack.chunkCount', { link: BUNDLE_ASSETS_CHUNK_COUNT }],
  ['webpack.moduleCount', { link: BUNDLE_MODULES }],
  ['webpack.packageCount', { link: BUNLDE_PACKAGES_COUNT }],
  ['webpack.duplicatePackagesCount', { link: BUNDLE_PACKAGES_DUPLICATE }],
]);