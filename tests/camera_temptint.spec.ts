/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera TempTint Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentTemp: number = 0;
  let currentTint: number = 0;
  it( 'Validate get existing temptint.', () => {
    let _temp:any = toupcam.alloc.Integer();
    let _tint:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_TempTint( cam.handle, _temp, _tint );
    expectResult(result);
    expect( _temp.deref() ).to.be.at.least(toupcam.define.TEMP_MIN).and.at.most(toupcam.define.TEMP_MAX);
    expect( _tint.deref() ).to.be.at.least(toupcam.define.TINT_MIN).and.at.most(toupcam.define.TINT_MAX);
    currentTemp = _temp.deref();
    currentTint = _tint.deref();
  });

  let newTemp: number = 0;
  let newTint: number = 0;
  it( 'Validate setting temptint.', () => {
    newTemp = ( currentTemp == toupcam.define.TEMP_DEF ) ? toupcam.define.TEMP_MAX : toupcam.define.TEMP_DEF;
    newTint = ( currentTint == toupcam.define.TINT_DEF ) ? toupcam.define.TINT_MAX : toupcam.define.TINT_DEF;
    result = toupcam.lib.Toupcam_put_TempTint( cam.handle, newTemp, newTint );
    expectResult(result);
  });

  it( 'Validate if temptint was set properly.', () => {
    let _temp:any = toupcam.alloc.Integer();
    let _tint:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_TempTint( cam.handle, _temp, _tint );
    expectResult(result);
    expect( _temp.deref() ).to.equal( newTemp );
    expect( _tint.deref() ).to.equal( newTint );
  });

  it( 'Reset temptint.', () => {
    result = toupcam.lib.Toupcam_put_TempTint( cam.handle, currentTemp, currentTint );
    expectResult(result);
  });

  it( 'Validate resetting temptint.', () => {
    let _temp:any = toupcam.alloc.Integer();
    let _tint:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_TempTint( cam.handle, _temp, _tint );
    expectResult(result);
    expect( _temp.deref() ).to.equal( currentTemp );
    expect( _tint.deref() ).to.equal( currentTint );
  });

});
