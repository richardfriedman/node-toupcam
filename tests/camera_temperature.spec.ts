/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Temperature Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;
  let get:boolean = false;
  let set:boolean = false;
  it( 'Check get and Set temp in Flags', () => {
    let flag: number = toupcam.Cameras[0].model.deref().flag;
    get = toupcam.enum.flags.isSet(toupcam.enum.flags.GETTEMPERATURE,flag);
    set = toupcam.enum.flags.isSet(toupcam.enum.flags.SETTEMPERATURE,flag)
  });

  let currentTemperature: number = 0;
  it( 'Validate get existing temperature.', function() {
    if ( !get ) this.skip();
    expect( get ).to.be.true;
    let _temperature:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_Temperature( cam.handle, _temperature );
    expectResult(result);
    expect( _temperature.deref() ).to.be.at.least( toupcam.define.TEMP_MIN * 10);
    expect( _temperature.deref() ).to.be.at.most( toupcam.define.TEMP_MAX * 10);
    currentTemperature = _temperature.deref();
  });

  let newTemperature: number = 0;
  it( 'Validate setting temperature.', function() {
    if ( !set ) this.skip();
    expect( set ).to.be.true;
    newTemperature = ( currentTemperature == toupcam.define.TEMP_DEF ) ? toupcam.define.TEMP_MIN : toupcam.define.TEMP_DEF;
    result = toupcam.lib.Toupcam_put_Temperature( cam.handle, newTemperature );
    expectResult(result);
  });

  it( 'Validate if temperature was set properly.', function() {
    if ( !set ) this.skip();
    expect( set ).to.be.true;
    let _temperature:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Temperature( cam.handle, _temperature );
    expectResult(result);
    expect( _temperature.deref() ).to.equal( newTemperature );
  });

  it( 'Reset temperature.', function() {
    if ( !set ) this.skip();
    expect( set ).to.be.true;
    result = toupcam.lib.Toupcam_put_Temperature( cam.handle, currentTemperature );
    expectResult(result);
  });

  it( 'Validate resetting temperature.', function() {
    if ( !set ) this.skip();
    expect( set ).to.be.true;
    let _temperature:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Temperature( cam.handle, _temperature );
    expectResult(result);
    expect( _temperature.deref() ).to.equal( currentTemperature );
  });

});
