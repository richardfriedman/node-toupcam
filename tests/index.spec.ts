
/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Version', () => {
  it('Check library version number', () => {
    new CameraPrep();
    const result = toupcam.lib.Toupcam_Version();
    expect(result).to.equal( CameraConfig.LibraryVersion );
  })
});
