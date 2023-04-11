package com.example.app;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.os.Vibrator;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.webkit.ConsoleMessage;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.mbientlab.metawear.MetaWearBoard;
import com.mbientlab.metawear.Route;
import com.mbientlab.metawear.android.BtleService;
import com.mbientlab.metawear.data.Quaternion;
import com.mbientlab.metawear.module.SensorFusionBosch;
import com.nix.nixsensor_lib.IDeviceListener;
import com.nix.nixsensor_lib.NixDevice;
import com.nix.nixsensor_lib.NixDeviceCommon;
import com.nix.nixsensor_lib.NixDeviceScanner;
import com.nix.nixsensor_lib.NixScannedColor;
import com.nix.nixsensor_lib.NixScannedSpectralData;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;

import bolts.Continuation;
import bolts.Task;

//import android.support.v7.app.AppCompatActivity;
//import com.mbientlab.bletoolbox.scanner.BleScannerFragment;
//import com.mbientlab.metawear.module.Gpio;


public class MainActivity extends AppCompatActivity implements ServiceConnection {

    private static final String TAG = com.example.app.MainActivity.class.getSimpleName();
    private static final int PERMISSION_REQUEST_BLUETOOTH = 1000;
    private NixDevice sensor;
    private ArrayList<NixScannedColor> mScannedColors;
    private ArrayList<BluetoothDevice> deviceslist = new ArrayList<BluetoothDevice>();
    private ArrayList<BluetoothDevice> imulist = new ArrayList<BluetoothDevice>();
    private Boolean checkAmbient = true;
    private Boolean hapticEnabled = true;
    private boolean mTemperatureCompensationEnabled;
    private Vibrator mVibrator;
    private final long hapticSingle = 100;
    private final long[] hapticFinishedPattern = {0, 100, 50, 100};
    private final long[] hapticErrorPattern = {0, 100, 50, 100, 50, 100};

    //    private final ArrayList<MutablePair<BluetoothDevice, Integer>> mDevices = new ArrayList<>();
//    private DevicesAdapter mAdapter;
    private TextView tvColor;
    private TextView tvData;
    private Button bReadD50, bReadD65, bReadDual;
    private RelativeLayout firstSwatch, secondSwatch, temperatureSwitchContainer;
    private SwitchCompat temperatureSwitch;
    private ProgressBar mProgressBar;
    private NixDeviceScanner mScanner;
    private MenuItem bDisconnect;
    private static final String[] mIlluminant = {
            "A/2°",
            "A/10°",
            "C/2°",
            "C/10°",
            "D50/2°",
            "D50/10°",
            "D55/2°",
            "D55/10°",
            "D65/2°",
            "D65/10°",
            "D75/2°",
            "D75/10°"};

    //    private BluetoothManager blemanager = getSystemService(BluetoothManager.class);
    private BluetoothAdapter bleadapter = null;
    private BluetoothLeScanner blescanner = null;
    private boolean scanning = false;
    private static final long scanDuration = 10000;
    private MetaWearBoard imu;
    private BtleService.LocalBinder serviceBinder;

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mScannedColors = new ArrayList<>();

        // Get instance of Vibrator from current context
        mVibrator = (Vibrator) this.getSystemService(Context.VIBRATOR_SERVICE);


        mScanner = new NixDeviceScanner(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                !isBluetoothPermissionGranted(this))
            requestBluetoothPermissions(this);

        getApplicationContext().bindService(new Intent(this, BtleService.class),
                this, Context.BIND_AUTO_CREATE);

        final BluetoothManager blemanager = getSystemService(BluetoothManager.class);
        bleadapter = blemanager.getAdapter();
        blescanner = bleadapter.getBluetoothLeScanner();

        // Get network updates
        NetworkRequest networkRequest = new NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
                .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
                .build();

        ConnectivityManager connectivityManager =
                (ConnectivityManager) getSystemService(ConnectivityManager.class);
        connectivityManager.requestNetwork(networkRequest, networkCallback);




        // Webview

        webView = (WebView) findViewById(R.id.webview);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("MyApplication", consoleMessage.message() + " -- From line " +
                        consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });

        webView.addJavascriptInterface(this, "Android");
        WebSettings webSettings = webView.getSettings();
