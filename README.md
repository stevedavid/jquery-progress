# jQuery.Progress
A simple jQuery plugin to make any progress bar go live based on [**S**erver **S**ent **E**vents](http://www.w3.org/TR/2011/WD-eventsource-20110208). The purpose is to animate the element's CSS property `width` from `0%` to `100%` based on what the back-end script sends back.

## Releases
* **v1.0** - 30/07/0215

## Requirements
`jQuery.Progress` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
* **HTML**

By default, this plugin works great with [Bootstrap progress bars](http://getbootstrap.com/components/#progress) but it can handle any DOMElement.
```html
<div class="progress">
    <div class="progress-bar progress-bar-striped active" style="width: 0%">
        <span id="progress-percent">0%</span>
    </div>
</div>
```

* **jQuery**

The syntax of `jQuery.Progress`'s initialization is the following:
```javascript
$('.progress-bar').Progress({
    url: '/event-source',
    animationDuration: 1000,
    percentSelector: '#progress-percent',
    classes: {
        success: 'progress-bar-success',
        error: 'progress-bar-error',
        pending: 'progress-bar-warning'
    }
});
```

* **Back-end script**

The back-end script can be developed in whatever language you feel the most comfortable with. The only requirements here are:
* the script must output the following string: `data: incrementingInteger\n\n` every `X` second.
* the first event that fires needs to output the maximum value: `data: maxInteger\n\n` (this will be used to calculate to progress percentage and won't be used to animate the targetted DOMElement)

Therefore, here's an exemple of what to do in `PHP`:
```PHP
<?php
header('Content-Type: text/event-stream'); // mandatory headers for SSE to work
header('Cache-Control: no-cache'); // mandatory headers for SSE to work
$max = 15; // set the maximum value
echo 'data:'.$max."\n\n"; // outputs the maximum value as the first event
flush(); // flushes the buffer
for($i = 1; $i <= $max; $i++) { // loop initialization
    echo 'data:'.$i."\n\n"; // server's output
    flush(); // flushes the buffer
    usleep(500000); // sleep 0.5s
}
```


## Options
Name | Type | Default | Description
------------ | ------------- | ------------- | -------------
url | string | *(none)* | The URL to fetch the data from.
animationDuration | integer | 0 | The duration (in `ms`) of the animation for each step
percentSelector | string | *(none)* | A string that represents the jQuery selector where the value (in `%`) will be updated on each step
classes | object | *(none)* | An object containing all three different classes based on different events: `{success: '', error: '', pending: ''}`

## Licence
Copyright (c) 2015 Steve David

Licensed under the MIT license.
