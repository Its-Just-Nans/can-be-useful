
package com.example.testapplication;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;

import android.os.Bundle;
import android.os.StrictMode;
import android.widget.TextView;

import org.json.JSONObject;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends AppCompatActivity {
    private TextView text;
    private TextView text2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //set id
        text = findViewById(R.id.text);
        text2 = findViewById(R.id.text2);
        text.setText("NULL");
        //create client
        OkHttpClient client = new OkHttpClient();
        String url = "https://discord.com/api/webhooks/blablabla/blablabla";
        JSONObject jo = new JSONObject();
        String json = "";
        try {
                jo.put("username", "android");
                jo.put("content", "from android");
                json = jo.toString(4);
        }catch (Exception e){

        }
        //create body
        RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
        //send
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }
            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    final String myResponse = response.body().string();
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            text2.setText(myResponse);
                        }
                    });
                }
            }
        }
    }
}