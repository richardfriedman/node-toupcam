
// Basics for building models
const ref = require('ref');
const ffi = require('ffi');
const Struct = require('ref-struct');
const ArrayType = require('ref-array');
const os = require('os');

// type shorthand
const unsigned = ref.types.uint32;
const int = ref.types.int;
const double = ref.types.double;
const ushort = ref.types.ushort;
const char = ref.types.char;
const uchar = ref.types.uchar;
const bool = ref.types.bool;
const Void = ref.types.void;

// Array Types Needed
const String64 = ArrayType( char, 64 );
const CharArray = ArrayType( char );
const UCharArray = ArrayType( uchar );
const IntArray = ArrayType( int );
const UShortArray = ArrayType( ushort );

// Pointers
const IntPtr = ref.refType( int );
const UShortPtr = ref.refType( ushort );
const UCharArrayPtr = ref.refType( UCharArray );
const UnsignedPtr = ref.refType( unsigned );
const BoolPtr = ref.refType( bool );
const Callback = ref.refType(Void);
const VoidPtr = ref.refType(Void);
const NullPtr = ref.NULL_POINTER;
const Null = ref.NULL;

/***************************
   imports from toupcam.h
 ***************************/

// Constants from Toupcam library.
const define = {
  "MAX":                     16,
  "TEMP_DEF":                6503,
  "TEMP_MIN":                2000,
  "TEMP_MAX":                15000,
  "TINT_DEF":                1000,
  "TINT_MIN":                200,
  "TINT_MAX":                2500,
  "HUE_DEF":                 0,
  "HUE_MIN":                 -180,
  "HUE_MAX":                 180,
  "SATURATION_DEF":          128,
  "SATURATION_MIN":          0,
  "SATURATION_MAX":          255,
  "BRIGHTNESS_DEF":          0,
  "BRIGHTNESS_MIN":          -64,
  "BRIGHTNESS_MAX":          64,
  "CONTRAST_DEF":            0,
  "CONTRAST_MIN":            -100,
  "CONTRAST_MAX":            100,
  "GAMMA_DEF":               100,
  "GAMMA_MIN":               20,
  "GAMMA_MAX":               180,
  "AETARGET_DEF":            120,
  "AETARGET_MIN":            16,
  "AETARGET_MAX":            235,
  "WBGAIN_DEF":              0,
  "WBGAIN_MIN":              -128,
  "WBGAIN_MAX":              128,
}

// Definitions for Flags which describe camera ability
const TOUPCAM_FLAGS = {
  "CMOS"               :0x00000001,  /* cmos sensor */
  "CCD_PROGRESSIVE"    :0x00000002,  /* progressive ccd sensor */
  "CCD_INTERLACED"     :0x00000004,  /* interlaced ccd sensor */
  "ROI_HARDWARE"       :0x00000008,  /* support hardware ROI */
  "MONO"               :0x00000010,  /* monochromatic */
  "BINSKIP_SUPPORTED"  :0x00000020,  /* support bin/skip mode, see Toupcam_put_Mode and Toupcam_get_Mode */
  "USB30"              :0x00000040,  /* USB 3.0 */
  "COOLED"             :0x00000080,  /* Cooled */
  "USB30_OVER_USB20"   :0x00000100,  /* usb3.0 camera connected to usb2.0 port */
  "ST4"                :0x00000200,  /* ST4 */
  "GETTEMPERATURE"     :0x00000400,  /* support to get the temperature of sensor */
  "PUTTEMPERATURE"     :0x00000800,  /* support to put the temperature of sensor */
  "BITDEPTH10"         :0x00001000,  /* Maximum Bit Depth = 10 */
  "BITDEPTH12"         :0x00002000,  /* Maximum Bit Depth = 12 */
  "BITDEPTH14"         :0x00004000,  /* Maximum Bit Depth = 14 */
  "BITDEPTH16"         :0x00008000,  /* Maximum Bit Depth = 16 */
  "FAN"                :0x00010000,  /* cooling fan */
  "COOLERONOFF"        :0x00020000,  /* cooler can be turn on or off */
  "ISP"                :0x00040000,  /* image signal processing supported */
  "TRIGGER"            :0x00080000,  /* support the trigger mode */
  isSet: function(flag,value){
    if ( typeof flag == "string "){
      return (TOUPCAM_FLAGS[flag] && (TOUPCAM_FLAGS[flag] & value));
    } else {
      return (flag & value) > 0 ;
    }
  },
  toString: function(value){
    let buffer = [];
    Object.keys( TOUPCAM_FLAGS ).forEach( function(k,v){
      if ( TOUPCAM_FLAGS[k] & value ) buffer.push(k);
    })
    return buffer.join(',');
  }
};

