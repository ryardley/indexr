import sinon from 'sinon';
import chokidar from 'chokidar';
import indexr from '../../lib';
import { assert } from 'chai';
import { paths } from '../lib/utils';
const { fractalFolder } = paths;

export default () => {
  it('should run the file watcher', () => {
    const onEventSpy = sinon.spy((tag, func) => func());
    sinon.stub(chokidar, 'watch', () => ({ on: onEventSpy }));

    indexr(fractalFolder, 'thing.js', {
      watch: '**/foo/*',
    });

    assert(chokidar.watch.withArgs('**/foo/*', { ignored: ['**/modules/thing.js'] }).calledOnce, 'Chockidar was not called with the correct args.');
    assert(onEventSpy.withArgs('all').calledOnce);
    chokidar.watch.restore();
  });

  it('should run the file watcher on **/* with watch: true', () => {
    sinon.stub(chokidar, 'watch', () => ({ on: () => {} }));

    indexr(fractalFolder, 'thing.js', {
      watch: true,
    });

    assert(chokidar.watch.withArgs('**/*', { ignored: ['**/modules/thing.js'] }).calledOnce, 'Chockidar was not called with the correct args.');
    chokidar.watch.restore();
  });

};
