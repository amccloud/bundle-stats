import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import { merge } from 'lodash';
import { advanceTo } from 'jest-date-mock';

import { BundleStatsWebpackPlugin } from '../webpack-plugin';

advanceTo(new Date(2020, 10, 30));

jest.setTimeout(10 * 1000);

const BASE_CONFIG = {
  mode: 'production',
  context: path.join(__dirname, '../../test/package/app'),
};

describe('webpack plugin', () => {
  test('default config', (done) => {
    expect.assertions(3);

    const compiler = webpack(
      merge({}, BASE_CONFIG, {
        plugins: [new BundleStatsWebpackPlugin()],
      }),
    );
    compiler.outputFileSystem = new MemoryFS();

    compiler.run((error, stats) => {
      expect(error).toEqual(null);
      expect(stats.hasErrors()).toBe(false);
      const { assets } = stats.toJson({ source: false, assets: true });
      const bundleStatsAsset = assets.find((asset) => asset.name.match(/bundle-stats\.html$/));
      expect(bundleStatsAsset).toBeTruthy();
      done();
    });
  });

  test('baseline', (done) => {
    expect.assertions(3);

    const compiler = webpack(
      merge({}, BASE_CONFIG, {
        plugins: [new BundleStatsWebpackPlugin({ baseline: true })],
      }),
    );
    compiler.outputFileSystem = new MemoryFS();

    compiler.run((error, stats) => {
      expect(error).toEqual(null);
      expect(stats.hasErrors()).toBe(false);
      const { assets } = stats.toJson({ source: false, assets: true });
      const bundleStatsAsset = assets.find((asset) => asset.name.match(/bundle-stats\.html$/));
      expect(bundleStatsAsset).toBeTruthy();
      done();
    });
  });

  test('with module federation remote entry', (done) => {
    expect.assertions(2);

    const compiler = webpack(
      merge({}, BASE_CONFIG, {
        entry: {},
        plugins: [
          new BundleStatsWebpackPlugin({ baseline: true }),
          new webpack.container.ModuleFederationPlugin({
            name: 'app',
            filename: 'remoteEntry.js',
            exposes: {
                'Index': './src/index.js'
            },
            // shared
          })
        ],
      }),
    );

    compiler.outputFileSystem = new MemoryFS();
    compiler.run((_, stats) => {
      const { assets, chunks } = stats.toJson({ source: false, assets: true });
      const remoteEntryAsset = assets.find((asset) => asset.name.match(/remoteEntry\.js$/));
      const remoteEntryChunks = remoteEntryAsset.chunks.map((chunkId) => chunks.find(chunk => chunk.id === chunkId));
      const remoteEntryChildren = remoteEntryChunks[0].children.map((chunkId) => chunks.find(chunk => chunk.id === chunkId));
      const remoteEntryGrandChildren = remoteEntryChildren[0].children.map((chunkId) => chunks.find(chunk => chunk.id === chunkId));
      expect(remoteEntryChildren[0].initial).toBeTruthy();
      expect(remoteEntryGrandChildren[0].initial).toBeTruthy(); // Not sure?
      done();
    });
  });
});