// Events emitted for communicate from camera to code for state of image capture.
const TOUPCAM_EVENTS = {
  "EXPOSURE"      :0x0001,    /* exposure time changed */
  "TEMPTINT"      :0x0002,    /* white balance changed, Temp/Tint mode */
  "CHROME"        :0x0003,    /* reversed, do not use it */
  "IMAGE"         :0x0004,    /* live image arrived, use Toupcam_PullImage to get this image */
  "STILLIMAGE"    :0x0005,    /* snap (still) frame arrived, use Toupcam_PullStillImage to get this frame */
  "WBGAIN"        :0x0006,    /* white balance changed, RGB Gain mode */
  "ERROR"         :0x0080,    /* something error happens */
  "DISCONNECTED"  :0x0081,    /* camera disconnected */
  "UNDOCUMENTED"  :0x0082,    /* camera disconnected */
  isSet: function(flag,value){
    return (TOUPCAM_EVENTS[flag] && (TOUPCAM_EVENTS[flag] & value));
  },
  toString: function(value){
    let result = "UNKNOWN: " + value;
    Object.keys( TOUPCAM_EVENTS ).forEach( function(k,v){
      if ( TOUPCAM_EVENTS[k] == value ) result = k;
    })
    return result;
  }
};

const HZ = {
  "AC60" : 0,
  "AC50" : 1,
  "DC": 2,
  toString: function(value){
    let result = "UNKNOWN: " + value;
    Object.keys( HZ ).forEach( function(k,v){
      if ( HZ[k] == value ) result = k;
    })
    return result;
  },
  getEnum: function(value) {
    let result = null;
    Object.keys( HZ ).forEach( function(k,v){
      if ( HZ[k] == value ) result = k;
    })
    return result;
  }
}

const OPTION = {
  "NOFRAME_TIMEOUT"      :0x01,    /* iValue: 1 = enable; 0 = disable. default: enable */
  "THREAD_PRIORITY"      :0x02,    /* set the priority of the internal thread which grab data from the usb device.
                                      iValue: 0 = THREAD_PRIORITY_NORMAL;
                                      1 = THREAD_PRIORITY_ABOVE_NORMAL;
                                      2 = THREAD_PRIORITY_HIGHEST;
                                      default: 0; see: msdn SetThreadPriority */
  "PROCESSMODE"          :0x03,    /*  0 = better image quality, more cpu usage. this is the default value
                                       1 = lower image quality, less cpu usage */
  "RAW"                  :0x04,    /* raw mode, read the sensor data. This can be set only BEFORE Toupcam_StartXXX() */
  "HISTOGRAM"            :0x05,    /* 0 = only one, 1 = continue mode */
  "BITDEPTH"             :0x06,    /* 0 = 8bits mode, 1 = 16bits mode */
  "FAN"                  :0x07,    /* 0 = turn off the cooling fan, 1 = turn on the cooling fan */
  "COOLER"               :0x08,    /* 0 = turn off cooler, 1 = turn on cooler */
  "LINEAR"               :0x09,    /* 0 = turn off tone linear, 1 = turn on tone linear */
  "CURVE"                :0x0a,    /* 0 = turn off tone curve, 1 = turn on tone curve */
  "TRIGGER"              :0x0b,    /* 0 = continuous mode, 1 = trigger mode, default value =  0 */
  "RGB48"                :0x0c,    /* enable RGB48 format when bitdepth > 8 */
}

