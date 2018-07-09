/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Contrast Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentContrast: number = 0;
  it( 'Validate get existing contrast.', () => {
    let _contrast:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Contrast( cam.handle, _contrast );
    expectResult(result);
    expect( _contrast.deref() ).to.be.at.least( toupcam.define.CONTRAST_MIN );
    expect( _contrast.deref() ).to.be.at.most( toupcam.define.CONTRAST_MAX );
    currentContrast = _contrast.deref();
  });

  let newContrast: number = 0;
  it( 'Validate setting contrast.', () => {
    newContrast = ( currentContrast == toupcam.define.CONTRAST_DEF ) ? toupcam.define.CONTRAST_MAX : toupcam.define.CONTRAST_DEF;
    result = toupcam.lib.Toupcam_put_Contrast( cam.handle, newContrast );
    expectResult(result);
  });

  it( 'Validate if contrast was set properly.', () => {
    let _contrast:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Contrast( cam.handle, _contrast );
    expectResult(result);
    expect( _contrast.deref() ).to.equal( newContrast );
  });

  it( 'Reset contrast.', () => {
    result = toupcam.lib.Toupcam_put_Contrast( cam.handle, currentContrast );
    expectResult(result);
  });

  it( 'Validate resetting contrast.', () => {
    let _contrast:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Contrast( cam.handle, _contrast );
    expectResult(result);
    expect( _contrast.deref() ).to.equal( currentContrast );
  });

});
