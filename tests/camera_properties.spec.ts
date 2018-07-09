/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Properties Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;
  it( 'Validate hardware version', () => {
    let _string:any = toupcam.alloc.CharArray(16);
    result = toupcam.lib.Toupcam_get_HwVersion( cam.handle, _string );
    expectResult(result);
    expect( _string.buffer.readCString() ).to.equal( CameraConfig.HardwareVersion );
  });

  it( 'Validate firmware version', () => {
    let _string:any = toupcam.alloc.CharArray(16);
    result = toupcam.lib.Toupcam_get_FwVersion( cam.handle, _string );
    expectResult(result);
    expect( _string.buffer.readCString() ).to.equal( CameraConfig.FirmwareVersion );
  });

  it( 'Validate serial number', () => {
    let _string:any = toupcam.alloc.CharArray(32);
    result = toupcam.lib.Toupcam_get_SerialNumber( cam.handle, _string );
    expectResult(result);
    expect( _string.buffer.readCString() ).to.equal( CameraConfig.SerialNumber );
  });

  it( 'Validate production date.', () => {
    let _string:any = toupcam.alloc.CharArray(10);
    result = toupcam.lib.Toupcam_get_ProductionDate( cam.handle, _string );
    expectResult(result);
    expect( _string.buffer.readCString() ).to.equal( CameraConfig.ProductionDate );
  });

  it( 'Get MaxBitDepth.', () => {
    result = toupcam.lib.Toupcam_get_MaxBitDepth( cam.handle );
    expect( result ).to.equal( CameraConfig.PixelDepth );
  });

  it( 'Get MonoMode.', () => {
    result = toupcam.lib.Toupcam_get_MonoMode( cam.handle );
    expect( result ).to.equal( CameraConfig.MonoMode );
  });

  it( 'Validate raw format', () => {
    let format:any = toupcam.alloc.Unsigned();
    let depth:any = toupcam.alloc.Unsigned();
    result = toupcam.lib.Toupcam_get_RawFormat( cam.handle, format, depth );
    expectResult(result);
    expect( depth.deref() ).to.equal( CameraConfig.PixelDepth );
    expect( format.deref() ).to.equal( toupcam.makeFourCC(CameraConfig.RawFormat) );
  });
});