////
        webSettings.setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());

//        webView.loadUrl("http://3.131.37.239");
        webView.loadUrl("file:///android_asset/ligo-scanner-react-webapp/output/index.html");
//        webView.loadDataWithBaseURL("http://localhost:3000" , "file:///android_asset/ligo-scanner-react-webapp/output/index.html" ,  "text/html" , "UTF-8" , null);


        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);

        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
//        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
//            webView.getSettings().setDatabasePath("/data/data/" + webView.getContext().getPackageName() + "/databases/");
//        }

        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }

        });

//        webView.setDownloadListener(new DownloadListener() {
//
//            @Override
//            public void onDownloadStart(String url, String userAgent,
//                                        String contentDisposition, String mimetype,
//                                        long contentLength) {
//                DownloadManager.Request request = new DownloadManager.Request(
//                        Uri.parse(url));
//
////                request.allowScanningByMediaScanner();
//                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED); //Notify client once download is completed!
//                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "Name of your downloadble file goes here, example: Mathematics II ");
//                DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
//                dm.enqueue(request);
//                Toast.makeText(getApplicationContext(), "Downloading File", //To notify the Client that the file is being downloaded
//                        Toast.LENGTH_LONG).show();
//
//            }
//        });
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                webView.loadUrl(getBase64StringFromBlobUrl(url));
                Log.d("blobURL", url);
            }
        });

        /**************/

//        System.loadLibrary( Core.NATIVE_LIBRARY_NAME )/;
//        webView.getSettings().setPluginState(WebSettings.PluginState.ON);
//        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

    }

    @JavascriptInterface
    public void getBase64FromBlobData(String base64Data) throws IOException {
        convertBase64StringToPdfAndStoreIt(base64Data);
    }
    public static String getBase64StringFromBlobUrl(String blobUrl) {
        if(blobUrl.startsWith("blob")){
            return "javascript: var xhr = new XMLHttpRequest();" +
                    "xhr.open('GET', '"+ blobUrl +"', true);" +
                    "xhr.setRequestHeader('Content-type','application/csv');" +
                    "xhr.responseType = 'blob';" +
                    "xhr.onload = function(e) {" +
                    "    if (this.status == 200) {" +
                    "        var blobPdf = this.response;" +
                    "        var reader = new FileReader();" +
                    "        reader.readAsDataURL(blobPdf);" +
                    "        reader.onloadend = function() {" +
                    "            base64data = reader.result;" +
                    "            Android.getBase64FromBlobData(base64data);" +
                    "        }" +
                    "    }" +
                    "};" +
                    "xhr.send();";
        }
        return "javascript: console.log('It is not a Blob URL');";
    }
    private void convertBase64StringToPdfAndStoreIt(String base64PDf) throws IOException {
        Log.d("base64", base64PDf);
        final int notificationId = 1;
        String currentDateTime = DateFormat.getDateTimeInstance().format(new Date());
        final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS) + "/drillholes_" + currentDateTime.replaceAll("\\s", "_").replaceAll(":", "_").replaceAll(",", "_")  + ".csv");
        byte[] pdfAsBytes = Base64.decode(base64PDf.replaceFirst("^data:text/csv;base64,", ""), 0);
        FileOutputStream os;
        os = new FileOutputStream(dwldsPath, false);
        os.write(pdfAsBytes);
        os.flush();
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('csvDownloaded'))", null);
            }
        });

    }





    @JavascriptInterface
    public int pairedDevices() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return 0;
        } else if ((sensor == null) && (imu == null)) {
            return 1;
        } else if (sensor != null) {
            return 2;
        } else if (imu != null) {
            return 3;
        } else {
            return 4;
        }


    }

    @JavascriptInterface
    public void isPaired() {
        BluetoothAdapter mBtAdapter = BluetoothAdapter.getDefaultAdapter();

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        Set<BluetoothDevice> pairedDevices = mBtAdapter.getBondedDevices();
        Log.d("Tyring", String.valueOf(pairedDevices.size()));
        if (pairedDevices.size() > 0) {
            Log.d("Tyring", "Found some");
            for (BluetoothDevice d: pairedDevices) {
                String deviceName = d.getName();
                String macAddress = d.getAddress();
                Log.i("Paired Devices", "paired device: " + deviceName + " at " + macAddress);
                // do what you need/want this these list items
            }
        }
    }


    private ConnectivityManager.NetworkCallback networkCallback = new ConnectivityManager.NetworkCallback() {
        @Override
        public void onAvailable(@NonNull Network network) {

            super.onAvailable(network);
            Log.d("Connected", "Connected!!");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    Log.d("Posting", "Connected Posted");
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('InternetConnected'))", null);
                }
            });