const HRESULT_TYPES = {
    "S_OK"         : 0x00000000, /* Operation successful */
    "S_FALSE"      : 0x00000001, /* Operation successful */
    "E_FAIL"       : 0x80004005, /* Unspecified failure */
    "E_INVALIDARG" : 0x80070057, /* One or more arguments are not valid */
    "E_NOTIMPL"    : 0x80004001, /* Not supported or not implemented */
    "E_POINTER"    : 0x80004003, /* Pointer that is not valid */
    "E_UNEXPECTED" : 0x8000FFFF, /* Unexpected failure */
    toString: function(value){
      let result = "UNKNOWN: " + value;
      Object.keys( HRESULT_TYPES ).forEach( function(k,v){
        if ( HRESULT_TYPES[k] == value ) result = k;
      })
      return result;
    }
}

// Types extracted from toupcam.h
const HRESULT = unsigned;

const ToupcamT = Struct({
  'unused':int
});
const HToupCam = ref.refType(ToupcamT);

const ToupcamResolution = Struct({
  'width': unsigned,
  'height': unsigned
});
const ToupcamResolutionPtr = ref.refType(ToupcamResolution);
const ToupcamResolutionArray = ArrayType(ToupcamResolution, define.MAX);

const Rect = Struct({
  'left': int,
  'top': int,
  'right': int,
  'bottom': int,
});
const RectPtr = ref.refType(Rect);

const ToupcamModel = Struct({
  /* model name */
  'name': 'string',
  /* xxx */
  'flag': unsigned,
  /* number of speed level, same as Toupcam_get_MaxSpeed(), the speed range = [0, maxspeed], closed interval */
  'maxspeed': unsigned,
  /* number of preview resolution, same as Toupcam_get_ResolutionNumber() */
  'preview': unsigned,
  /* number of still resolution, same as Toupcam_get_StillResolutionNumber() */
  'still': unsigned,
  /* array of resolutions, max is ToupCam.MAX */
  'res': ToupcamResolutionArray
});
const ToupcamModelPtr = ref.refType(ToupcamModel);

const ToupcamInst = Struct({
  /* display name */
  'displayname': String64,
  /* unique and opaque id of a connected camera, for Toupcam_Open */
  'id': String64,
  /* model data reference */
  'model': ToupcamModelPtr
});
const ToupcamInstPtr = ref.refType(ToupcamInst);
const ToupcamInstArray = ArrayType(ToupcamInst);

const BitmapInfoHeader = Struct({
  biSize: unsigned,
  biWidth: int,
  biHeight: int,
  biPlanes: ushort,
  biBitCount: ushort,
  biCompression: unsigned,
  biSizeImage: unsigned,
  biXPelsPerMeter: int,
  biYPelsPerMeter: int,
  biClrUsed: unsigned,
  biClrImportant: unsigned
});
const BitmapInfoHeaderPtr = ref.refType(BitmapInfoHeader);

