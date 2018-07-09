/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Option Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentOption: number = 0;
  for ( let i in CameraConfig.Options ){
    let enabled = true;
    let option = CameraConfig.Options[i];
    let testOption = toupcam.enum.option[option];

    it( 'Validate get existing option: ' + option, function() {
      let _option:any = toupcam.alloc.Unsigned();
      result = toupcam.lib.Toupcam_get_Option( cam.handle, testOption, _option );
      if ( result != toupcam.enum.hresult.S_OK ){
        enabled = false;
        this.skip();
      }
      expectResult(result);
      expect( _option.deref() ).to.be.at.least( 0 );
      expect( _option.deref() ).to.be.at.most( 1 );
      currentOption = _option.deref();
      // console.log( "\n", option + ":" + currentOption );
    });

    it( 'Set option: ' + option, function() {
      if( !enabled ) this.skip();
      result = toupcam.lib.Toupcam_put_Option( cam.handle, testOption, 1 - currentOption );
      if ( result != toupcam.enum.hresult.S_OK ){
        enabled = false;
        this.skip();
      }
      expectResult(result);
    });

    it( 'Validate set option: ' + option, function() {
      if( !enabled ) this.skip();
      let _option:any = toupcam.alloc.Unsigned();
      result = toupcam.lib.Toupcam_get_Option( cam.handle, testOption, _option );
      expectResult(result);
      expect( _option.deref() ).to.equal( 1 - currentOption );
    });
    it( 'Reset option: ' + option, function() {
      if( !enabled ) this.skip();
      result = toupcam.lib.Toupcam_put_Option( cam.handle, testOption, currentOption );
      expectResult(result);
    });

    it( 'Validate resetting option: ' + option, function() {
      if( !enabled ) this.skip();
      let _option:any = toupcam.alloc.Unsigned();
      result = toupcam.lib.Toupcam_get_Option( cam.handle, testOption, _option );
      expectResult(result);
      expect( _option.deref() ).to.equal( currentOption );
    });
  }

});
