/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera HZ LightSource Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentHZ: number = null;
  it( 'Validate get existing hz.', () => {
    let _hz:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_HZ( cam.handle, _hz );
    expectResult(result);
    expect( toupcam.enum.hz.getEnum(_hz.deref()) ).to.not.be.null;
    currentHZ = _hz.deref();
  });

  let newHZ: number = null;
  it( 'Validate setting hz.', () => {
    newHZ = ( currentHZ == toupcam.enum.hz.DC ) ? toupcam.enum.hz.AC60 : toupcam.enum.hz.DC;
    result = toupcam.lib.Toupcam_put_HZ( cam.handle, newHZ );
    expectResult(result);
  });

  it( 'Validate if hz was set properly.', () => {
    let _hz:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_HZ( cam.handle, _hz );
    expectResult(result);
    expect( _hz.deref() ).to.equal( newHZ );
  });

  it( 'Reset hz.', () => {
    result = toupcam.lib.Toupcam_put_HZ( cam.handle, currentHZ );
    expectResult(result);
  });

  it( 'Validate resetting hz.', () => {
    let _hz:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_HZ( cam.handle, _hz );
    expectResult(result);
    expect( _hz.deref() ).to.equal( currentHZ );
  });

});
