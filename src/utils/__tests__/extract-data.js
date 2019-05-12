import { extractDataFromWebpackStats } from '../extract-data';

test('Extract data from webpack stats', () => {
  const actual = extractDataFromWebpackStats({
    assets: [
      {
        chunkNames: ['main'],
        chunks: [1],
        emitted: true,
        name: 'main.css',
        size: 10000,
      },
      {
        chunkNames: ['main'],
        chunks: [1],
        emitted: true,
        name: 'main.css.map',
        size: 28041,
      },
      {
        chunkNames: ['main'],
        chunks: [1],
        emitted: true,
        name: 'main.js',
        size: 50000,
      },
      {
        chunkNames: ['main'],
        chunks: [1],
        emitted: true,
        name: 'main.js.map',
        size: 10000,
      },
      {
        chunkNames: [],
        chunks: [],
        emitted: true,
        name: 'logo.png',
        size: 1000,
      },
      {
        chunkNames: [],
        chunks: [],
        emitted: true,
        name: 'index.html',
        size: 2000,
      },
    ],
    chunks: [
      {
        children: [],
        childrenByOrder: {},
        entry: true,
        filteredModules: 0,
        hash: '2c2ca373295fea0a2cc8',
        id: 1,
        initial: true,
        modules: [],
        files: [
          'main.css',
          'main.js',
        ],
        names: ['main'],
        origins: [],
        parents: [],
        rendered: true,
        siblings: [1],
        size: 60000,
      },
    ],
    entrypoints: {
      main: {
        assets: [
          'main.css',
          'main.css.map',
          'main.js',
          'main.js.map',
        ],
        childAssets: {},
        children: {},
        chunks: [1, 0],
      },
    },
    modules: [
      {
        assets: [],
        built: true,
        cacheable: true,
        chunks: [1],
        depth: 11,
        errors: 0,
        failed: false,
        id: 0,
        index: 500,
        index2: 491,
        issuerId: null,
        issuerPath: [],
        name: 'module-a',
        optional: false,
        prefetched: false,
        providedExports: null,
        size: 1000,
        usedExports: true,
        warnings: 0,
      },
      {
        assets: [],
        built: true,
        cacheable: true,
        chunks: [1],
        depth: 11,
        errors: 0,
        failed: false,
        id: 0,
        index: 500,
        index2: 491,
        issuerId: null,
        issuerPath: [],
        name: 'module-b',
        optional: false,
        prefetched: false,
        providedExports: null,
        size: 2000,
        usedExports: true,
        warnings: 0,
      },
    ],
  });

  const expected = {
    assets: [
      {
        name: 'main.css',
        size: 10000,
      },
      {
        name: 'main.js',
        size: 50000,
      },
      {
        name: 'logo.png',
        size: 1000,
      },
      {
        name: 'index.html',
        size: 2000,
      },
    ],
    chunks: [
      {
        entry: true,
        id: 1,
        initial: true,
        files: [
          'main.css',
          'main.js',
        ],
        names: ['main'],
      },
    ],
    entrypoints: {
      main: {
        assets: [
          'main.css',
          'main.css.map',
          'main.js',
          'main.js.map',
        ],
      },
    },
    modules: [
      {
        chunks: [1],
        name: 'module-a',
        size: 1000,
      },
      {
        chunks: [1],
        name: 'module-b',
        size: 2000,
      },
    ],
  };

  expect(expected).toEqual(actual);
});
