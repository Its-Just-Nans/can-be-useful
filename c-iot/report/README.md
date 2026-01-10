# RIO 201 project

## Introduction

The objective of this project is to implement an IoT application. The IoT application should use several sensors and network requests.
We should use the [IoT Lab](https://www.iot-lab.info/).

To simplify the task for the IoT lab deployment (which can be quite difficult), I used the Enoslib library.

\newpage

## Architecture

The goal of my architecture is to simulate IoT devices in a clean room.

In a clean room, the temperature needs to be controlled. The same for the pressure which needs to be always bigger than the outside pressure. In a clean rooms there are also alarms button to press in case of emergency. Also there are also sometimes heavy lifting machines. All these aspect are in my architecture. Finally, in a cleanroom there is also a central computer that controls everything.

This architecture is composed of 3 major parts:

- The central server controls the temperature and the pressure by getting them every 10 seconds. The results can then be displayed on a graph.
- The heavy lifting machine is also managed by sending a threshold to an actuator. If the threshold is above the threshold, the actuator will stop.
- When the alarm is triggered (in real life, we press a button, but here we can trigger it from the SSH connection), the server will be alerted.

![Architecture](./img/archi.png)

The main part of our architecture is the central server which represents the central computer. The central server contains four things:

- a CoAP server
- a HTTP server
- a HTTP client
- a CoAP client

\newpage

### Data collection

![data](./img/data.png)

The first part of this diagram is the data collection. It is composed of 2 captors. The central server use its CoAP client and HTTP client to make a request to the captors to get the data every 10 seconds.
As we want to compare both HTTP and CoAP, each captor is using a different protocol.

The code for to get the data from the CoAP server is quite simple.

```c
#define NUMBER_VALUES 10
static float lights_values[NUMBER_VALUES];
int counter_light = 0;
void callback(void *response)
{
  const uint8_t *chunk;

  int len = coap_get_payload(response, &chunk);
  printf("Adding: %.*s\n", len, (char *)chunk);
  // add to the list of values
  float val = atof((char *)chunk);
  lights_values[counter_light] = val;
  counter_light = (counter_light + 1) % NUMBER_VALUES;
}

PROCESS_THREAD(er_example_client, ev, data)
{
  PROCESS_BEGIN();
  static coap_packet_t request[1];
  SERVER_NODE(&server_ipaddr);
  coap_init_engine();
  etimer_set(&et, TOGGLE_INTERVAL * CLOCK_SECOND);
  while (1)
  {
    PROCESS_YIELD();
    if (etimer_expired(&et))
    {
      coap_init_message(request, COAP_TYPE_CON, COAP_GET, 0);
      coap_set_header_uri_path(request, "/temp");
      COAP_BLOCKING_REQUEST(&server_ipaddr, REMOTE_PORT, request, callback);
      etimer_reset(&et);
    }
  }

  PROCESS_END();
}
```

For HTTP it's the same logic but with a HTTP client. We also need a second callback to save values in another list.

To retrieve the data from the central server and display it on a graph. We use the HTTP server (of the central server) with a json response

From the ssh frontend, we can do in python

```python
from requests import get
req = get('http://[2001:660:4403:0483::2855]/temp')
print(rep.json())
# then do a graph with the data...
```

The code on the HTTP server is just a callback that will send the data to the client (in JSON format)

```c
PROCESS(webserver_process, "Web server");
PROCESS_THREAD(webserver_process, ev, data)
{
  PROCESS_BEGIN();
  httpd_init();
  while (1)
  {
    PROCESS_WAIT_EVENT_UNTIL(ev == tcpip_event);
    httpd_appcall(data);
  }
  PROCESS_END();
}
AUTOSTART_PROCESSES(&webserver_process);

static PT_THREAD(return_temp(struct httpd_state *s))
{
  PSOCK_BEGIN(&s->sout);
  SEND_STRING(&s->sout, "[");
    for (int i = 0; i < NUMBER_VALUES; ++i) {
        printf("%.1f", lights_values[i]);
        if (i < NUMBER_VALUES - 1) {
            printf(",");
        }
    }
  SEND_STRING(&s->sout, "]");
  PSOCK_END(&s->sout);
}

static PT_THREAD(return_pressure(struct httpd_state *s))
{
  PSOCK_BEGIN(&s->sout);
  SEND_STRING(&s->sout, "[");
    for (int i = 0; i < NUMBER_VALUES; ++i) {
        printf("%.1f", pressures_values[i]);
        if (i < NUMBER_VALUES - 1) {
            printf(",");
        }
    }
  SEND_STRING(&s->sout, "]");
  PSOCK_END(&s->sout);
}

httpd_simple_script_t
httpd_simple_get_script(const char *name)
{
    if(strncmp(s->filename, "/temp", 5) == 0) {
        return return_temp;
    }else if(strncmp(s->filename, "/pressure", 9) == 0) {
        return return_pressure;
    }
}
```

We can see that in the http_handler `httpd_simple_get_script` we use the correct function depending on the requested URL.
Then we just print the data as a JSON array.

\newpage

### Threshold for the autonomous actuator

![threshold](./img/threshold.png)

The autonomous captor is a captor that can move. We can set a threshold from the central server. If the captor is above the threshold, it will stop.

In a real application this captor would be an actuator.

First, the user (from the SSH frontend) can set a threshold to the actuator using a CoAP request.

```sh
aiocoap-client -m POST -p "10" coap://[2001:660:4403:0483::2855]:5383/threshold
```

Then, the central server send the threshold by making a request to an the autonomous actuator. The autonomous actuator will then stop the motor if the threshold is above the threshold.

```c
// on the main file of the server
extern resource_t
    res_gyro;

rest_activate_resource(&res_gyro, "threshold");

// on the res_gyro.c
RESOURCE(res_gyro,
         "title=\"THRESHOLD_MOTOR\"",
         res_get_handler,
         NULL,
         NULL,
         NULL);

bool motor_running = true;

static void
res_get_handler(void *request, void *response, uint8_t *buffer, uint16_t preferred_size, int32_t *offset)
{
    const char *len = NULL;
    // we stop the actuator if the threshold is above the threshold
    int x = acc_sensor.value(ACC_MAG_SENSOR_X);
    if(REST.get_query_variable(request, "thres", &len)) {
        int threshold = atoi(len);
        if (x > threshold)
        {
            // we stop the motor
            motor_running = false;
        }else{
            motor_running = true;
        }
    }
}
```

\newpage

### Alarm

![Alarm](./img/alarm.png)

The final part is an alarm, this alarm is made by an alarm sensor. To be realistic, this alarm can be trigerred from the SSH connection using a CoAP request. Another solution would be to use a button to trigger the alarm or randomly trigger it.

To trigger the alarm, we do

```sh
aiocoap-client coap://[2001:660:4403:0483::2855]:5383/alarm
```

On the alarm, there are a CoAP server and a coap client.

The coap server is using a alarm ressource. When the alarm endpoint is hitted, the alarm is sent to the server using a CoAP get to the server. The server can then print an alert.

```c
// on the main file of the alarm
extern resource_t
    res_alarm;

rest_activate_resource(&res_alarm, "alarm");

// on the res_alarm.c
RESOURCE(res_alarm,
         "title=\"SEND_ALARM\"",
         res_get_handler,
         NULL,
         NULL,
         NULL);

static void
res_get_handler(void *request, void *response, uint8_t *buffer, uint16_t preferred_size, int32_t *offset)
{
    coap_init_message(request, COAP_TYPE_CON, COAP_GET, 0);
    coap_set_header_uri_path(request, "/alarm");
    COAP_BLOCKING_REQUEST(&server_ipaddr, REMOTE_PORT, request, client_chunk_handler);
}
```

For the CoAP server receiving the alarm (on the server), it's the same code but we just need to print an alert.

\newpage

## Demonstration

As explained previously, we used the Enoslib library. It's a python library (made by the INRIA research center) that allows to deploy IoT lab experiments.

The repository is available on the INRIA gitlab [https://gitlab.inria.fr/discovery/enoslib](https://gitlab.inria.fr/discovery/enoslib).

During the project, I had to fix some bug in the library.

The pull request is available on online: [https://gitlab.inria.fr/discovery/enoslib/-/merge_requests/214](https://gitlab.inria.fr/discovery/enoslib/-/merge_requests/214).

To deploy our experiment, we just need to provide a correct configuration schema and the correct images to flash.

First we need to install the Enoslib and to setup the authentification file.

```sh
# download dependencies
python -m pip install enoslib[iotlab]

# create the auth file
ENC_PASS=$(printf '%s' pass | base64)
echo -n user:$ENC_PASS > ~/.iotlabrc
```

In the configuration object of enoslib, if we want to reserve a node, we have two solutions.

The first solution is to use a random device, to do that, we can specify a node like this:

```python
machines = [
    {
        "roles": ["sensor", "mysensor"],
        "archi": "m3:at86rf231",
        "site": "lille",
        "number": 1,
        "image": path_to_image,
    },
]
```

To reserve a specific node that we know, we can reserve it using his name :

```python
machines = [
    {
        "roles": ["sensor", "mysensor"],
        "hostname": ["m3-66.lille.iot-lab.info"],
        "image": path_to_image,
    },
]
```

After creating the configuration, we can deploy our experiment:

```python
conf = en.IotlabConf.from_dictionary(provider_conf)
p = en.Iotlab(conf)
roles, networks = p.init()
```

Then we can use the roles from the configuration to get the node we want and use them. For example, we can access to the serial connection, the same as `nc <node> 20000`:

```python
sender = roles["mysensor"][0]
with en.IotlabSerial(sender, interactive=True) as sender:
    data = sender.read()
    print(data)
```

Finally we can automatically clear the experiment:

```python
try:
    roles, networks = p.init()
    # do something
except Exception as e:
    print(e)
finally:
    p.shutdown()
```

The main script main.py is doing all the job, even the compilation. But note that for the compilation, you will need the correct tools installed on your computer.

My main config looks like that:

```python
provider_conf = {
    "walltime": "01:00",
    "resources": {
        "machines": [
            {
                "roles": [
                    "router",
                ],
                "hostname": [f"m3-65.{SITE}.iot-lab.info"],
                "image": join(
                    folder_contiki,
                    "examples",
                    "ipv6",
                    "rpl-border-router",
                    "border-router.iotlab-m3",
                ),
            },
            {
                "roles": ["sensor", "toto"],
                "hostname": [f"m3-66.{SITE}.iot-lab.info"],  # 1857
                "image": join(
                    examples_folder,
                    "er-rest-example",
                    "er-example-client.iotlab-m3",
                ),
            },
            {
                "roles": ["sensor", "captor"],
                "hostname": [f"m3-67.{SITE}.iot-lab.info"],  # 1957
                "image": join(
                    examples_folder,
                    "er-rest-example",
                    "er-example-server.iotlab-m3",
                ),
            },
            {
                "roles": ["http-server"],
                "hostname": [f"m3-69.{SITE}.iot-lab.info"],  # 2855
                "image": join(
                    examples_folder,
                    "ipv6",
                    "http-server",
                    "http-server.iotlab-m3",
                ),
            },
        ],
    },
}
```

### Problems

- The major problem of the IoT lab are the **network connections**. During my tests I had a lot of trouble to connect the nodes between them. To achieve this, I employed a workaround by utilizing the UID of the nodes: if I know which node I use, I also know the UID. And the UID is used to create the IPv6 address of the node.

- My second problem was the **compilation**. Because I used a lot a different part of the code, I had some problem with the compilation. I think the contiki project is great but a more high level functions sould be available. Also another problem is that contiki used a **lot** of preprocessor directives so it's kind of hard to understand what is going on.

## CoAP vs HTTP

In TP we alreay saw that the CoAP is faster than HTTP. But we can verify that by adding some timers in the code.

```c
static clock_time_t start_time;

// in the callback
clock_time_t end_time = clock_time();
double elapsed_time = ((double)(end_time - start_time)) / CLOCK_SECOND;
printf("Elapsed time: %f\n", elapsed_time);

// before the request
start_time = clock_time();
```

This code can validate once again that the CoAP is faster than HTTP.

\newpage

## Conclusion

This project was interesting. I learned a lot about the usage of the Enoslib (but I think there is more to discover because the library is quite big). I also learned how to make a simple IoT application in the IoT Lab and how to deploy it (easily using the enoslib). I also learned how to use the contiki project.

Here are some references:

- [IoT Lab - https://www.iot-lab.info/](https://www.iot-lab.info/)
- [Enoslib repository - https://gitlab.inria.fr/discovery/enoslib](https://gitlab.inria.fr/discovery/enoslib)
- [Enoslib documentation - https://discovery.gitlabpages.inria.fr/enoslib/](https://discovery.gitlabpages.inria.fr/enoslib/)
- [RIO 201 course - https://sites.google.com/view/rio201-2021](https://sites.google.com/view/rio201-2021)
- [Timers in Contiki - https://docs.contiki-ng.org/en/develop/doc/programming/Timers.html](https://docs.contiki-ng.org/en/develop/doc/programming/Timers.html)
