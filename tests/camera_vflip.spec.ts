/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera VFlip Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentVFlip: boolean = null;
  it( 'Validate get vflip mode.', () => {
    let _vflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_VFlip( cam.handle, _vflip );
    expectResult(result);
    expect( _vflip.deref() ).to.be.a('boolean');
    currentVFlip = _vflip.deref();
  });

  it( 'Validate setting vflip.', () => {
    result = toupcam.lib.Toupcam_put_VFlip( cam.handle, !currentVFlip );
    expectResult(result);
  });

  it( 'Validate if vflip was set properly.', () => {
    let _vflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_VFlip( cam.handle, _vflip );
    expectResult(result);
    expect( _vflip.deref() ).to.equal( !currentVFlip );
  });

  it( 'Reset vflip.', () => {
    result = toupcam.lib.Toupcam_put_VFlip( cam.handle, currentVFlip );
    expectResult(result);
  });

  it( 'Validate resetting vflip.', () => {
    let _vflip:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_VFlip( cam.handle, _vflip );
    expectResult(result);
    expect( _vflip.deref() ).to.equal( currentVFlip );
  });

});