/** Expose the methods inside the library to be invoked. */
const arch = os.arch();
const platform = os.platform();
let lib = ( platform == 'darwin' ) ? './sdk/toupcam_macos/touptek/libtoupcam' : `./sdk/${arch}`;
const toupcam = ffi.Library( lib, {
  // Index: Tested
  'Toupcam_Version': [ 'string', [] ],

  // Properties: Tested
  'Toupcam_get_HwVersion': [HRESULT, [HToupCam, CharArray] ],
  'Toupcam_get_FwVersion': [HRESULT, [HToupCam, CharArray] ],
  'Toupcam_get_SerialNumber': [HRESULT, [HToupCam, CharArray] ],
  'Toupcam_get_ProductionDate': [HRESULT, [HToupCam, CharArray] ],
  'Toupcam_get_MaxBitDepth': [HRESULT, [HToupCam] ],
  'Toupcam_get_MonoMode': [HRESULT, [HToupCam] ],
  'Toupcam_get_RawFormat': [HRESULT, [HToupCam, UnsignedPtr /*nFourCC*/, UnsignedPtr /*bitdepth*/ ] ],

  // Camera: Tested
  'Toupcam_Enum': [int, [ToupcamInstArray] ],
  'Toupcam_Open': [ HToupCam, ['string'] ],
  // Toupcam_Open_RGB is added to this library to hide using @ to enable RGB
  // 'Toupcam_Open_RGB': [ HToupCam, ['string'] ],
  'Toupcam_OpenByIndex': [ HToupCam, [int] ],
  'Toupcam_Close': [ Void, [HToupCam] ],
  // Untested HotPlug
  'Toupcam_HotPlug': [Void, [Callback, VoidPtr]],

  // Options: Tested
  'Toupcam_get_Option': [HRESULT, [HToupCam, unsigned, UnsignedPtr ] ],
  'Toupcam_put_Option': [HRESULT, [HToupCam, unsigned, unsigned] ],

  // Speed: Tested
  'Toupcam_get_MaxSpeed': [HRESULT, [HToupCam] ],
  'Toupcam_get_Speed': [HRESULT, [HToupCam, UShortPtr ] ],
  'Toupcam_put_Speed': [HRESULT, [HToupCam, ushort ] ],

  // Temperature: Tested
  //set the temperature of sensor, in 0.1 degrees Celsius (32 means 3.2 degrees Celsius
  'Toupcam_get_Temperature': [HRESULT, [HToupCam, UShortPtr ] ],
  'Toupcam_put_Temperature': [HRESULT, [HToupCam, ushort ] ],

  // Resolution: Tested
  'Toupcam_get_ResolutionNumber': [HRESULT, [HToupCam] ],
  'Toupcam_get_Resolution' : [HRESULT,[HToupCam,unsigned,IntPtr,IntPtr]],
  'Toupcam_get_StillResolutionNumber': [HRESULT, [HToupCam] ],
  'Toupcam_get_StillResolution' : [HRESULT,[HToupCam,unsigned,IntPtr,IntPtr]],
  'Toupcam_get_ResolutionRatio' : [HRESULT,[HToupCam,unsigned,IntPtr,IntPtr]],
  'Toupcam_get_eSize': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_eSize': [HRESULT, [HToupCam, unsigned] ],
  'Toupcam_get_Size' : [HRESULT,[HToupCam, IntPtr, IntPtr]],
  'Toupcam_put_Size' : [HRESULT,[HToupCam, int, int]],

  // Exposure: Tested
  'Toupcam_get_ExpoTime': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_ExpoTime': [HRESULT, [HToupCam, unsigned /* microseconds */ ] ],
  'Toupcam_get_ExpTimeRange': [HRESULT, [HToupCam, IntPtr /*nMin*/, IntPtr /*nMax*/, IntPtr /*nDef*/ ] ],
  'Toupcam_get_AutoExpoEnable': [HRESULT, [HToupCam, BoolPtr /*bAutoExposure*/ ] ],
  'Toupcam_put_AutoExpoEnable': [HRESULT, [HToupCam, bool /*bAutoExposure*/ ] ],
  'Toupcam_get_AutoExpoTarget': [HRESULT, [HToupCam, UShortPtr /*Target*/ ] ],
  'Toupcam_put_AutoExpoTarget': [HRESULT, [HToupCam, ushort /* target */ ] ],
  'Toupcam_put_MaxAutoExpoTimeAGain': [HRESULT, [HToupCam, unsigned /* maxTime */, ushort /* maxAGain */ ] ],
  'Toupcam_get_ExpoAGain': [HRESULT, [HToupCam, UShortPtr /*AGain*/] ],
  'Toupcam_put_ExpoAGain': [HRESULT, [HToupCam, ushort /* AGain */ ] ],
  'Toupcam_get_ExpoAGainRange': [HRESULT, [HToupCam, UShortPtr /*nMin*/, UShortPtr /*nMax*/, UShortPtr /*nDef*/ ] ],
  // Callback is pointer to -> void function(void* pCtx);
  // TODO : have yet to see it invoked properly
  'Toupcam_put_ExpoCallback': [HRESULT, [HToupCam, Callback, VoidPtr] ],

  // hz, light source: Tested
  'Toupcam_get_HZ': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_HZ': [HRESULT, [HToupCam, int] ],

  // Individual Properties: Tested
  'Toupcam_get_Gamma': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_Gamma': [HRESULT, [HToupCam, int] ],
  'Toupcam_get_Hue': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_Hue': [HRESULT, [HToupCam, int] ],
  'Toupcam_get_Saturation': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_Saturation': [HRESULT, [HToupCam, int] ],
  'Toupcam_get_Brightness': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_Brightness': [HRESULT, [HToupCam, int] ],
  'Toupcam_get_Contrast': [HRESULT, [HToupCam, IntPtr] ],
  'Toupcam_put_Contrast': [HRESULT, [HToupCam, int] ],

  // Chrome Mode: Tested
  'Toupcam_get_Chrome': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_Chrome': [HRESULT, [HToupCam, bool] ],
  // Callback is pointer to -> void function(void* pCtx);
  // TODO : have yet to see it invoked properly
  'Toupcam_put_ChromeCallback': [HRESULT, [HToupCam, Callback, VoidPtr] ],

  // Individual Modes: Tested
  'Toupcam_get_Negative': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_Negative': [HRESULT, [HToupCam, bool] ],
  'Toupcam_get_VFlip': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_VFlip': [HRESULT, [HToupCam, bool] ],
  'Toupcam_get_HFlip': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_HFlip': [HRESULT, [HToupCam, bool] ],
  'Toupcam_get_RealTime': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_RealTime': [HRESULT, [HToupCam, bool] ],
  'Toupcam_get_Mode': [HRESULT, [HToupCam, BoolPtr] ],
  'Toupcam_put_Mode': [HRESULT, [HToupCam, bool] ],

  // Temp and Tint: Tested
  'Toupcam_get_TempTint': [HRESULT, [HToupCam, IntPtr, IntPtr ] ],
  'Toupcam_put_TempTint': [HRESULT, [HToupCam, int, int ] ],
  // Callback is pointer to -> void function(const int nTemp, const int nTint, void* pCtx)
  'Toupcam_AwbOnePush': [HRESULT, [HToupCam, Callback, VoidPtr] ],

  // White Balance, RGB Gain mode: Tested
  'Toupcam_get_WhiteBalanceGain': [HRESULT, [HToupCam, IntArray /* aGain */] ],
  'Toupcam_put_WhiteBalanceGain': [HRESULT, [HToupCam, IntArray /* aGain */] ],
  // Callback is pointer to -> void function(const int aGain[3], void* pCtx)
  'Toupcam_AwbInit': [HRESULT, [HToupCam, Callback, VoidPtr] ],

  // LEDState: API works, but don't have model to confirm
  // Led Index, State (1 bright, 2 flashing, 0 off), Flasing period >= 500(ms)
  'Toupcam_put_LEDState': [HRESULT, [HToupCam, ushort, ushort, ushort] ],

  // ROI: Tested
  // xOffset, yOffest, Width, Height  (x and y appear to must be even)
  'Toupcam_put_Roi': [HRESULT,[HToupCam, unsigned, unsigned, unsigned, unsigned ]],
  'Toupcam_get_Roi': [HRESULT,[HToupCam, UnsignedPtr, UnsignedPtr, UnsignedPtr, UnsignedPtr ]],

  // AutoExposure ROI: Tested
  'Toupcam_get_AEAuxRect': [HRESULT, [HToupCam, RectPtr ] ],
  'Toupcam_put_AEAuxRect': [HRESULT, [HToupCam, RectPtr ] ],

  // Auto-WhiteBalance ROI: Tested
  'Toupcam_get_AWBAuxRect': [HRESULT, [HToupCam, RectPtr ] ],
  'Toupcam_put_AWBAuxRect': [HRESULT, [HToupCam, RectPtr ] ],

  // LevelRange: Tested
  'Toupcam_get_LevelRange': [HRESULT, [HToupCam, UShortArray /*aLow*/, UShortArray /*aHigh*/] ],
  'Toupcam_put_LevelRange': [HRESULT, [HToupCam, UShortArray /*aLow*/, UShortArray /*aHigh*/] ],
  // TODO Not-Tested
  'Toupcam_LevelRangeAuto': [HRESULT, [HToupCam] ],

  // TODO Untested: astronomy: only for ST4 guide, please see: ASCOM Platform Help ITelescopeV3
  'Toupcam_ST4PlusGuide': [HRESULT,[HToupCam, unsigned /*nDirect*/, unsigned /*nDuration*/ ]],
  'Toupcam_ST4PlusGuideState' : [HRESULT,[HToupCam]],

  // EEPROM: TODO find model to test.
  'Toupcam_read_EEPROM' : [HRESULT,[HToupCam, unsigned, UCharArrayPtr, unsigned]],
  'Toupcam_write_EEPROM' : [HRESULT,[HToupCam, unsigned, UCharArrayPtr, unsigned]],

  // TODO, no testing.
  'Toupcam_calc_ClarityFactor' : [double,[VoidPtr /*image*/, int /*bits*/, unsigned /*w*/, unsigned /*h*/]],
  'Toupcam_deBayer' : [Void,[HToupCam, unsigned /*nBayer*/, int /*nW*/, int /*nH*/, VoidPtr /*input*/, VoidPtr /*output*/, unsigned /*bitDepth*/ ]],

  /** **** Pull Mode Image Taking Functions **** Tested */
  // Callback is pointer to -> void function(const void* pData, const BITMAPINFOHEADER* pHeader, BOOL bSnap, void* pCallbackCtx)
  'Toupcam_StartPushMode': [HRESULT,[HToupCam, Callback, VoidPtr ]],
  // Callback is pointer to -> void function(unsigned nEvent, void* pCallbackCtx);
  'Toupcam_StartPullModeWithCallback': [HRESULT,[HToupCam, Callback, VoidPtr ]],
  // Pull functions ( HToupCam, ImageData, bits, width, height );
  'Toupcam_PullImage': [HRESULT,[HToupCam, VoidPtr, int, IntPtr, IntPtr]],
  'Toupcam_PullStillImage': [HRESULT,[HToupCam, VoidPtr, int, IntPtr, IntPtr]],
  'Toupcam_Snap' : [HRESULT,[HToupCam, unsigned]],
  'Toupcam_Trigger' : [HRESULT,[HToupCam]], // Not sure how to test.
  'Toupcam_Stop' : [HRESULT,[HToupCam]], // Not sure how to test.
  'Toupcam_Pause' : [HRESULT,[HToupCam, bool]], // Not sure how to test.
  'Toupcam_Flush': [HRESULT, [HToupCam] ],

  // Only called when Push or Pull started.
  // Callback is pointer to -> void function(const double aHistY[256], const double aHistR[256], const double aHistG[256], const double aHistB[256], void* pCtx)
  'Toupcam_GetHistogram': [HRESULT, [HToupCam, Callback, VoidPtr] ],

});
/**
 * Open camera with RGB mode enabled.  Function added to hide the using
 * '@' to enable RGB mode.
 *
 * @parameter string cameraId returned from enum
 * @return HToupCam
 */