//            webView.post(new Runnable() {
//                @Override
//                public void run() {
//                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanning'))", null);
//                }
//            });

        }

        @Override
        public void onLost(@NonNull Network network) {
            super.onLost(network);
            Log.d("DisConnected", "No!!!!");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('InternetDisconnected'))", null);
                }
            });
        }

        @Override
        public void onCapabilitiesChanged(@NonNull Network network, @NonNull NetworkCapabilities networkCapabilities) {
            super.onCapabilitiesChanged(network, networkCapabilities);
            final boolean unmetered = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_METERED);
        }
    };



    @JavascriptInterface
    public void scan() {
        Log.d("Permission", String.valueOf(ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)));
        Log.d("permision", String.valueOf(PackageManager.PERMISSION_GRANTED));
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d("denied","Camera denied bro");
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
        }
        Log.d("Yo", "WE here");
//        webView.post(new Runnable() {
//            @Override
//            public void run() {
//                webView.loadUrl("javascript:data()");
//            }
//        });
        mScanner.startDevicesScan(new BluetoothAdapter.LeScanCallback() {

            @Override
            public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {
                // Handle device discovery
                // ...


                if (ActivityCompat.checkSelfPermission(getBaseContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                String deviceAdd = device.getAddress();
                String deviceName = device.getName();
                deviceslist.add(device);

                Log.d("device", device.getName());
                if (deviceName == null)
                    deviceName = NixDeviceScanner.parseAdvertisementDataToName(scanRecord);
                if (NixDeviceCommon.DeviceType.findByAdvertisingName(deviceName) ==
                        NixDeviceCommon.DeviceType.spectro2) {
                    // This is a spectrophotometer type device
                    // ...
                } else {
                    // This is a colorimeter type device
                    // ...
                    String finalDeviceName = deviceName;
                    String finalDeviceAdd = deviceAdd;
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('colorimeterDeviceFound', {detail:{name:'" + "Colorimeter" + "',address:'" + finalDeviceAdd + "', type:'"+"colorimeter"+"'}}))", null);
                        }
                    });
                }
            }
        });

    }

    @JavascriptInterface
    public void isDeviceConnected() {
        if (sensor == null) {

        } else {
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('colorimeterConnected', {detail:{name:'" + sensor.getName() + "',address:'" + sensor.getAddress() + "'}}))", null);
                }
            });

        }

    }

    @JavascriptInterface
    public void connect(String address) {
        mScanner.stopDevicesScan();
        BluetoothDevice device;
        Log.d("Address", address);
        Log.d("array size", String.valueOf(deviceslist.size()));
        for (int i = 0; i < deviceslist.size(); i++) {


            if (address.equals(deviceslist.get(i).getAddress())) {
                Log.d("address", deviceslist.get(i).getAddress() + ", " + String.valueOf(i));
                device = deviceslist.get(i);
                sensor = new NixDevice(getBaseContext(), device, sensorCallback);
                break;
            }
        }

    }

    @JavascriptInterface
    public void disconnect() {
        Log.d("Try disconnect", "Device Disconnecting");
        sensor.disconnect();
    }

    private final IDeviceListener sensorCallback = new IDeviceListener() {
        @Override
        public void onConnectingStarted() {
            Log.d("Connecting", "Connnecting...");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('colorimeterConnecting'))", null);
                }
            });
        }

        @Override
        public void onDeviceReady() {
            Log.d("DeviceReady", "Device Ready");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('colorimeterConnected', {detail:{name: '" + sensor.getName() + "', address:'" + sensor.getAddress() + "', type:'" + "colorimeter" + "'}}))", null);
                }
            });

        }

        @Override
        public void onScanComplete(ArrayList<NixScannedColor> scannedColorsList, ArrayList<NixScannedSpectralData> arrayList1) {
            Log.d("Completed", "Scan Completed");
            NixScannedColor firstScannedColor = scannedColorsList.get(0);

            short[] scanRgb = firstScannedColor.tosRgbValue();

            webView.post(new Runnable() {
                @Override
                public void run() {
//                    webView.loadUrl("javascript:value('"+ String.valueOf(scanRgb[0])+","+ String.valueOf(scanRgb[1])+","+ Strirg.valueOf(scanRgb[2])+"')");
//                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanComplete', {detail:{r:'"+String.valueOf(scanRgb[0])+"',g:'"+String.valueOf(scanRgb[1])+"',b:'"+String.valueOf(scanRgb[2])+"'}}))", null);
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanComplete', {detail:{r:'" + String.valueOf(scanRgb[0]) + "',g:'" + String.valueOf(scanRgb[1]) + "',b:'" + String.valueOf(scanRgb[2]) + "'}}))", null);
                    Log.d("Scan Value", "Value: " + Arrays.toString(scanRgb));
                }
            });


        }

        @Override
        public void onDeviceDisconnected() {
            Log.d("Disconnected", "Device Disconnected");
            sensor = null;
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('colorimeterDisconnected'))", null);
                }
            });
        }

        @Override
        public void onBatteryChanged() {

        }

        @Override
        public void onUsbConnectionChanged() {

        }

        @Override
        public void onApiLocked(String s) {

        }

        @Override
        public void onBluetoothError(int i, String s) {

        }

        @Override
        public void onScanProgress(int i, String s) {

        }
    };

    @JavascriptInterface
    public void scanColor() {
        Log.d("Scan Start", "Scan initiated");
        sensor.runSingleScan(NixDevice.SCAN_TYPE_D50, true);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {

        if (keyCode == 24) {

            if (sensor != null) {
                Log.d("key pressed", sensor.getName());
//                Log.d("key pressed", String.valueOf(keyCode));
                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanning'))", null);
                    }
                });
                scanColor();
                return true;
            }
            else {
                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('noDevices'))", null);
                    }
                });
            }


        }

        return false;
    }

    @JavascriptInterface
    public void stopBLEScan() {
        scanning = false;
    }

    //    IMU Orientation device
    @JavascriptInterface
    public void orientationScan() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        blescanner.startScan(new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                scanning = true;
                super.onScanResult(callbackType, result);
                if (ActivityCompat.checkSelfPermission(getBaseContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                if (String.valueOf(result.getDevice().getName()).equals("MetaWear") && scanning) {
                    Log.d("scanning", String.valueOf(result.getDevice().getName()));
                    imulist.add(result.getDevice());
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('orientationDeviceFound', {detail:{name:'" + "Orientation" + "',address:'" + result.getDevice().getAddress() + "', type:'"+"orientation"+"'}}))", null);
                        }
                    });
                }

            }
        });
    }

    @JavascriptInterface
    public void orientationConnect(String address) {
        final BluetoothDevice device = bleadapter.getRemoteDevice(address);
        Log.d("Address", address);
        Log.d("array size", String.valueOf(imulist.size()));
//        for (int i = 0; i < imulist.size(); i++) {
//
//
//            if (address.equals(imulist.get(i).getAddress())) {
//                Log.d("address", imulist.get(i).getAddress() + ", " + String.valueOf(i));
//
//                break;
//            }
//        }
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('orientationConnecting', {detail:{address:'" + device.getAddress() + "', type:'" + "orientation" + "'}}))", null);
            }
        });

        imu = serviceBinder.getMetaWearBoard(device);
        imu.connectAsync().continueWith(new Continuation<Void, Object>() {
            @Override
            public Void then(Task<Void> task) throws Exception {
                if (task.isFaulted()) {
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('orientationFailedConnect', {detail:{address:'" + device.getAddress() + "', type:'" + "orientation" + "'}}))", null);
                        }
                    });
                    Log.d("failed connect", "Failed IMU connection");
                }
                else {
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('orientationConnected', {detail:{address:'" + device.getAddress() + "', type:'" + "orientation" + "'}}))", null);
                        }
                    });
                    Log.d("yay", "Connected to IMU");
                }
                return null;
            }

        });

    }

    @JavascriptInterface
    public void orientationDisconnect() {
        imu.disconnectAsync().continueWith(new Continuation<Void, Object>() {
            @Override
            public Void then(Task<Void> task) throws Exception {
                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('orientationDisconnect'))", null);
                    }
                });
                return null;
            }
        });
    }

    @JavascriptInterface
    public void getangles() {
        final SensorFusionBosch sensorFusion = imu.getModule(SensorFusionBosch.class);
        sensorFusion.configure()
                .mode(SensorFusionBosch.Mode.NDOF)
                .accRange(SensorFusionBosch.AccRange.AR_2G)
                .gyroRange(SensorFusionBosch.GyroRange.GR_250DPS)
                .commit();
        sensorFusion.quaternion().addRouteAsync(source -> source.limit(33).stream((data, env) -> {
//            Log.d("quarternions", data.value(Quaternion.class).toString());
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('angles', {detail:{w:'" + data.value(Quaternion.class).w() + "', x:'" + data.value(Quaternion.class).x() + "', y:'" + data.value(Quaternion.class).y() + "', z:'" + data.value(Quaternion.class).z() + "'}}))", null);
                }
            });
        })).continueWith((Continuation<Route, Void>) ignored -> {
            sensorFusion.quaternion().start();
            sensorFusion.start();
            return null;
        });
    }

    @JavascriptInterface
    public void startCamera() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d("denied","Camera denied bro");
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
        }
        else {
//            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            Intent intent = new Intent(android.provider.MediaStore.INTENT_ACTION_VIDEO_CAMERA);
            startActivity(intent);
        }

    }

    @JavascriptInterface
    public String getFile() throws IOException {
        if (ContextCompat.checkSelfPermission(
                getBaseContext(), Manifest.permission.READ_EXTERNAL_STORAGE) ==
                PackageManager.PERMISSION_GRANTED) {
            String path = Environment.getExternalStorageDirectory().toString()+"/DCIM/Camera";
//        String path = "/storage/sdcard0/DCIM/Camera/";
            Log.d("Files", "Path: " + path);
//        File directory = new File(path);
            File dcimDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).toString()+"/Camera");
            File[] files = dcimDir.listFiles();
            Log.d("Files", "Size: "+ files.length);
            Log.d("Files", "FileName:" + files[files.length-1].getName());
            Path mypath = Paths.get(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).toString()+"/Camera/"+files[files.length-1].getName());
            long bytes = Files.size(mypath);
            Log.d("File size", String.valueOf(bytes/1024));
            return files[files.length-1].getName();
        }
        else {
            // You can directly ask for the permission.
            // The registered ActivityResultCallback gets the result of this request.
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
            return null;
        }


    }


    //    Laser Device
    private static String[] requiredBluetoothPermissions() {
        ArrayList<String> requiredPermissions = new ArrayList<>();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            requiredPermissions.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            requiredPermissions.add(Manifest.permission.ACCESS_FINE_LOCATION);
        } else {
            requiredPermissions.add(Manifest.permission.BLUETOOTH_SCAN);
            requiredPermissions.add(Manifest.permission.BLUETOOTH_CONNECT);
        }
        return requiredPermissions.toArray(new String[0]);
    }

    private static boolean isBluetoothPermissionGranted(Activity activity) {
        ArrayList<String> missingPermissions = new ArrayList<>();
        for (String permission : requiredBluetoothPermissions())
            if (ContextCompat.checkSelfPermission(activity, permission) != PackageManager.PERMISSION_GRANTED)
                missingPermissions.add(permission);

        return missingPermissions.isEmpty();
    }

    private static void requestBluetoothPermissions(Activity activity) {
        ActivityCompat.requestPermissions(activity, requiredBluetoothPermissions(), PERMISSION_REQUEST_BLUETOOTH);
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        serviceBinder = (BtleService.LocalBinder) service;
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {

    }



}