/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera HFlip Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentHFlip: boolean = null;
  it( 'Validate get hflip mode.', () => {
    let _hflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_HFlip( cam.handle, _hflip );
    expectResult(result);
    expect( _hflip.deref() ).to.be.a('boolean');
    currentHFlip = _hflip.deref();
  });

  it( 'Validate setting hflip.', () => {
    result = toupcam.lib.Toupcam_put_HFlip( cam.handle, !currentHFlip );
    expectResult(result);
  });

  it( 'Validate if hflip was set properly.', () => {
    let _hflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_HFlip( cam.handle, _hflip );
    expectResult(result);
    expect( _hflip.deref() ).to.equal( !currentHFlip );
  });

  it( 'Reset hflip.', () => {
    result = toupcam.lib.Toupcam_put_HFlip( cam.handle, currentHFlip );
    expectResult(result);
  });

  it( 'Validate resetting hflip.', () => {
    let _hflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_HFlip( cam.handle, _hflip );
    expectResult(result);
    expect( _hflip.deref() ).to.equal( currentHFlip );
  });

});