toupcam.Toupcam_Open_RGB = function( cameraId ){
  return this.Toupcam_Open( '@' + cameraId );
}

/**
 * Pull mode callback reference to pass to Toupcam_StartPullModeWithCallback
 * @param callback Implement callback of void function( EVENT: int, CONTEXT: object )
 * @return pointer to callback function reference. ref.type(ref.types.Function)
 */
const pullModeCallback = function( callback ){
  return ffi.Callback( Void, [  unsigned, VoidPtr ] , callback );
}

/**
 * Push mode callback reference to pass to Toupcam_StartPushMode
 * @param callback Implement callback of void function( ImageData: void *, BitmapHeader: BITMAPINFOHEADER, bSnap: Bool, Context: Object )
 * @return pointer to callback function reference. ref.type(ref.types.Function)
 */
const pushModeCallback = function( callback ){
  return ffi.Callback( Void, [ VoidPtr, BitmapInfoHeaderPtr, bool, VoidPtr ], callback );
}

/**
 * Chrome Mode callback reference, to pass to Toupcam_put_ChromeCallback
 * @param callback Implement callback of void function (Context: Object)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const chromeCallback = function( callback ){
  return ffi.Callback( Void, [ VoidPtr ], callback );
}

/**
 * Exposure Mode callback reference, to pass to Toupcam_put_ExpoCallback
 * @param callback Implement callback of void function (Context: Object)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const expoCallback = function( callback ){
  return ffi.Callback( Void, [ VoidPtr ], callback );
}

/**
 * Exposure Mode callback reference, to pass to Toupcam_GetHistogram
 * @param callback Implement callback of void function(const double aHistY[256], const double aHistR[256], const double aHistG[256], const double aHistB[256], void* pCtx)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const histogramCallback = function( callback ){
  // const double aHistY[256], const double aHistR[256], const double aHistG[256], const double aHistB[256], void* pCtx)
  const d256 = ArrayType( double, 256 );
  return ffi.Callback( Void, [ d256, d256, d256, d256 , VoidPtr], callback );
}

/**
 * Exposure Mode callback reference, to pass to Toupcam_AwbInit
 * @param callback Implement callback of void function(const int aGain[3], void* pCtx)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const awbCallback = function( callback ){
  return ffi.Callback( Void, [ ArrayType( int, 3 ), VoidPtr], callback );
}

/**
 * Exposure Mode callback reference, to pass to Toupcam_AwbOnePush
 * @param callback Implement callback of void function(const int nTemp, const int nTint, void* pCtx)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const tempTintCallback = function( callback ){
  return ffi.Callback( Void, [ int, int, VoidPtr], callback );
}

/**
 * Exposure Mode callback reference, to pass to Toupcam_HotPlug
 * @param callback Implement callback of void function (Context: Object)
 * @return pointer to callback function reference ref.type(ref.types.Function)
 */
