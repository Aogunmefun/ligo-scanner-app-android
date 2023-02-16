package com.example.app;

import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;
import android.text.Layout;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.AlignmentSpan;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.nix.nixsensor_lib.IDeviceListener;
import com.nix.nixsensor_lib.NixDevice;
import com.nix.nixsensor_lib.NixDeviceCommon;
import com.nix.nixsensor_lib.NixDeviceScanner;
import com.nix.nixsensor_lib.NixScannedColor;
import com.nix.nixsensor_lib.NixScannedSpectralData;

import android.webkit.WebView;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;


public class MainActivity extends AppCompatActivity {

    private static final String TAG = com.example.app.MainActivity.class.getSimpleName();
    private static final int PERMISSION_REQUEST_BLUETOOTH = 1000;
    private NixDevice sensor;
    private ArrayList<NixScannedColor> mScannedColors;
    private ArrayList<BluetoothDevice> deviceslist = new ArrayList<BluetoothDevice>();
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
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mScannedColors = new ArrayList<>();

        // Get instance of Vibrator from current context
        mVibrator = (Vibrator) this.getSystemService(Context.VIBRATOR_SERVICE);

        webView = (WebView) findViewById(R.id.webview);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("MyApplication", consoleMessage.message() + " -- From line " +
                        consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });
//        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.addJavascriptInterface(this, "Android");
        WebSettings webSettings = webView.getSettings();

        webSettings.setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());

//        webView.loadUrl("file:///android_asset/index.html");
        webView.loadUrl("file:///android_asset/ligo-scanner-react-webapp/output/index.html");
        mScanner = new NixDeviceScanner(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                !isBluetoothPermissionGranted(this))
            requestBluetoothPermissions(this);


    }


    @JavascriptInterface
    public void scan() {
        Log.d("Yo", "WE here");
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.loadUrl("javascript:data()");
            }
        });
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
                        NixDeviceCommon.DeviceType.spectro2)
                {
                    // This is a spectrophotometer type device
                    // ...
                }
                else
                {
                    // This is a colorimeter type device
                    // ...
                    String finalDeviceName = deviceName;
                    String finalDeviceAdd = deviceAdd;
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
//                            webView.loadUrl("javascript:newDevice('"+finalDeviceName+","+"Colorimeter"+","+finalDeviceAdd+"')");
                            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('deviceFound', {detail:{name:'"+finalDeviceName+"',address:'"+finalDeviceAdd+"',type:'"+"Colorimeter"+"'}}))", new ValueCallback<String>() {
                                @Override
                                public void onReceiveValue(String value) {
                                    Log.d("eventDispatch", value);
                                }


                            });
                        }
                    });
                }
            }
        });

    }

    @JavascriptInterface
    public void isDeviceConnected() {
        if (sensor == null) {

        }
        else {
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('connected', {detail:{name:'"+sensor.getName()+"',address:'"+sensor.getAddress()+"',type:'"+"Colorimeter"+"'}}))", null);
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
        for (int i=0; i < deviceslist.size(); i++) {


            if (address.equals(deviceslist.get(i).getAddress())) {
                Log.d("address",deviceslist.get(i).getAddress()+", "+String.valueOf(i));
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
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('connecting'))",null);
                }
            });
        }

        @Override
        public void onDeviceReady() {
            Log.d("DeviceReady","Device Ready");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('connected', {detail:{address:'"+sensor.getAddress()+"'}}))", null);
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
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanComplete', {detail:{r:'"+String.valueOf(scanRgb[0])+"',g:'"+String.valueOf(scanRgb[1])+"',b:'"+String.valueOf(scanRgb[2])+"'}}))", null);
                }
            });

            Log.d("Scan Value", "Value: " + Arrays.toString(scanRgb));
        }

        @Override
        public void onDeviceDisconnected() {
            Log.d("Disconnected", "Device Disconnected");
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('disconnected'))",null);
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
                Log.d("key pressed", String.valueOf(keyCode));
                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('scanning'))",null);
                    }
                });
                scanColor();
                return true;
            }


        }

        return false;
    }

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

}