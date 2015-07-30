# jQuery.Progress
A simple jQuery plugin to animate a Bootstrap progress bar based on [**S**erver **S**ent **E**vents](http://www.w3.org/TR/2011/WD-eventsource-20110208).

## Requirements
`jQuery.Progress` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
By default, this plugin works great with [Bootstrap progress bars](http://getbootstrap.com/components/#progress) but it can handle any DOMElement. The purpose is to animate the element's CSS property `width` from `0%` to `100%` based on what the back-end script sends back.

```html
<div class="progress">
    <div class="progress-bar progress-bar-striped active" style="width: 0%">
        <span id="progress-percent">0%</span>
    </div>
</div>
```

The syntax of `jQuery.Progress`'s initialization is the following:

````javascript
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

## Options
Name | Type | Default | Description
------------ | ------------- | ------------- | -------------
url | string | *(none)* | The URL to fetch the data from.
animationDuration | integer | 0 | The duration (in ms) of the animation for each step
percentSelector | string | *(none)* | A string that represents the jQuery selector where the value (in %) will be updated on each step
classes | object | *(none)* | An object containing all three different classes based on different events: `{success: '', error: '', pending: ''}`

## Licence
Copyright (c) 2015 Steve David

Licensed under the MIT license.
