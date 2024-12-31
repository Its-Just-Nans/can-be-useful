# ShowDownJS problem with `&`

The result of this program is :

```c
#include <stdio.h>

int main(){
    int number = 7;
    int *pointerTOnumber = &amp;number;
}
```

When we use a `<pre>` tag as source we can see that the `&` is replaced by `&amp;` which is not what we want.

Made in 2020-12-18
