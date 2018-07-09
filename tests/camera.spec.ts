
/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

/**
 * Tests are meant to run against my Toupek,
 * Adjust test config for your camera.
 */
describe ('Camera Object Access', () => {

  new CameraPrep();
  
  /** Validate types in _h.js we use. */
  it( 'Validate Char Array 16', () => {
    let string16:any = toupcam.alloc.CharArray(16);
    expect( string16.length ).is.equal(16);
  });

  it( 'Validate Char Array 32', () => {
    let string32:any = toupcam.alloc.CharArray(32);
    expect( string32.length ).is.equal(32);
  });

  let CameraCount:number = 0;
  it( 'Load camera object.', () => {
    CameraCount = toupcam.lib.Toupcam_Enum( toupcam.Cameras );
    expect(CameraCount).to.be.a('number');
    expect(CameraCount).to.equal(1);
  });

  let camera:any = null;
  it( 'should have camera' , () => {
    camera = toupcam.Cameras[0];
    expect(camera).to.be.an('object').that.is.not.empty;
  });

  let model:any = null;
  it( 'should have model' , () => {
    model = camera.model.deref();
    expect(model).to.be.an('object').that.is.not.empty;
  });

  it( 'should have Display Name', () => {
    expect(camera.displayname.buffer.readCString()).to.equal(CameraConfig.DisplayName);
  })

  it( 'should have Camera Id', () => {
    expect(camera.id.buffer.readCString()).to.equal(CameraConfig.CameraId);
  })

  it( 'should have model.name', () => {
    expect(model.name).to.equal(CameraConfig.ModelName);
  })

  it( 'should have model.flag', () => {
    // console.log( toupcam.enum.flags.toString( model.flag ) );
    expect(model.flag).to.equal(CameraConfig.ModelFlag);
  })

  it( 'should have model.maxspeed', () => {
    expect(model.maxspeed).to.equal(CameraConfig.ModelMaxSpeed);
  })

  it( 'should have model.preview', () => {
    expect(model.preview).to.equal(CameraConfig.ModelPreview);
  })

  it( 'should have model.still', () => {
    expect(model.still).to.equal(CameraConfig.ModelStill);
  })

  it( 'should have model.res', () => {
    expect(model.res.length).greaterThan(CameraConfig.ModelRes.length-1);
    for( let i = 0; i < model.res.length; i++ ){
      if ( i < CameraConfig.ModelRes.length ) {
        expect( model.res[i].width ).to.equal(CameraConfig.ModelRes[i][0]);
        expect( model.res[i].height ).to.equal(CameraConfig.ModelRes[i][1]);
      } else {
        expect( model.res[i].width ).to.equal(0);
        expect( model.res[i].height ).to.equal(0);
      }
    }
  })

  it( 'should be able to open camera from id', () => {
    // Should be type toupcam.ToupcamT
    let handle: any = toupcam.lib.Toupcam_Open( camera.id.buffer.readCString() );
    expect( handle ).to.not.be.empty;
    expect( handle.deref().unused ).to.be.greaterThan( 0 );
    toupcam.lib.Toupcam_Close(handle);
  })

  it( 'should be able to open camera from index', () => {
    // Should be type toupcam.ToupcamT
    let handle: any = toupcam.lib.Toupcam_OpenByIndex( 0 );
    expect( handle ).to.not.be.empty;
    expect( handle.deref().unused ).to.be.greaterThan( 0 );
    toupcam.lib.Toupcam_Close(handle);
  })

  it( 'flush frames', () => {
    // Should be type toupcam.ToupcamT
    let handle: any = toupcam.lib.Toupcam_OpenByIndex( 0 );
    expect( handle ).to.not.be.empty;
    expect( handle.deref().unused ).to.be.greaterThan( 0 );
    let result = toupcam.lib.Toupcam_Flush( handle );
    expect( result, toupcam.getError(result) ).to.equal( 0 );
    toupcam.lib.Toupcam_Close(handle);
  })

});