const hotPlugCallback = function( callback ){
  return ffi.Callback( Void, [ VoidPtr ], callback );
}

/** Convert char representation into number, ie GBRG =1196573255, @see http://fourcc.org/ */
const makeFourCC = function( a ){
   return a.charCodeAt(0) | (a.charCodeAt(1) << 8) | (a.charCodeAt(2) << 16) | (a.charCodeAt(3) << 24);
}

module.exports.lib = toupcam;
module.exports.Cameras = new ToupcamInstArray(16);
module.exports.NullPtr = NullPtr;
module.exports.Null = Null;

// Create References for Type.
module.exports.alloc = {
  IntArray: function(s){ return new IntArray(s) },
  UShortArray: function(s){ return new UShortArray(s) },
  CharArray: function(s){ return new CharArray(s) },
  UCharArray: function(s){ return new UCharArray(s) },
  UCharArrayPtr: function(s){ return ref.alloc( ArrayType( uchar, s ) ); },
  Object: function(obj){ return ref.alloc(ref.types.Object, obj) },
  Integer: function(){ return ref.alloc(int) },
  Unsigned: function(){ return ref.alloc(unsigned) },
  UShort: function(){ return ref.alloc(ushort) },
  Boolean: function(){ return ref.alloc(bool) },
  Rect: function(){ return ref.alloc(Rect) },
  Image: function( w, h ){ return ref.alloc({ size: w * h * 4, indirection: 1 }); },
  Pointer: function(o){ return ref.ref(o.buffer); }
}

// Access to Enumerations and constants.
module.exports.define = define;
module.exports.enum = {
  flags : TOUPCAM_FLAGS,
  events: TOUPCAM_EVENTS,
  hresult: HRESULT_TYPES,
  hz: HZ,
  option: OPTION
}
// Access to functions to create reference to your callback.
// example -  callback.Chrome( function(context){ /* code */ });
module.exports.callback = {
  PullMode: pullModeCallback,
  Chrome: chromeCallback,
  Exposure: expoCallback,
  PushMode: pushModeCallback,
  Histogram: histogramCallback,
  HotPlug: hotPlugCallback,
  AutoWhiteBalance: awbCallback,
  TempTint: tempTintCallback,
}
module.exports.getError = HRESULT_TYPES.toString;
module.exports.makeFourCC = makeFourCC;
