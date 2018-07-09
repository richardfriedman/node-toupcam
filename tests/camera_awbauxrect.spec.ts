/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera AWBAuxRect Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentPtr:any = 0;
  it( 'Validate get existing awbauxrect.', () => {
    let _rect:any = toupcam.alloc.Rect();
    result = toupcam.lib.Toupcam_get_AWBAuxRect( cam.handle, _rect );
    expectResult(result);
    expect( _rect.deref().left ).to.be.lessThan( _rect.deref().right );
    expect( _rect.deref().top ).to.be.lessThan( _rect.deref().bottom );
    currentPtr = _rect;
  });

  let newPtr:any = null;
  it( 'Validate setting awbauxrect.', () => {
    newPtr = toupcam.alloc.Rect();
    newPtr.deref().left = Math.floor(currentPtr.deref().left / 2);
    newPtr.deref().right = Math.floor(currentPtr.deref().right / 2);
    newPtr.deref().top = Math.floor(currentPtr.deref().top / 2);
    newPtr.deref().bottom = Math.floor(currentPtr.deref().bottom / 2);
    result = toupcam.lib.Toupcam_put_AWBAuxRect( cam.handle, newPtr );
    expectResult(result);
  });

  it( 'Validate if awbauxrect was set properly.', () => {
    let _rect:any = toupcam.alloc.Rect();
    result = toupcam.lib.Toupcam_get_AWBAuxRect( cam.handle, _rect );
    expectResult(result);
    _rect = _rect.deref();
    expect( _rect.left ).to.equal( newPtr.deref().left );
    expect( _rect.right ).to.equal( newPtr.deref().right );
    expect( _rect.top ).to.equal( newPtr.deref().top );
    expect( _rect.bottom ).to.equal( newPtr.deref().bottom );
  });

  it( 'Reset awbauxrect.', () => {
    result = toupcam.lib.Toupcam_put_AWBAuxRect( cam.handle, currentPtr );
    expectResult(result);
  });

  it( 'Validate resetting awbauxrect.', () => {
    let _rect:any = toupcam.alloc.Rect();
    result = toupcam.lib.Toupcam_get_AWBAuxRect( cam.handle, _rect );
    expectResult(result);
    _rect = _rect.deref();
    expect( _rect.left ).to.equal( currentPtr.deref().left );
    expect( _rect.right ).to.equal( currentPtr.deref().right );
    expect( _rect.top ).to.equal( currentPtr.deref().top );
    expect( _rect.bottom ).to.equal( currentPtr.deref().bottom );
  });

});
